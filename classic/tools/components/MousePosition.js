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
            map = mapscope.getOlMap(),
            mapViewport = map.getViewport();

        const onMouseMove = function(evt){
            me.onMouseMove(evt);
        };

        const onMouseOut = function(evt){
            me.onMouseOut(evt);
        };

        mapscope.on('afterloadlayers', function(){
            mapViewport.addEventListener('mousemove', onMouseMove);
            mapViewport.addEventListener('mouseout', onMouseOut);
        });

        this.on('beforedestroy', function(){
            mapViewport.removeEventListener('mousemove',onMouseMove);
            mapViewport.removeEventListener('mouseout', onMouseOut);
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
    },

    onMouseMove: function(evt){
        const map = this.mapscope.getMap(),
            olmap = this.mapscope.getOlMap();

        const pixel = olmap.getEventPixel(evt)

        let coordinate = olmap.getCoordinateFromPixel(pixel);

        const projectionCode = map.getProjectionCode();
        let outputCode = projectionCode;

        if(projectionCode !== 4326 && !this.preserveProjection){
            coordinate = map.transformCoordinates(coordinate, projectionCode, 4326);

            outputCode = 4326;
        }

        this.showCoordinate(coordinate, outputCode);
    },

    onMouseOut: function(evt){
        this.showCoordinate(null);
    }
});