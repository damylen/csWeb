import LayerManager = require('./LayerManager');
import Layer = LayerManager.Layer;
import CallbackResult = LayerManager.CallbackResult;


export class FileStorage implements LayerManager.IStorage {
    public manager: LayerManager.LayerManager

    public layers: { [key: string]: Layer } = {}

    constructor(public rootpath: string) {
        // load layers
    }

    /**
     * Find layer for a specific layerId (can return null)
     */
    public findLayer(layerId: string): Layer {
        if (this.layers.hasOwnProperty(layerId)) {
            return this.layers[layerId];
        } else { return null; };

    }

    // layer methods first, in crud order.

    public addLayer(layer: Layer, callback: Function) {
        console.log('Add file layer');
        try {
            this.layers[layer.id] = layer;
            callback(<CallbackResult> { result: "OK" });
        }
        catch (e) {
            callback(<CallbackResult>{ result: "Error", error: null });
        }
    }

    //TODO: Arnoud, what to do with this?
    public getLayer(layerId: string, callback: Function) {
        if (this.layers.hasOwnProperty(layerId)) {
            callback(<CallbackResult>{ result: "OK", layer: this.layers[layerId] });
        }
        else {
            callback(<CallbackResult>{ result: "Error" });
        }
    }

    public deleteLayer(layerId: string, callback: Function) {
        if (this.layers.hasOwnProperty(layerId)) {
            delete this.layers[layerId];
            callback(<CallbackResult>{ result: "OK", layer: null });
        }
        else {
            callback(<CallbackResult>{ result: "Error" });
        }

    }

    // feature methods, in crud order
    public addFeature(layerId: string, feature: any, callback: Function) {
        var layer = this.findLayer(layerId);
        if (layer) {
            layer.features.push(feature);
            callback(<CallbackResult>{ result: "OK", layer: null });
        }
        else {
            callback(<CallbackResult>{ result: "Error" });
        }
    }



    //TODO: implement
    public getFeature(layerId: string, i: string, callback: Function) {

    }

    //TODO: implement
    public updateFeature(layerId: string, feature: any, callback: Function) {


    }

    //TODO: test further. Result is the # of deleted docs.
    public deleteFeature(layerId: string, featureId: string, callback: Function) {
        /*var collection = this.db.collection(layerId);
        collection.remove({ '_id': featureId }, function(e, result) {
            if (e) return e;
            //res.send(result);
        })*/
    }

    //TODO: Move connection set-up params from static to parameterized.
    public init(layerManager: LayerManager.LayerManager, options: any) {
        this.manager = layerManager;
        // set up connection

        console.log('init File Storage');

    }
}