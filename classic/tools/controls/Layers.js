Ext.define('GeoXMap.tools.controls.Layers', {
    extend: 'GeoXMap.tools.templates.MDToolTpl',

    xtype: 'geo_layers',

    iconCls: 'fa fa-list',

    constructor(config) {
        if (!config.masterDetail) {
            config['masterDetail'] = {};
        }

        const store = config.mapscope.store;

        config.masterDetail['xtype'] = 'geo_layerspanel';
        config.masterDetail['store'] = store;

        this.callParent([config])
    }
});