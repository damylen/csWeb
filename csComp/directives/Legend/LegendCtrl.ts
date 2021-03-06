module Legend {
    // created 12 May 2015, RPS, TNO
    // TODO1: decide how to determine which legend (from which layer) shows up immediately after loading
    // currently the last added layer shows up which is the netatmo layer in csMapUS.
    // And after a reload (refresh), the one for the current indicator's layer shows up
    // TODO2: disappear when empty -> reopen legend for the most recently activated layer that is still active
    // TODO3: positioning: from bottom up (using "bottom" in the project.json file didn't work)
    // TODO4: provide possibility to not show a legend at all. Either by a hide button (but how to show then)
    // or via a project/user setting

    export class LegendData {
        propertyTypeKey: string;
        mode: string;
    }

    export interface ILegendDirectiveScope extends ng.IScope {
        vm: LegendCtrl;
        data: LegendData;
        legend: csComp.Services.Legend;
    }

    export class LegendCtrl {
        private scope: ILegendDirectiveScope;

        private widget: csComp.Services.IWidget;

        private passcount: number = 1;

        private subscribeHandle: csComp.Services.MessageBusHandle;

        // $inject annotation
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            'layerService',
            'messageBusService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: ILegendDirectiveScope,
            private $layerService: csComp.Services.LayerService,
            private $messageBus: csComp.Services.MessageBusService
            ) {
            $scope.vm = this;
            var par = <any>$scope.$parent;
            this.widget = (par.widget);
            //console.log(JSON.stringify(this.widget.data));
            //$scope.title = this.widget.title;
            //$scope.timestamp = '19:45';
            if (this.widget && this.widget.data) $scope.data = <LegendData>this.widget.data;
            //$scope.s1 = $scope.data.propertyTypeKey;
            if (this.widget && this.widget.data && this.widget.data.hasOwnProperty('propertyTypeKey')) var ptd = this.$layerService.propertyTypeData[$scope.data.propertyTypeKey];
            //if (ptd) $scope.s2 = ptd.title;
            //$scope.s3 = 'passcount=' + this.passcount.toString();
            // if ($scope.data.mode = 'lastSelectedStyle') {
            //     $scope.legend = this.createLegend($scope.data.propertyTypeKey);
            // }
            if ($scope.data && $scope.data.mode === 'lastSelectedStyle') {
                $scope.legend = this.createLegend();
                if ($scope.$parent.hasOwnProperty('widget')) {
                    if (!$scope.legend.hasOwnProperty('legendEntries')) {
                        (<any>$scope.$parent).widget['enabled'] = false;
                    } else {
                        (<any>$scope.$parent).widget['enabled'] = true;
                    }
                }

                if (!this.subscribeHandle) {
                    this.subscribeHandle = this.$messageBus.subscribe("updatelegend", (title: string, ptdataKey: string) => {
                        switch (title) {
                            case 'removelegend':
                                this.$messageBus.unsubscribe(this.subscribeHandle);
                                break;
                            default:
                                if (ptd && ptd.legend) {
                                    $scope.legend = ptd.legend;
                                }
                                if ($scope.data.mode = 'lastSelectedStyle') {
                                    $scope.legend = this.createLegend();
                                    if ($scope.$parent.hasOwnProperty('widget')) {
                                        if (!$scope.legend.hasOwnProperty('legendEntries')) {
                                            (<any>$scope.$parent).widget['enabled'] = false;
                                        } else {
                                            (<any>$scope.$parent).widget['enabled'] = true;
                                        }
                                    }
                                }
                                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
                        }
                    });
                }
            }
        }

        createLegend(): csComp.Services.Legend {
            var leg = new csComp.Services.Legend();
            var activeStyle: csComp.Services.GroupStyle;
            this.$layerService.project.groups.forEach((g) => {
                g.styles.forEach((gs) => {
                    if (gs.enabled) {
                        activeStyle = gs;
                    }
                });
            });
            if (!activeStyle) return leg;

            var ptd: csComp.Services.IPropertyType = this.$layerService.propertyTypeData[activeStyle.property];
            if (!ptd) return leg;
            leg.id = ptd.label + 'legendcolors';
            leg.legendKind = 'interpolated';
            leg.description = ptd.title;
            leg.legendEntries = [];
            if (activeStyle.activeLegend && activeStyle.activeLegend.legendEntries) {
                activeStyle.activeLegend.legendEntries.forEach(le => {
                    leg.legendEntries.push(le);
                });
            } else {
                leg.legendEntries.push(this.createLegendEntry(activeStyle, ptd, activeStyle.info.sdMin));
                leg.legendEntries.push(this.createLegendEntry(activeStyle, ptd, (activeStyle.info.sdMin + activeStyle.info.sdMax) / 4));
                leg.legendEntries.push(this.createLegendEntry(activeStyle, ptd, 2 * (activeStyle.info.sdMin + activeStyle.info.sdMax) / 4));
                leg.legendEntries.push(this.createLegendEntry(activeStyle, ptd, 3 * (activeStyle.info.sdMin + activeStyle.info.sdMax) / 4));
                leg.legendEntries.push(this.createLegendEntry(activeStyle, ptd, activeStyle.info.sdMax));
            }
            return leg;
        }

        createLegendEntry(activeStyle: csComp.Services.GroupStyle, ptd: csComp.Services.IPropertyType, value: number) {
            var le = new csComp.Services.LegendEntry();
            le.label = csComp.Helpers.convertPropertyInfo(ptd, value);
            if (le.label === value.toString()) {
                //if no stringformatting was applied, define one based on maximum values
                if (activeStyle.info.sdMax > 100) {
                    le.label = (<any>String).format("{0:#,#}", value);
                } else {
                    le.label = (<any>String).format("{0:#,#.#}", value);
                }
            }
            le.value = value;
            le.color = csComp.Helpers.getColor(value, activeStyle);
            return le;
        }

        getStyle(legend: csComp.Services.Legend, le: csComp.Services.LegendEntry, key: number) {
            var style = {
                'float': 'left',
                'position': 'relative',
                'top': '10px',
                'background': `linear-gradient(to bottom, ${le.color}, ${legend.legendEntries[legend.legendEntries.length - key - 2].color})`,
                'border-left': '1px solid black',
                'border-right': '1px solid black'
            }
            if (key === 0) {
                style['border-top'] = '1px solid black';
            } else if (key === legend.legendEntries.length - 2) {
                style['border-bottom'] = '1px solid black';
            }
            return style;
        }

    }
}
