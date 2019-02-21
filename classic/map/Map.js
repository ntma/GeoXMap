Ext.define('GeoXMap.map.Map', {
    extend: 'GeoExt.component.Map',
    xtype: 'geo_map',

    map: new ol.Map({
        layers: [],
        controls: [new ol.control.ScaleLine()],
        view: new ol.View()
    }),

    setMapView: function (center, zoom, projection) {
        // TODO: set projection
        this.getMap().setView(new ol.View({
            center: center,
            zoom: zoom,
            projection: projection
        }));
    },

    setMapCenter: function (center) {
        this.getMap().setCenter(center);
    },

    setMapZoom: function () {
    },

    removeLayers: function(){
        this.getMap().setLayerGroup(new ol.layer.Group());
    },

    transformCoordinates: function(coordinates, toEpsg, fromEpsg){
        return ol.proj.transform(coordinates, 'EPSG:' + toEpsg, 'EPSG:' + fromEpsg);
    },

    navigateToPoint: function(position){
        this.getView().setCenter(position);
    },

    animateToPoint: function(position, zoomLvl, duration){
        const mapView = this.getMap().getView();

        if(!duration){
            mapView.setCenter(position);
        } else {
            let animation = {
                center: position,
                duration: duration
            };

            if(zoomLvl && zoomLvl >= 0){
                animation['zoom'] = zoomLvl;
            }

            mapView.animate(animation);
        }
    },

    getProjectionCode: function () {
        const mapView = this.getMap().getView();

        const codeString = mapView.getProjection().getCode();

        const code = codeString.split(':')[1];

        return code;
    },

    extentToFeatures: function(features, maxZoom, duration){
        const map = this.getMap(),
            mapView = map.getView(),
            params = {
                'size': map.getSize()
            };

        if(maxZoom){
            params['maxZoom'] = maxZoom
        }

        if(duration){
            params['duration'] = duration;
        }

        let extent;

        if(features instanceof ol.Feature){

            extent = features.getGeometry().getExtent();

            mapView.fit(extent, params);

        } else if(features.getLength() > 0) {

            const vector = new ol.source.Vector({
                features: features
            });

            extent = vector.getExtent();

            mapView.fit(extent, params);
        }
    }
});