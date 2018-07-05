Ext.define('GeoXMap.tools.controls.Load', {
    extend: 'Ext.button.Button',
    xtype: 'geo_load',

    iconCls: 'fa fa-refresh',

    listeners: {
        click: function(){
            this.mapscope.reloadLayers()
        }
    }
});