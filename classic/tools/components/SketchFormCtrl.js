Ext.define('GeoXMap.tools.components.SketchFormCtrl', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.geo_sketchform',


    /**
     * Selected options
     */
    color: null,

    geom: null,

    thickness: null,


    /**
     * Defaults
     */
    geometryStyle: null,

    highlightStyle: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgb(32, 171, 149, 0.7)',
            width: 12
        })
    }),


    /**
     * Auxiliars
     */
    drawing: false,

    /**
     *     Interactions
     */
    measureInteraction: null,

    selectInteraction: null,


    createLayerInteraction: function (type) {
        const measureSource = this.measureLayer.getSource();

        const me = this;

        this.measureInteraction = new ol.interaction.Draw({
            source: measureSource,
            type: type,
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

        let onChangeInteraction = null;

        this.measureInteraction.on('drawstart', function (evt) {
            const sketch = evt.feature;

            const s = me.geometryStyle;

            evt.feature.setStyle(s);

            /** @type {ol.Coordinate|undefined} */
            let tooltipCoord = evt.coordinate;

            const measureTooltip =  me.createMeasureTooltip();

            sketch.getGeometry().tooltip = measureTooltip;

            onChangeInteraction = sketch.getGeometry().on('change', function (event) {
                const geom = event.target;

                let output;
                if (geom instanceof ol.geom.Polygon) {
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    tooltipCoord = geom.getLastCoordinate();
                }

                output = me.formatMeasure(geom);

                measureTooltip.getElement().innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

        this.measureInteraction.on('drawend',
            function (evt) {

                const measureTooltip = evt.feature.getGeometry().tooltip;

                measureTooltip.getElement().className = 'ol3tooltip ol3tooltip-static';
                measureTooltip.setOffset([0, -7]);

                ol.Observable.unByKey(onChangeInteraction);
            }, this);
    },

    createMeasureTooltip: function() {
        const me = this;
        
        const measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol3tooltip ol3tooltip-measure';

        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });

        const olMap = this.getView().mapscope.getOlMap();

        olMap.addOverlay(measureTooltip);

        return measureTooltip
    },

    formatMeasure: function (geom) {
        const type = this.geom;

        if (type === 'Polygon') {
            let area;

            area = geom.getArea();

            let output;
            if (area > 10000) {
                output = (Math.round(area / 1000000 * 100) / 100) + ' km<sup>2</sup>';
            } else {
                output = (Math.round(area * 100) / 100) + ' m<sup>2</sup>';
            }
            return output;
        } else {
            let length;

            length = Math.round(geom.getLength() * 100) / 100;

            let output;
            if (length > 1000) {
                output = (Math.round(length / 1000 * 100) / 100) +
                    ' ' + 'km';
            } else {
                output = (Math.round(length * 100) / 100) +
                    ' ' + 'm';
            }
            return output;
        }
    },

    createDrawLayer: function () {

        const me = this;

        const measureSource = new ol.source.Vector();

        const measureLayer = new ol.layer.Vector({
            name: 'measure distance--',  // legend tree
            source: measureSource,
            style: me.geometryStyle
        });

        const mapscope = this.getView().mapscope;

        mapscope.getOlMap().addLayer(measureLayer);

        // Store layer reference
        this.measureLayer = measureLayer;
    },

    changeStyle: function (type, opts) {
        this.geometryStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#' + opts.color,
                width: opts.thickness
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#' + opts.color
                })
            })
        });
    },


    /**
     * EVENTS
     */
    
    // On change geom
    onChangeGeometry: function (btn, geometry) {
        this.geom = geometry;

        if (this.drawing) {
            this.onToggleDraw(null, false);
            this.onToggleDraw(null, true);
        }

    },

    onChangeColor: function (field, color) {
        this.color = color;

        if (this.drawing) {
            this.onToggleDraw(null, false);
            this.onToggleDraw(null, true);
        }
    },

    onChangeThickness: function (btn, thickness) {
        this.thickness = thickness;

        if (this.drawing) {
            this.onToggleDraw(null, false);
            this.onToggleDraw(null, true);
        }
    },

    // On toggle draw
    onToggleDraw: function (btn, toggled) {
        // On active, draw

        const olMap = this.getView().mapscope.getOlMap();

        if (toggled) {
            const thickness = this.thickness;
            const color = this.color;
            const geom = this.geom;

            this.changeStyle(geom, {color: color, thickness: thickness});

            if (!this.measureInteraction) {
                this.createDrawLayer();
            }

            this.createLayerInteraction(geom);

            // add interaction
            olMap.addInteraction(this.measureInteraction);

            this.drawing = true;
        } else {

            this.drawing = false;

            olMap.removeInteraction(this.measureInteraction);
        }

        // On untoggle, remove listener
    },

    // On toggle select
    onToggleSelect: function (btn, toggled) {
        const me = this;

        const olMap = this.getView().mapscope.getOlMap();
        const highlightStyle = this.highlightStyle;


        // On active, select
        if (toggled) {
            this.selectInteraction = new ol.interaction.Select({
                condition: ol.events.condition.singleClick
            });

            this.selectInteraction.on('select', function (evt) {
                const selected = evt.selected;
                const deselected = evt.deselected;

                if (selected.length) {

                    me.getViewModel().set('selectedGeom', true);

                    selected.forEach(function (feature) {
                        feature.setStyle(highlightStyle);
                    });

                    me.selectedFeatures = selected;
                } else {
                    me.getViewModel().set('selectedGeom', false);
                }


                if (deselected.length) {
                    deselected.forEach(function (feature) {
                        feature.setStyle(null);
                    });
                }
            });

            olMap.addInteraction(this.selectInteraction);

        } else {
            olMap.removeInteraction(this.selectInteraction);

            if (this.selectedFeatures.length > 0) {

                this.selectedFeatures.forEach(function (feature) {
                    feature.setStyle(null);
                });

                this.selectedFeatures = [];
            }
        }
    },

    // On click delete
    onClickDelete: function () {
        // CHeck if any geometry is selected
        const olMap = this.getView().mapscope.getOlMap();

        const me = this;

        this.selectInteraction.getFeatures().clear();

        this.selectedFeatures.forEach(function (feature) {
            olMap.removeOverlay(feature.getGeometry().tooltip)

            feature.setStyle(null);

            me.measureLayer.getSource().removeFeature(feature);
        });

        this.selectedFeatures = [];

        me.getViewModel().set('selectedGeom', false);

    },

    onClickDeleteAll: function () {

        this.selectInteraction.getFeatures().clear();

        this.selectedFeatures.forEach(function (feature) {

            olMap.removeOverlay(feature.getGeometry().tooltip)

            feature.setStyle(null);

            me.measureLayer.getSource().removeFeature(feature);
        });

        this.selectedFeatures = [];

        this.measureLayer.getSource().clear();

        this.getViewModel().set('selectedGeom', false);

    }
});