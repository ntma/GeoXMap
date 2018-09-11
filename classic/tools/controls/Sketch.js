Ext.define('GeoXMap.tools.controls.Sketch', {
    extend: 'GeoXMap.tools.templates.CtxToolTpl',

    xtype: 'geo_sketch',

    requires: [
        'GeoXMap.tools.components.SketchForm'
    ],

    iconCls: 'fa fa-pencil',

    constructor: function (config) {

        if(!config.ctxmenu){
            config['ctxmenu'] = {};
        }

        // config.params['ctxtype'] = 'geo_gotoform';
        // config.params['position'] = 'anchor';
        // config.params['ctxfocus'] = true;


        config.ctxmenu['type'] = 'geo_sketchform';
        config.ctxmenu['anchored'] = true;
        config.ctxmenu['focusable'] = false;


        this.callParent([config]);
    }
});