module csComp.Services
{
  /** Interface of a project layer
   *  Note that this is a copy of the similarly named class, but the advantage is that I can use the
   *  interface definition also on the server side.
   *  TODO Check whether we need to keep the class definition.
   */
  export interface IProjectLayer {
      /** Key of the propertyTypeData entry that provides a legend for this layer **/
      defaultLegendProperty?: string;
      /** Title as displayed in the menu */
      title: string;
      /** Number of features in the layer */
      count?: number;
      /** Description as displayed in the menu */
      description?: string;
      /** Type of layer, e.g. GeoJSON, TopoJSON, or WMS */
      type: string;
      /** render type */
      renderType : string;
      /** Data source */
      url: string;
      /** Contains extended heatmap information (e.g. list of references to required sources, or weights) */
      heatmapSettings?: Heatmap.IHeatmapSettings;
      heatmapItems?: Heatmap.IHeatmapItem[];
      /** In case we keep the style information in a separate file */
      styleurl?: string;
      /** WMS sublayers that must be loaded */
      wmsLayers?: string;
      /** If enabled, load the layer */
      enabled?: boolean;
      /** Layer opacity */
      opacity?: number;
      /** When loading the data, the isLoading variable is true (e.g. used for the spinner control) */
      isLoading?: boolean;
      /** Indent the layer, so it seems to be a sublayer. */
      isSublayer?: boolean;
      mapLayer?: L.LayerGroup<L.ILayer>;
      /** Group of layers */
      group: ProjectGroup;
      refreshBBOX? : boolean;
      layerSource: ILayerSource;
      /**
       * Number of seconds between automatic layer refresh.
       * @type {number}
       */
      refreshTimer?: number;
      /**
       * When enabling the refresh timer, store the returned timer token so we can stop the timer later.
       * @type {number}
       */
      timerToken?: number;
      /**
      * A list of UNIX timestamp, or the UTC time in milliseconds since 1/1/1970, which define the time a sensor value
      * was taken. So in case we have 10 timestamps, each feature's sensor (key) in the feature's sensors dictionary should
      * also have a lnegth of 10.
      * Note that this value is optional, and can be omitted if the sensor already contains a timestamp too. This is mainly intended
      * when all 'sensor measurements' are taken on the same moment. For example, the CENSUS date.
      * In Excel, you can use the formula =24*(A4-$B$1)*3600*1000 to convert a date to a UNIX time stamp.
      */
      timestamps?: number[];
      /** Internal ID, e.g. for the Excel service */
      id?: string;
      /** Reference for URL params: if the URL contains layers=REFERENCE1;REFERENCE2, the two layers will be turned on.  */
      reference?: string;
      events?: Event[];
      /** Language information that can be used to localize the title and description */
      languages?: ILanguageData;
      /** layer original source */
      data?: any;
      cesiumDatasource?: any;
      items?: any;

      /** use a timestamp with each url request to make them unique (only tile layer for now, timestamp created after each refresh )*/
      disableCache?: boolean;
      /** key attached for identifying to */
      cacheKey?: string;

      /** handle for receiving server events */
      serverHandle?: MessageBusHandle;

      parentFeature : IFeature;

      /** key name of default feature type */
      defaultFeatureType? : string;

  }

