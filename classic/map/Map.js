Ext.define('GeoXMap.map.Map', {
    extend: 'GeoExt.component.Map',
    xtype: 'geo_map',

    map: new ol.Map({
        layers: [],
        controls: [],
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
        // TODO: animate to point

        const mapView = this.getMap().getView();
        // const pan = ol.animation.pan({
        //     duration: duration,
        //     source: mapView.getCenter()
        // });
        // olMap.beforeRender(pan);
        mapView.setCenter(position);
    },

    getProjectionCode: function () {
        const mapView = this.getMap().getView();

        const codeString = mapView.getProjection().getCode();

        const code = codeString.split(':')[1];

        return code;
    },

    extentToFeatures: function(features){
        const map = this.getMap();
        const mapView = map.getView();

        let extent;

        if(features instanceof ol.Feature){

            extent = features.getGeometry().getExtent();

            mapView.fit(extent, map.getSize());

        } else if(features.getLength() > 0) {

            const vector = new ol.source.Vector({
                features: features
            });

            extent = vector.getExtent();

            mapView.fit(extent, map.getSize());
        }
    }
});