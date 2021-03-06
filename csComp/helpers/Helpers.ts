// export interface Array<T> {
//     serialize<T>(): string
// }
//
// Array<T>.prototype.serialize<T> = function() {
//     return "";
// }

﻿module csComp.Helpers {

    /**
     * Serialize an array of type T to a JSON string, by calling the callback on each array element.
     */
    export function serialize<T>(arr: Array<T>, callback: (T) => Object) {
        if (typeof arr === 'undefined' || arr === null || arr.length === 0) return null;
        var result: Object[] = [];
        arr.forEach(a => {
            result.push(callback(a));
        });
        return result;
    }

    export function getDefaultFeatureStyle(): csComp.Services.IFeatureTypeStyle {
        //TODO: check compatibility for both heatmaps and other features
        var s: csComp.Services.IFeatureTypeStyle = {
            nameLabel: "Name",
            strokeWidth: 3,
            strokeColor: "#0033ff",
            fillOpacity: 0.75,
            opacity: 1,
            fillColor: "#FFFF00",
            stroke: true,
            rotate: 0,
            iconUri: "cs/images/marker.png",
            iconHeight: 32,
            iconWidth: 32
        };
        return s;
    }

    /**
     * Export data to the file system.
     */
    export function saveData(data: string, filename: string, fileType: string) {
        fileType = fileType.replace(".", "");
        filename = filename.replace("." + fileType, "") + "." + fileType; // if the filename already contains a type, first remove it before adding it.

        if (navigator.msSaveBlob) {
            // IE 10+
            var link: any = document.createElement('a');
            link.addEventListener("click", event => {
                var blob = new Blob([data], { "type": "text/" + fileType + ";charset=utf-8;" });
                navigator.msSaveBlob(blob, filename);
            }, false);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (!csComp.Helpers.supportsDataUri()) {
            // Older versions of IE: show the data in a new window
            var popup = window.open('', fileType, '');
            popup.document.body.innerHTML = '<pre>' + data + '</pre>';
        } else {
            // Support for browsers that support the data uri.
            var a: any = document.createElement('a');
            document.body.appendChild(a);
            a.href = "data:text/" + fileType + ";charset=utf-8," + encodeURI(data);
            a.target = '_blank';
            a.download = filename;
            a.click();
            document.body.removeChild(a);
        }
    }

    declare var String;//: StringExt.IStringExt;

    export function supportsDataUri() {
        var isOldIE = navigator.appName === "Microsoft Internet Explorer";
        var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
        return !(isOldIE || isIE11);  //Return true if not any IE
    }

    export function standardDeviation(values: number[]) {
        var avg = average(values);

        var squareDiffs = values.map(value => {
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });

        var avgSquareDiff = average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return { avg: avg, stdDev: stdDev };
    }

    export function average(data: number[]) {
        var sum = data.reduce((accumulatedSum, value) => (accumulatedSum + value), 0);
        var avg = sum / data.length;
        return avg;
    }

    /**
     * Collect all the property types that are referenced by a feature type.
     */
    export function getPropertyTypes(type: csComp.Services.IFeatureType, propertyTypeData: csComp.Services.IPropertyTypeData, feature?: csComp.Services.IFeature) {
        var propertyTypes: Array<csComp.Services.IPropertyType> = [];

        if (type.propertyTypeKeys != null) {
            var keys = type.propertyTypeKeys.split(';');
            keys.forEach((key) => {
                // First, lookup key in global propertyTypeData
                if (propertyTypeData && propertyTypeData.hasOwnProperty(key)) propertyTypes.push(propertyTypeData[key]);
                // If you cannot find it there, look it up in the featureType's propertyTypeData.
                else if (type.propertyTypeData != null) {
                    var result = $.grep(type.propertyTypeData, e => e.label === key);
                    if (result.length >= 1) propertyTypes.push(result);
                }
            });
        }
        if (type.showAllProperties && feature && feature.properties) {
            for (var key in feature.properties) {
                if (!propertyTypes.some((pt: csComp.Services.IPropertyType) => pt.label == key)) {
                    //var pt =
                }
            }
        }
        if (type.propertyTypeData != null) {
            if (type.propertyTypeData.forEach) {
                type.propertyTypeData.forEach((pt) => {
                    propertyTypes.push(pt);
                });
            } else {
                for (var ptlabel in type.propertyTypeData) {
                    if (type.propertyTypeData.hasOwnProperty(ptlabel)) {
                        propertyTypes.push(type.propertyTypeData[ptlabel]);
                    }
                }
            }
        }
        return propertyTypes;
    }

    export function getMissingPropertyTypes(feature: csComp.Services.IFeature): csComp.Services.IPropertyType[] {
        //var type = featureType;
        var res = <csComp.Services.IPropertyType[]>[];
        //        if (!type.propertyTypeData) type.propertyTypeData = [];

        for (var key in feature.properties) {

            //if (!type.propertyTypeData.some((pt: csComp.Services.IPropertyType) => { return pt.label === key; })) {
            if (!feature.properties.hasOwnProperty(key)) continue;
            var propertyType: csComp.Services.IPropertyType = [];
            propertyType.label = key;
            propertyType.title = key.replace('_', ' ');
            propertyType.isSearchable = true;
            propertyType.visibleInCallOut = true;
            propertyType.canEdit = false;
            var value = feature.properties[key]; // TODO Why does TS think we are returning an IStringToString object?
            if (StringExt.isDate(value))
                propertyType.type = 'date';
            else if (StringExt.isNumber(value))
                propertyType.type = 'number';
            else if (StringExt.isBoolean(value))
                propertyType.type = 'boolean';
            else if (StringExt.isArray(value))
                propertyType.type = 'tags';
            else if (StringExt.isBbcode(value))
                propertyType.type = 'bbcode';
            else
                propertyType.type = 'text';
            res.push(propertyType);
            //}
        }

        return res;
    }

    export function addPropertyTypes(feature: csComp.Services.IFeature, featureType: csComp.Services.IFeatureType): csComp.Services.IFeatureType {
        var type = featureType;
        if (!type.propertyTypeData) type.propertyTypeData = [];

        for (var key in feature.properties) {
            if (!type.propertyTypeData.some((pt: csComp.Services.IPropertyType) => { return pt.label === key; })) {
                if (!feature.properties.hasOwnProperty(key)) continue;
                var propertyType: csComp.Services.IPropertyType = [];
                propertyType.label = key;
                propertyType.title = key.replace('_', ' ');
                propertyType.isSearchable = true;
                propertyType.visibleInCallOut = true;
                propertyType.canEdit = false;
                var value = feature.properties[key]; // TODO Why does TS think we are returning an IStringToString object?

                if (StringExt.isNumber(value))
                    propertyType.type = 'number';
                else if (StringExt.isBoolean(value))
                    propertyType.type = 'boolean';
                else if (StringExt.isBbcode(value))
                    propertyType.type = 'bbcode';
                else
                    propertyType.type = 'text';

                type.propertyTypeData.push(propertyType);
            }
        }

        return type;
    }

    /**
     * In case we are dealing with a regular JSON file without type information, create a default type.
     */
    export function createDefaultType(feature: csComp.Services.IFeature): csComp.Services.IFeatureType {
        var type: csComp.Services.IFeatureType = {};
        type.style = getDefaultFeatureStyle();
        type.propertyTypeData = [];

        this.addPropertyTypes(feature, type);

        return type;
    }

    /**
     * Convert a property value to a display value using the property info.
     */
    export function convertPropertyInfo(pt: csComp.Services.IPropertyType, text: any): string {
        var displayValue: string;
        // if (!csComp.StringExt.isNullOrEmpty(text) && !$.isNumeric(text))
        //     text = text.replace(/&amp;/g, '&');
        if (csComp.StringExt.isNullOrEmpty(text)) return text;
        if (!pt.type) return text;
        switch (pt.type) {
            case "bbcode":
                if (!csComp.StringExt.isNullOrEmpty(pt.stringFormat))
                    text = String.format(pt.stringFormat, text);
                displayValue = XBBCODE.process({ text: text }).html;
                break;
            case "number":
                if (!$.isNumeric(text))
                    displayValue = text;
                else if (!pt.stringFormat)
                    displayValue = text.toString();
                else
                    displayValue = String.format(pt.stringFormat, parseFloat(text));
                break;
            case "options":
                if (!$.isNumeric(text))
                    displayValue = text;
                else
                    displayValue = pt.options[text];
                break;
            case "rank":
                var rank = text.split(',');
                if (rank.length != 2) return text;
                if (pt.stringFormat)
                    displayValue = String.format(pt.stringFormat, rank[0], rank[1]);
                else
                    displayValue = String.format("{0} / {1}", rank[0], rank[1]);
                break;
            case "hierarchy":
                var hierarchy = text.split(";");
                var count = hierarchy[0];
                var calculation = hierarchy[1];
                displayValue = count.toString();
                break;
            case "date":
                var d = new Date(Date.parse(text));
                displayValue = d.toLocaleString();
                break;
            case "duration": //in ms
                if (!$.isNumeric(text)) {
                    displayValue = text;
                } else {
                    var d0 = new Date(0); var d1 = new Date(text);
                    var h = d1.getHours() - d0.getHours();
                    var m = d1.getMinutes() - d0.getMinutes();
                    var s = d1.getSeconds() - d0.getSeconds();
                    displayValue = ('0' + h).slice(-2) + 'h' + ('0' + m).slice(-2) + 'm' + ('0' + s).slice(-2) + 's';
                }
                break;
            default:
                displayValue = text;
                break;
        }
        return displayValue;
    }

    /**
    * Set the name of a feature.
    * @param {csComp.Services.IFeature} feature
    */
    export function setFeatureName(feature: csComp.Services.IFeature, propertyTypeData?: csComp.Services.IPropertyTypeData) {
        // Case one: we don't need to set it, as it's already present.
        if (feature.properties.hasOwnProperty('Name')) return feature;
        if (feature.properties.hasOwnProperty('name')) {
            feature.properties['Name'] = feature.properties['name'];
            return feature;
        }
        // Case two: the feature's style tells us what property to use for the name.
        if (feature.fType && feature.fType.style && feature.fType.style.nameLabel) {
            var nameLabel = feature.fType.style.nameLabel;
            if (nameLabel && feature.properties.hasOwnProperty(nameLabel)) {
                if (propertyTypeData && propertyTypeData.hasOwnProperty(nameLabel)) {
                    feature.properties['Name'] = convertPropertyInfo(propertyTypeData[nameLabel], feature.properties[nameLabel]);
                } else {
                    feature.properties['Name'] = feature.properties[nameLabel];
                }
                return feature;
            }
        }
        // Case three: the feature has a Name property which specifies a string format, meaning that the Name is derived from several existing properties.
        if (feature.fType.propertyTypeData != null) {
            for (var i = 0; i < feature.fType.propertyTypeData.length; i++) {
                var propertyType = feature.fType.propertyTypeData[i];
                if (propertyType.label !== 'Name' || !propertyType.stringFormat) continue;
                feature.properties['Name'] = Helpers.convertStringFormat(feature, propertyType.stringFormat);
                return feature;
            }
        }
        // If all else fails, use the first property
        for (var prop in feature.properties) {
            feature.properties['Name'] = prop.toString(); //feature.properties[prop];
            return feature;
        }
        // Finally, just create a GUID.
        feature.properties['Name'] = Helpers.getGuid();
        return feature;
    }

    /**
    * Convert a feature's stringFormat to a string.
    * @param {Services.IFeature} feature
    * @param {string} stringFormat
    */
    export function convertStringFormat(feature: Services.IFeature, stringFormat: string) {
        var openingBrackets = Helpers.indexes(stringFormat, '{');
        var closingBrackets = Helpers.indexes(stringFormat, '}');
        var convertedStringFormat = stringFormat;
        for (var j = 0; j < openingBrackets.length; j++) {
            var searchValue = stringFormat.substring(openingBrackets[j] + 1, closingBrackets[j]);
            convertedStringFormat = convertedStringFormat.replace('{' + searchValue + '}', feature.properties[searchValue]);
        }
        return convertedStringFormat;
    }

    /**
    * Get all indexes of the 'find' substring in the 'source' string.
    * @param {string} source
    * @param {string} find
    */
    export function indexes(source: string, find: string) {
        if (!source) return [];
        var result: number[] = [];
        for (var i = 0; i < source.length; i++) {
            if (source.substr(i, find.length) === find) result.push(i);
        }
        return result;
    }

    export function getGuid() {
        var guid = (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
        return guid;
    }

    export function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    /**
     * Load the features as visible on the map, effectively creating a virtual
     * GeoJSON file that represents all visible items.
     * Also loads the keys into the featuretype's propertyTypeData collection.
     */
    export function loadMapLayers(layerService: Services.LayerService): Services.IGeoJsonFile {
        var data: Services.IGeoJsonFile = {
            type: '',
            features: [],
            featureTypes: {}
        };
        // If we are filtering, load the filter results
        layerService.project.groups.forEach((group) => {
            if (group.filterResult != null)
                group.filterResult.forEach((f) => data.features.push(f));
        });
        // Otherwise, take all loaded features
        if (data.features.length === 0)
            data.features = layerService.project.features;

        data.features.forEach((f: Services.IFeature) => {
            if (!(data.featureTypes.hasOwnProperty(f.featureTypeName))) {
                var featureType = layerService.getFeatureType(f);
                if (!featureType.name) featureType.name = f.featureTypeName.replace('_Default', '');
                data.featureTypes[f.featureTypeName] = featureType;
                if (featureType.propertyTypeKeys) {
                    featureType.propertyTypeData = [];
                    featureType.propertyTypeKeys.split(';').forEach((key) => {
                        if (layerService.propertyTypeData.hasOwnProperty(key)) {
                            featureType.propertyTypeData.push(layerService.propertyTypeData[key]);
                        }
                    });
                }
            }
        });

        return data;
    }

    /**
     * Helper function to create content for the RightPanelTab
     * @param  {string} container The container name
     * @param  {string} directive The directive of the container
     * @param  {any}    data      Panel data
     * @return {RightPanelTab}    Returns the RightPanelTab instance. Add it to the
     * rightpanel by publishing it on the MessageBus.
     */
    export function createRightPanelTab(container: string, directive: string, data: any, title: string, popover?: string, icon?: string): Services.RightPanelTab {
        var rpt = new Services.RightPanelTab();
        rpt.container = container;
        rpt.data = data;
        rpt.title = title;
        rpt.directive = directive;
        rpt.popover = popover || '';
        rpt.icon = icon || 'tachometer';
        return rpt;
    }

    /**
     * Helper function to parse a query of an url (e.g localhost:8080/api?a=1&b=2&c=3)
     */
    export function parseUrlParameters(url: string, baseDelimiter: string, subDelimiter: string, valueDelimiter: string): { [key: string]: any } {
        var baseUrl = url.split(baseDelimiter)[0];
        var croppedUrl = url.split(baseDelimiter)[1];
        var splittedUrl = croppedUrl.split(subDelimiter);
        var urlParameters: { [key: string]: any } = {};
        splittedUrl.forEach((param) => {
            var keyValue = param.split(valueDelimiter);
            urlParameters[keyValue[0]] = (isNaN(+keyValue[1])) ? keyValue[1] : +keyValue[1]; //Store as number when possible
        });
        urlParameters['baseUrl'] = baseUrl;
        return urlParameters;
    }

    /**
     * Helper function to parse a query of an url (e.g localhost:8080/api?a=1&b=2&c=3)
     */
    export function joinUrlParameters(params: { [key: string]: any }, baseDelimiter: string, subDelimiter: string, valueDelimiter: string): string {
        var url = params['baseUrl'] + baseDelimiter;
        for (var key in params) {
            if (params.hasOwnProperty(key) && key !== 'baseUrl' && params[key]) {
                url = url + key + valueDelimiter + params[key] + subDelimiter;
            }
        }
        url = url.substring(0, url.length - 1);
        return url;
    }

    export function createIconHtml(feature: IFeature, featureType: csComp.Services.IFeatureType): {[key:string]: any} {
        var html = '<div ';
        var props = {};
        var ft = featureType;

        //if (feature.poiTypeName != null) html += "class='style" + feature.poiTypeName + "'";
        var iconUri = feature.effectiveStyle.iconUri; //ft.style.iconUri;
        //if (ft.style.fillColor == null && iconUri == null) ft.style.fillColor = 'lightgray';

        // TODO refactor to object
        var iconPlusBorderWidth, iconPlusBorderHeight;
        if (feature.effectiveStyle.hasOwnProperty('strokeWidth') && feature.effectiveStyle.strokeWidth > 0) {
            iconPlusBorderWidth = feature.effectiveStyle.iconWidth + (2 * feature.effectiveStyle.strokeWidth);
            iconPlusBorderHeight = feature.effectiveStyle.iconHeight + (2 * feature.effectiveStyle.strokeWidth);
        } else {
            iconPlusBorderWidth = feature.effectiveStyle.iconWidth;
            iconPlusBorderHeight = feature.effectiveStyle.iconHeight;
        }
        props['background'] = feature.effectiveStyle.fillColor;
        props['width'] = iconPlusBorderWidth + 'px';
        props['height'] = iconPlusBorderWidth + 'px';
        props['border-radius'] = feature.effectiveStyle.cornerRadius + '%';
        props['border-style'] = 'solid';
        props['border-color'] = feature.effectiveStyle.strokeColor;
        props['border-width'] = feature.effectiveStyle.strokeWidth + 'px';
        props['opacity'] = feature.effectiveStyle.opacity;

        //if (feature.isSelected) {
        //props['border-width'] = '3px';
        //}

        html += ' style=\'display: inline-block;vertical-align: middle;text-align: center;';
        for (var key in props) {
            if (!props.hasOwnProperty(key)) continue;
            html += key + ':' + props[key] + ';';
        }

        html += '\'>';
        if (feature.effectiveStyle.innerTextProperty != null && feature.properties.hasOwnProperty(feature.effectiveStyle.innerTextProperty)) {
            html += "<span style='font-size:12px;vertical-align:-webkit-baseline-middle'>" + feature.properties[feature.effectiveStyle.innerTextProperty] + "</span>";
        }
        else if (iconUri != null) {
            // Must the iconUri be formatted?
            if (iconUri != null && iconUri.indexOf('{') >= 0) iconUri = Helpers.convertStringFormat(feature, iconUri);

            html += '<img src=\'' + iconUri + '\' style=\'width:' + (feature.effectiveStyle.iconWidth) + 'px;height:' + (feature.effectiveStyle.iconHeight) + 'px';
            if (feature.effectiveStyle.rotate && feature.effectiveStyle.rotate > 0) html += ';transform:rotate(' + feature.effectiveStyle.rotate + 'deg)';
            html += '\' />';
        }

        html += '</div>';

        var iconHtml: {[key:string]: any} = {};
        iconHtml['html'] = html;
        iconHtml['iconPlusBorderWidth'] = iconPlusBorderWidth;
        iconHtml['iconPlusBorderHeight'] = iconPlusBorderHeight;
        return iconHtml;
    }
}
