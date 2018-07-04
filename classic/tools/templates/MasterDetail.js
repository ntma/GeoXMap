Ext.define('GeoXMap.tools.templates.MasterDetail', {
    extend: 'Ext.panel.Panel',

    xtype: 'masterdetail',

    hidden: true,
    draggable: false,
    closable: true,

    layout: 'fit',

    userCls: 'map-panel',

    activeId: null,

    items: [],

    listeners: {
        beforeclose: function () {

            this.hide();

            return false;
        }
    }
});