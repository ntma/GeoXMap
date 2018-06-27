Ext.define('GeoXMap.tools.controls.Load', {
    extend: 'Ext.button.Button',
    xtype: 'load',

    iconCls: 'fa fa-refresh',

    listeners: {
        click: function(){
            this.mapscope.reloadLayers()
        }
    }
});