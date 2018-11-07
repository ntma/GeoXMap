Ext.define('GeoXMap.tools.components.MousePosition', {
    extend: 'Ext.container.Container',
    xtype: 'geo_mouseposition',

    height: 25,

    margin: 10,

    html: '',

    preserveProjection: false,

    userCls: 'underlay-z-index',

    shadow: false,

    constructor: function (config) {

        this.callParent([config]);

        const me = this;

        this.templateHtml = new Ext.Template('<div>EPSG {code}: {lat}, {lon}</div>');

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
            let outputCode = projectionCode;

            if(projectionCode !== 4326 && !me.preserveProjection){
                coordinate = map.transformCoordinates(coordinate, projectionCode, 4326);

                outputCode = 4326;
            }

            me.showCoordinate(coordinate, outputCode);
        });

        viewport.addEventListener('mouseout', function(evt){
            me.showCoordinate(null);
        });
    },

    showCoordinate: function(coordinate, code){
        let html = '';

        if(coordinate){
            html = this.templateHtml.apply({
                code: code,
                lat: coordinate[0].toFixed(3),
                lon: coordinate[1].toFixed(3)
            });
        }

        this.setHtml(html);
    }
});