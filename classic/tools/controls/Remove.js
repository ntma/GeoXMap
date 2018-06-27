Ext.define('GeoXMap.tools.controls.Remove', {
    extend: 'Ext.button.Button',
    xtype: 'remove',

    iconCls: 'fa fa-times',

    listeners: {
        click: function(){
            this.mapscope.removeLayers();
        }
    }
});