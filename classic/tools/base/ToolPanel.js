Ext.define('GeoXMap.tools.base.ToolPanel', {
    extend: 'Ext.container.Container',

    xtype: 'geo_toolpanel',

    floating: true,

    focusable:false,

    focusOnToFront: false,

    shadow: false,

    userCls: 'map-tool-container unclickable',

    listeners: {
        afterlayout: function(){
            this.setZIndex(this.zindex);
        }
    }
});