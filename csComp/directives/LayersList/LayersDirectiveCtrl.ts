module LayersDirective {
    export interface ILayersDirectiveScope extends ng.IScope {
        vm: LayersDirectiveCtrl;
        options: Function;
    }

    export class LayersDirectiveCtrl {
        private scope: ILayersDirectiveScope;
        private allCollapsed: boolean;

        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            'layerService',
            'messageBusService',
            'mapService',
            'dashboardService',
            '$modal'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: ILayersDirectiveScope,
            private $layerService: csComp.Services.LayerService,
            private $messageBusService: csComp.Services.MessageBusService,
            private $mapService: csComp.Services.MapService,
            private $dashboardService: csComp.Services.DashboardService,
            private $modal: any) {
            $scope.vm = this;
            $scope.options = ((layer: csComp.Services.ProjectLayer) => {
                if (!layer.enabled) return null;
                if (layer.layerSource) {
                    return layer.layerSource.layerMenuOptions(layer);
                }
            });
            this.allCollapsed = false;
            this.$messageBusService.subscribe('project', (title: string, project: csComp.Services.Project) => {
                if (title !== 'loaded' || !project) return;
                if (project.hasOwnProperty('collapseAllLayers') && project.collapseAllLayers === true){
                    this.collapseAll();
                    this.allCollapsed = true;
                } else {
                    this.allCollapsed = false;
                }
            });
        }

        public editGroup(group: csComp.Services.ProjectGroup) {
            var rpt = csComp.Helpers.createRightPanelTab('edit', 'groupedit', group, 'Edit group', 'Edit group');
            this.$messageBusService.publish('rightpanel', 'activate', rpt);
        }

        public editLayer(layer: csComp.Services.ProjectLayer) {
            var rpt = csComp.Helpers.createRightPanelTab('edit', 'layeredit', layer, 'Edit layer', 'Edit layer');
            this.$messageBusService.publish('rightpanel', 'activate', rpt);
        }

        public openLayerMenu(e) {
            //e.stopPropagation();
            (<any>$('.left-menu')).contextmenu('show', e);
            //alert('open layers');
        }

        public addLayer() {
            var modalInstance = this.$modal.open({
                templateUrl: 'directives/LayersList/AddLayerView.tpl.html',
                controller: AddLayerCtrl,
                resolve: {
                    //mca: () => newMca
                }
            });
            modalInstance.result.then((s: any) => {
                console.log('done adding');
                console.log(s);
                // this.showSparkline = false;
                // this.addMca(mca);
                // this.updateMca();
                //console.log(JSON.stringify(mca, null, 2));
            }, () => {
                    //console.log('Modal dismissed at: ' + new Date());
                });
        }

        public toggleLayer(layer: csComp.Services.ProjectLayer): void {
            $(".left-menu").on("click", function(clickE) {
                //alert('context menu');
                (<any>$(this)).contextmenu({ x: clickE.offsetX, y: clickE.offsetY });
            });
            //layer.enabled = !layer.enabled;
            //if (this.$layerService.loadedLayers.containsKey(layer.id)) {
            // Unselect when dealing with a radio group, so you can turn a loaded layer off again.
            if (layer.group.oneLayerActive && this.$layerService.findLoadedLayer(layer.id)) layer.enabled = false;
            if (layer.enabled) {
                this.$layerService.addLayer(layer);
            } else {
                this.$layerService.removeLayer(layer);
            }

            // NOTE EV: You need to call apply only when an event is received outside the angular scope.
            // However, make sure you are not calling this inside an angular apply cycle, as it will generate an error.
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        }

        public collapseAll() {
            this.$layerService.project.groups.forEach((g) => {
                var id = "#layergroup_" + g.id;
                (<any>$(id)).collapse("hide");
            });
            var x = (<any>$('layergroupStyle'));
            (<any>$('div#layergroupStyle')).addClass('collapsed');
            this.allCollapsed = true;
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        }

        public expandAll() {
            this.$layerService.project.groups.forEach((g) => {
                var id = "#layergroup_" + g.id;
                (<any>$(id)).collapse("show");
            });
            (<any>$('div#layergroupStyle')).removeClass('collapsed');
            this.allCollapsed = false;
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        }
    }
}
