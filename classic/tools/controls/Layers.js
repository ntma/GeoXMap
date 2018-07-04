Ext.define('GeoXMap.tools.controls.Layers', {
    extend: 'GeoXMap.tools.templates.MButton',
    xtype: 'maplayers',

    iconCls: 'fa fa-list',

    constructor(config){
        if(!config.params){
            config['params'] = {};
        }

        const store = config.mapscope.store;

        config.params['xtype'] = 'layers';
        config.params['store'] = store;
        config['animated'] = false;
        config['clickopen'] = true;
        config['stayopen'] = false;

        this.callParent([config])
    }
});