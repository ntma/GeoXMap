Ext.define('GeoXMap.tools.components.MousePosition', {
    extend: 'Ext.container.Container',
    xtype: 'geo_mouseposition',

    height: 25,

    margin: 10,

    html: '',

    constructor: function (config) {

        this.callParent([config]);

        const me = this;

        this.templateHtml = new Ext.Template('<div>{lat}, {lon}</div>');

        const mapscope = config.mapscope,
            map = mapscope.getOlMap();

        mapscope.on('afterloadlayers', function(){
            me.setupControl(map.getViewport());
        });
    },

    setupControl: function(viewport){

        const me = this;
        const olmap = this.mapscope.getOlMap();
        const map = this.mapscope.getMap();

        viewport.addEventListener('mousemove', function(evt){
            const pixel = olmap.getEventPixel(evt)

            let coordinate = olmap.getCoordinateFromPixel(pixel);

            const projectionCode = map.getProjectionCode();

            if(projectionCode !== 4326){
                coordinate = map.transformCoordinates(coordinate, projectionCode, 4326);
            }

            me.showCoordinate(coordinate);
        });

        viewport.addEventListener('mouseout', function(evt){
            me.showCoordinate(null);
        });
    },

    showCoordinate: function(coordinate){
        let html = '';

        if(coordinate){
            html = this.templateHtml.apply({
                lat: coordinate[0].toFixed(3),
                lon: coordinate[1].toFixed(3)
            });
        }

        this.setHtml(html);
    }
});