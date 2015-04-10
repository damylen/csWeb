﻿module csComp.Services {

    export enum LayerType {
        GeoJson,
        Kml
    }


    /** a project group contains a list of layers that can be grouped together. 
     * Filters, styles can clustering is always defined on the group level. 
     * If a filter is selected (e.g. show only the features within a certain property range)
     * this filter is applied to all layers within this group.
     * If clustering is enabled all features in all layers are grouped together
     */
    export class ProjectGroup {
        id              : string;
        title           : string;
        description     : string;
        layers          : Array<ProjectLayer>;
        filters         : Array<GroupFilter>;
        styles          : Array<GroupStyle>;
        showTitle       : boolean;
        cluster         : L.MarkerClusterGroup;
        vectors         : L.LayerGroup<L.ILayer>;
        /** Turn on the leaflet markercluster */
        clustering      : boolean;
        /** If set, at this zoom level and below markers will not be clustered. This defaults to disabled */
        clusterLevel    : number;
        /**  The maximum radius that a cluster will cover from the central marker (in pixels). Default 80. Decreasing will make more smaller clusters. You can also use a function that accepts the current map zoom and returns the maximum cluster radius in pixels. */
        maxClusterRadius: number;
        clusterFunction : Function;
        /** Creates radio buttons instead of checkboxes in the level */
        oneLayerActive  : boolean;
        ndx             : any;
        filterResult    : IFeature[];
        public markers  : any;
        styleProperty   : string;
        languages       : ILanguageData;
    }

    /**
     * Filters are used to select a subset of features within a group. 
     */
    export class GroupFilter {
        id         : string;
        title      : string;
        enabled    : boolean;
        filterType : string;
        property   : string;
        property2  : string;
        criteria   : string;
        dimension  : any;
        value      : any;
        stringValue: string;
        rangex     : number[];
        meta       : IPropertyType;
    }

    /**
     * Styles can determine how features are shown on the map
     */
    export class GroupStyle {
        id              : string;
        title           : string;
        enabled         : boolean;
        layers          : string[];
        visualAspect    : string;
        property        : string;
        colors          : string[];
        group           : ProjectGroup;
        availableAspects: string[];
        canSelectColor  : boolean;
        colorScales     : any;
        info            : PropertyInfo;
        meta            : IPropertyType;
        legends         : { [key: string] : Legend; }
        activeLegend    : Legend;

        constructor($translate: ng.translate.ITranslateService) {

            this.availableAspects = ['strokeColor', 'fillColor', 'strokeWidth'];
            this.colorScales = {};
            this.legends = {};

            $translate('WHITE_RED').then((translation) => {
                this.colorScales[translation] = ['white', 'red'];
            });
            $translate('GREEN_RED').then((translation) => {
                this.colorScales[translation] = ['green', 'red'];
            });
            $translate('RED_GREEN').then((translation) => {
                this.colorScales[translation] = ['red', 'green'];
            });
            $translate('WHITE_ORANGE').then((translation) => {
                this.colorScales[translation] = ['white', 'orange'];
            });
        }
    }

    /**
     * the Legend class provides a data structure that is used to map a value to a color
     * (see also the function getColor())
    */
    export class Legend {
        id: string;
        description: string;
        legendKind: string;
        legendEntries: LegendEntry[];
        // it is assumed that the legendentries have their values and/or intervals
        // sorted in ascending order
    }

    export class LegendEntry {
        label: string;
        interval: {
            min: number;
            max: number;
        };                 // either interval or value is used, depending on legendtype (discrete or interpolated)
        value: number;
        stringValue: string;
        color: string;  // hex string; rgb
    }

} 