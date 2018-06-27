Ext.define('GeoExt.data.store.LayersTreeOR', {
    override: 'GeoExt.data.store.LayersTree',

    addLayerNode: function (layerOrGroup) {
        var me = this;

        if (/--$/.test(layerOrGroup.get('name'))) {
            return;
        } else {
            me.callParent(arguments);
        }

    }
});