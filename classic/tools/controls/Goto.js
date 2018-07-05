Ext.define('GeoXMap.tools.controls.GoTo', {
    extend: 'GeoXMap.tools.templates.CButton',

    xtype: 'geo_goto',

    iconCls: 'fa fa-location-arrow',

    constructor: function (config) {

        if(!config.params){
            config['params'] = {};
        }

        config.params['ctxtype'] = 'geo_gotoform';
        config.params['position'] = 'anchor';
        config.params['ctxfocus'] = true;

        this.callParent([config]);
    }
});