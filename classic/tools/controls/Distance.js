Ext.define('GeoXMap.tools.controls.Distance', {
    extend: 'GeoXMap.tools.templates.PButton',

    xtype: 'distance',

    iconCls: 'fa fa-pencil',

    toggleGroup: 'map-measuring',

    constructor: function (config) {
        this.callParent([config]);

        this.measuring = false;

        this.measureLayer = null;

        this.drawColor = (config.color) ? config.color: '#ffcc33';

        // Create Layer
        // Add Layer
        this.setupLayer();
    },

    setupLayer: function(){

        const me = this;

        this.onChangeInteraction = null;

        const measureSource = new ol.source.Vector();

        this.measureInteraction = new ol.interaction.Draw({
            source: measureSource,
            type: 'LineString',
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });

        this.measureInteraction.on('drawstart', function (evt) {
                // set me.sketch
                const sketch = evt.feature;

                /** @type {ol.Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                me.onChangeInteraction = sketch.getGeometry().on('change', function (event) {
                    var geom = event.target;
                    var output;
                    // if (geom instanceof ol.geom.Polygon) {
                    //     // output = me.formatMeasure(geom);
                    //     tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    // } else if (geom instanceof ol.geom.LineString) {
                        // output = me.formatMeasure(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    // }
                    // me.measureTooltipElement.innerHTML = output;
                    // me.measureTooltip.setPosition(tooltipCoord);
                });
            }, this);

        this.measureInteraction.on('drawend',
            function () {
                // me.measureTooltipElement.className = 'ol3tooltip ol3tooltip-static';
                // me.measureTooltip.setOffset([0, -7]);
                // unset me.sketch
                // me.sketch = null;
                // unset tooltip so that a new one can be created
                // me.measureTooltipElement = null;
                // me.createMeasureTooltip();
                ol.Observable.unByKey(me.onChangeAreaInteraction);
            }, this);


        const measureLayer = new ol.layer.Vector({
            name: 'measure distance--',  // legend tree
            source: measureSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: me.drawColor,
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color:  me.drawColor
                    })
                })
            })
        });

        // Add layer to map
        this.mapscope.getOlMap().addLayer(measureLayer);

        // Store layer reference
        this.measureLayer = measureLayer;
    },


    listeners: {
        toggle: function(btn, pressed){

            // TODO: call parent?
            // this.callParent();

            const olMap = this.mapscope.getOlMap();

            if(pressed){
                // console.log("Toggle activated");

                // add interaction
                olMap.addInteraction(this.measureInteraction);
                // olMap.on("pointermove", this.pointerMoveHandler, this);
            } else {
                // console.log("Toggle deactivated");

                olMap.removeInteraction(this.measureInteraction);
                // olMap.un("pointermove", this.pointerMoveHandler, this);

                // clear existent tooltips with distances or areas
                // var x = document.getElementsByClassName("ol3tooltip");
                // for (var i = 0; i < x.length; i++) {
                //     x[i].classList.add('hidden');
                // }
                // // limpar eventuais medições
                this.measureLayer.getSource().clear();
            }
        }
    }
});