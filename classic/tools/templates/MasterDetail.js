Ext.define('GeoXMap.tools.templates.MasterDetail', {
    extend: 'Ext.panel.Panel',

    xtype: 'geo_masterdetail',

    // hidden: true,
    draggable: false,
    closable: true,

    layout: 'fit',

    userCls: 'map-panel',

    activeId: null,

    items: [],

    listeners: {
        beforeclose: function () {
            this.slideFx(true);

            return false;
        }
    },

    slideFx: function (close, duration) {
        const toolPanel = this.up();

        // MasterDetail size
        const w1 = this.getWidth(),
            // Scope size
            w2 = this.mapscope.getWidth(),
            // Tool bar size
            w4 = toolPanel.getWidth(),
            // offset
            w3 = w4 - w1;

        const offset = (close) ? w2 - w3 : w2 - w4;

        const dur = (duration >= 0) ? duration : 1000;

        Ext.create('Ext.fx.Anim', {
            target: toolPanel,
            duration: dur,
            to: {
                left: offset
            }
        });
    }
});