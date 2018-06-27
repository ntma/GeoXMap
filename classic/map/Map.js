Ext.define('GeoXMap.map.Map', {
    extend: 'GeoExt.component.Map',
    xtype: 'map',

    map: new ol.Map({
        layers: [
            new ol.layer.Group({
                name: 'Stamen Group',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.Stamen({layer: 'watercolor'}),
                        name: 'Stamen Watercolor'
                    }),
                    new ol.layer.Tile({
                        source: new ol.source.Stamen({layer: 'terrain-labels'}),
                        name: 'Stamen Terrain Labels'
                    })
                ],
                visible: true
            })
        ],
        controls: [],
        view: new ol.View()
    }),

    setMapView: function (center, zoom) {
        // TODO: set projection
        this.getMap().setView(new ol.View({
            center: ol.proj.fromLonLat(center),
            zoom: zoom
        }));
    },

    setMapCenter: function (center) {
        this.getMap().setCenter(ol.proj.fromLonLat(center));
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

});