Ext.define('GeoXMap.tools.controls.Query', {
    extend: 'GeoXMap.tools.templates.MButton',

    xtype: 'query',

    iconCls: 'fa fa-map-marker',

    enableToggle: 'true',

    toggleGroup: 'query',

    constructor: function (config) {
        if(!config.params){
            config['params'] = {};
        }

        config.params['xtype'] = 'pointinfo';
        config['clickopen'] = false;

        this.callParent([config]);
    },

    onClickMap: function(event){

        const coord = event.coordinate;
        const pixel = event.pixel;

        const params = {
            coords: coord,
            pixel: pixel
        };

        this.openWindow(params, true);
    },

    listeners: {
        toggle: function(scope,state){

            const olmap = this.mapscope.getOlMap();

            // TODO: https://openlayers.org/en/latest/apidoc/ol.CanvasMap.html
            // single click is delayed by 250ms (default)

            if(state){
                olmap.on('singleclick', this.onClickMap, this);
            } else {
                olmap.un('singleclick', this.onClickMap, this);
            }
        }
    }
});