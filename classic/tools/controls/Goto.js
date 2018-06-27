Ext.define('GeoXMap.tools.controls.GoTo', {
    extend: 'GeoXMap.tools.templates.CButton',

    xtype: 'goto',

    iconCls: 'fa fa-location-arrow',

    constructor: function (config) {

        if(!config.params){
            config['params'] = {};
        }

        config.params['ctxtype'] = 'gotoform';
        config.params['position'] = 'anchor';
        config.params['ctxfocus'] = 'true';

        this.callParent([config]);
    }
});