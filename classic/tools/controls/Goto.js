Ext.define('GeoXMap.tools.controls.GoTo', {
    extend: 'GeoXMap.tools.templates.CtxToolTpl',

    xtype: 'geo_goto',

    iconCls: 'fa fa-location-arrow',

    constructor: function (config) {

        if(!config.ctxmenu){
            config['ctxmenu'] = {};
        }

        // config.params['ctxtype'] = 'geo_gotoform';
        // config.params['position'] = 'anchor';
        // config.params['ctxfocus'] = true;


        config.ctxmenu['type'] = 'geo_gotoform';
        config.ctxmenu['anchored'] = true;
        config.ctxmenu['focusable'] = true;


        this.callParent([config]);
    }
});