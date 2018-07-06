Ext.define('GeoXMap.tools.templates.ToolPanel', {
    extend: 'Ext.container.Container',

    xtype: 'geo_toolpanel',

    floating: true,

    shadow: false,

    userCls: 'map-tool-container',

    listeners: {
        afterlayout: function(){
            this.setZIndex(1);
        }
    }
});