  /** Layer information. a layer is described in a project file and is always part of a group */
  export class ProjectLayer implements IProjectLayer {
      /** Key of the propertyTypeData entry that provides a legend for this layer **/
      defaultLegendProperty: string;
      /** Title as displayed in the menu */
      title: string;
      /** Number of features in the layer */
      count: number;
      /** Description as displayed in the menu */
      description: string;
      /** Source type of layer, e.g. GeoJSON (default), TopoJSON, or WMS TODO Refactor to sourceType */
      type: string;
      /** Specificies how the content should be rendered. Default same as 'type', but allows you to transform the source to e.g. geojson for easier rendering */
      renderType : string;
      /** Data source */
      url: string;
      /** Contains extended heatmap information (e.g. list of references to required sources, or weights) */
      heatmapSettings             : Heatmap.IHeatmapSettings;
      heatmapItems                : Heatmap.IHeatmapItem[];
      /** Contains hierarchy settings */
      hierarchySettings           : FeatureRelations.IHierarchySettings;
      /** In case we keep the style information in a separate file */
      styleurl: string;
      /** WMS sublayers that must be loaded */
      wmsLayers: string;
      /** If enabled, load the layer */
      enabled: boolean;
      /** Layer opacity */
      opacity: number;
      /** When loading the data, the isLoading variable is true (e.g. used for the spinner control) */
      isLoading: boolean;
      /** Indent the layer, so it seems to be a sublayer. */
      isSublayer: boolean;
      mapLayer: L.LayerGroup<L.ILayer>;
      /** id of the group */
      groupId : string;
      /** Group of layers */
      group: ProjectGroup;
      /** if true, use the current bounding box to retreive data from the server */
      refreshBBOX : boolean;
      /** The current bounding box to retreive data from the server */
      BBOX : string;
      layerSource : ILayerSource;
      /**
       * Number of seconds between automatic layer refresh.
       * @type {number}
       */
      refreshTimer: number;
      /**
       * When enabling the refresh timer, store the returned timer token so we can stop the timer later.
       * @type {number}
       */
      timerToken : number;
      /**
      * A list of UNIX timestamp, or the UTC time in milliseconds since 1/1/1970, which define the time a sensor value
      * was taken. So in case we have 10 timestamps, each feature's sensor (key) in the feature's sensors dictionary should
      * also have a lnegth of 10.
      * Note that this value is optional, and can be omitted if the sensor already contains a timestamp too. This is mainly intended
      * when all 'sensor measurements' are taken on the same moment. For example, the CENSUS date.
      * In Excel, you can use the formula =24*(A4-$B$1)*3600*1000 to convert a date to a UNIX time stamp.
      */
      timestamps: number[];
      /** Internal ID, e.g. for the Excel service */
      id: string;
      /** Reference for URL params: if the URL contains layers=REFERENCE1;REFERENCE2, the two layers will be turned on.  */
      reference: string;
      events: Event[];
      /** Language information that can be used to localize the title and description */
      languages: ILanguageData;
      /** layer original source */
      data: any;
      /**
       * Object to hold any specific parameters for a certain type of data source.
       */
      dataSourceParameters: IProperty;
      cesiumDatasource: any;
      items : any;

      /** use a timestamp with each url request to make them unique (only tile layer for now, timestamp created after each refresh )*/
      disableCache : boolean;
      /** key attached for identifying to */
      cacheKey : string;

      /** handle for receiving server events */
      serverHandle: MessageBusHandle;

      /** Whether layer can be quickly updated instead of completely rerendered */
      quickRefresh:boolean;

      lastSelectedFeature : IFeature;

      /** link to a parent feature, e.g. city layer references to a parent provence */
      parentFeature : IFeature;

      /** key name of default feature type */
      defaultFeatureType : string;


      /**
       * Returns an object which contains all the data that must be serialized.
       */
      public static serializeableData(pl: ProjectLayer) : Object {
          return {
              id:                    pl.id,
              title:                 pl.title,
              description:           pl.description,
              type:                  pl.type,
              renderType:            pl.renderType,
              heatmapSettings:       pl.heatmapSettings,
              heatmapItems:          csComp.Helpers.serialize(pl.heatmapItems, Heatmap.HeatmapItem.serializeableData),
              url:                   pl.url,
              styleurl:              pl.styleurl,
              wmsLayers:             pl.wmsLayers,
              enabled:               pl.enabled,
              opacity:               pl.opacity,
              isSublayer:            pl.isSublayer,
              BBOX:                  pl.BBOX,
              refreshBBOX:           pl.refreshBBOX,
              refreshTimer:          pl.refreshTimer,
              quickRefresh:          pl.quickRefresh,
              languages:             pl.languages,
              events:                pl.events,
              dataSourceParameters:  pl.dataSourceParameters,
              defaultFeatureType:    pl.defaultFeatureType,
              defaultLegendProperty: pl.defaultLegendProperty,
          };
      }
  }

  /**
   * Baselayers are background maps (e.g. openstreetmap, nokia here, etc).
   * They are described in the project file
   */
  export interface IBaseLayer {
      id               : string;
      title            : string;
      isDefault        : boolean;
      subtitle         : string;
      preview          : string;
      /** URL pointing to the basemap source. */
      url              : string;
      /** Maximum zoom level */
      maxZoom          : number;
      /** Minimum zoom level */
      minZoom          : number;
      subdomains       : string[];
      /** String that is shown on the map, attributing the source of the basemap */
      attribution      : string;
      test             : string;
      cesium_url?      :  string;
      cesium_maptype?  : string;
  }
  export class BaseLayer implements IBaseLayer {
      id               : string;
      title            : string;
      isDefault        : boolean;
      subtitle         : string;
      preview          : string;
      /** URL pointing to the basemap source. */
      url              : string;
      /** Maximum zoom level */
      maxZoom          : number;
      /** Minimum zoom level */
      minZoom          : number;
      subdomains       : string[];

      /** String that is shown on the map, attributing the source of the basemap */
      attribution      : string;
      test             : string;

      cesium_url       : string;
      cesium_maptype   : string;
  }
}