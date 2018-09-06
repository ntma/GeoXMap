Ext.define('GeoXMap.tools.base.ContextWindow', {
    extend: 'Ext.window.Window',

    xtype: 'geo_ctxwindow',

    header: false,
    resizable: false,
    bodyBorder: false,
    border: false,

    draggable: false,

    hidden: true,
    hideMode: 'offsets',

    layout: 'fit',

    userCls: 'map-window',

    getMapScope: function () {
        return this.mapscope;
    },

    listeners: {
        focusleave: function () {
            if (this.ctxfocus) {
                this.hide();
            }
        }
    }
});