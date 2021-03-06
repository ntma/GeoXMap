/**
 * Based on: https://rawgit.com/geoext/geoext3/master/examples/tree/panel.js
 */
Ext.define('GeoXMap.tools.components.Layers', {
    extend: 'GeoXMap.tools.base.MasterDetailCard',
    xtype: 'geo_layerspanel',

    requires: [
        'GeoExt.data.store.LayersTree',
        'GeoXMap.tools.plugins.BasicTreeColumnLegends'
    ],

    // viewConfig: {
    //     plugins: {
    //         ptype: 'treeviewdragdrop'
    //     }
    // },

    title: 'Layers',

    border: false,

    items: [
        {
            xtype: 'treepanel',

            rootVisible: false,

            viewConfig: {
                plugins: {ptype: 'treeviewdragdrop'}
            },
            // hideHeaders: true,
            lines: false,

            framed: false,

            style: {
                textAlign: 'left'
            },

            columns: {
                items: [
                    {
                        xtype: 'treecolumn',
                        dataIndex: 'text',
                        flex: 1,
                        plugins: [
                            {
                                ptype: 'basic_tree_column_legend'
                            }
                        ]
                    }
                ]
            },

            store: null, // To be a tree store
        }
    ],

    constructor: function (config) {

        this.callParent([config]);

        const me = this;

        // TODO: mapscope shouldnt be so deep

        this.mapscope.on('afterloadlayers', function () {
            me.resetStore();
        });

        this.mapscope.on('afterremovelayers', function () {
            const treeStore = me.getStore();

            if (treeStore) {
                treeStore.loadData({
                    root: {}
                });
            }
        });

        me.resetStore();
    },

    resetStore: function () {
        const layerGroup = this.mapscope.getOlMap().getLayerGroup();

        const store = Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: layerGroup
        });

        this.down().setStore(store);
    },

    getStore: function(){
        return this.down().getStore();
    }
});