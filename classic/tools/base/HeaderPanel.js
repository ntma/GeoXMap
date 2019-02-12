Ext.define('GeoXMap.tools.base.HeaderPanel', {
    extend: 'Ext.panel.Panel',

    xtype: 'geo_headerpanel',

    height: 55,

    userCls: 'map-header',
    bodyCls: 'map-header',
    padding: '10px 20px',

    layout: {
        type: 'hbox',
        align: 'center'
    },

    items: [
        {
            xtype: 'title',
            text: 'Default Title',
            userCls: 'map-header-title'
        },
        {
            xtype: 'tbfill'
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },

            defaults: {
                margin: '0 10px',
                userCls: 'map-header-ctrl'
            },

            items: [
                // Header tools go here
            ]
        }
    ],

    addTool: function(toolCmp, idx){
        toolCmp.setMargin('0 10px');
        toolCmp.setUserCls('map-header-ctrl');

        if(idx && idx >= 0){
            this.down('container').insert(toolCmp, idx);
        } else {
            this.down('container').add(toolCmp);
        }
    },

    setTitle: function(title){
        this.down('title').setText(title)
    }
});