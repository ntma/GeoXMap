Ext.define('GeoXMap.tools.controls.Extent', {
    extend: 'Ext.button.Button',
    xtype: 'geo_extent',

    text: 'E',

    listeners: {
        click: function(){
            const mapscope = this.mapscope,
                olmap = mapscope.getOlMap(),
                mapView = olmap.getView();

            const zoom = mapscope.getZoom(),
                extent = mapscope.getExtent(),
                size = olmap.getSize();


            if(zoom && extent){
                mapView.fit(extent, size);
                mapView.setZoom(zoom);
            }
        }
    }
});