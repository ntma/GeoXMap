Ext.define('GeoXMap.tools.controls.Query', {
    extend: 'GeoXMap.tools.templates.MDToolTpl',

    xtype: 'geo_query',

    iconCls: 'fa fa-map-marker',

    constructor: function (config) {
        if (!config.masterDetail) {
            config['masterDetail'] = {};
        }

        config.masterDetail['xtype'] = 'geo_pointinfo';
        config.enableToggle = true;

        this.callParent([config]);
    }
});