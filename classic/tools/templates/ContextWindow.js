Ext.define('GeoXMap.tools.templates.ContextWindow', {
    extend: 'Ext.window.Window',

    xtype: 'ctxwindow',

    header: false,
    resizable: false,
    bodyBorder: false,
    border: false,

    draggable: false,

    hidden: true,
    hideMode: 'offsets',

    layout: 'fit',

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