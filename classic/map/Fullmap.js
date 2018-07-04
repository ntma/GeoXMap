Ext.define('GeoXMap.map.Fullmap', {
    extend: 'Ext.panel.Panel',
    xtype: 'fullmap',

    requires: [
        'GeoXMap.map.Map',

        'GeoXMap.tools.templates.PButton',
        'GeoXMap.tools.templates.CButton',
        'GeoXMap.tools.templates.MasterDetail',

        'GeoXMap.tools.controls.ZoomIn',
        'GeoXMap.tools.controls.ZoomOut',
        'GeoXMap.tools.controls.Extent',
        'GeoXMap.tools.controls.Load',
        'GeoXMap.tools.controls.Remove',
        'GeoXMap.tools.controls.GoTo',
        'GeoXMap.tools.controls.Distance',
        'GeoXMap.tools.controls.Area',
        'GeoXMap.tools.controls.Layers',
        'GeoXMap.tools.controls.Query',

        'GeoXMap.tools.components.Layers',
        'GeoXMap.tools.components.GoToForm',
        'GeoXMap.tools.components.Search',
        'GeoXMap.tools.components.Messages',
        'GeoXMap.tools.components.PointInfo'
    ],

    /**
     * Params:
     *
     *   - tools set of tools to be used
     *      - left
     *      - right
     *      - down
     *      - up
     *      - cfg
     *   - layersStore: GeoExt layers store
     *   - autoLoad: Load layers on ready
     *   -
     */
    layout: 'fit',

    items: [
        {
            xtype: 'map'
        }
    ],

    constructor: function (config) {
        this.callParent([config]);

        this.autoLoad = !!config.autoLoad;

        /**
         * Layers Store
         */
        // TODO: This is the store that will actually load layers into the map
        // this.store = null

        /**
         * Map Tools
         */
        const tools = config.tools;

        if (tools) {
            // Left panel tools
            const leftPanel = this.createToolsPanel(tools.left, 'vbox', 'start', 'left');
            const rightPanel = this.createToolsPanel(tools.right, 'vbox', 'end', 'right');

            const downPanel = this.createToolsPanel(tools.down, 'hbox', 'center', 'down');
            const topPanel = this.createToolsPanel(tools.up, 'hbox', 'start', 'top');

            this._ctools = tools.custom;

            this._left = leftPanel;
            this._right = rightPanel;

            this._down = downPanel;
            this._up = topPanel;
        }
    },

    loadLayers: function () {
        // console.log("[Fullmap] Load layers");

        this.getOlMap().addLayer(new ol.layer.Group({
            name: 'Stamen Group',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.Stamen({layer: 'watercolor'}),
                    name: 'Stamen Watercolor'
                }),
                new ol.layer.Tile({
                    source: new ol.source.Stamen({layer: 'terrain-labels'}),
                    name: 'Stamen Terrain Labels'
                })
            ],
            visible: true
        }));

        this.fireEvent('afterloadlayers');
    },

    reloadLayers: function () {
        // console.log("[Fullmap] Reload layers");

        this.removeLayers();

        this.loadLayers();
    },

    removeLayers: function () {
        // console.log("[Fullmap] Remove layers");

        this.getMap().removeLayers();

        this.fireEvent('afterremovelayers');
    },

    /**
     * Initialization
     */
    initializeMapView: function () {
        const view = this.view;

        const zoom = view.zoom ? view.zoom : 12;
        const center = view.center ? view.center : [-122.416667, 37.783333];
        const projection = view.projection ? view.projection : 3857;

        this.getMap().setMapView(center, zoom, 'EPSG:' + projection);
    },

    /**
     * GETTERS
     */
    getMap() {
        return this.down('map');
    },

    getOlMap() {
        return this.getMap().getMap();
    },

    getMasterDetail() {
        return this._masterdetail;
    },

    getExtent: function () {
        return this.view.extent;
    },

    getZoom: function () {
        return this.view.zoom;
    },

    /**
     * AUX
     */
    createToolsPanel(tools, layout, alignment, side) {
        let toolPanel = null;

        if (tools.length > 0) {
            const buttonSize = this.tools.css.all.width;//'40px';//'40px';
            // const colorPalette = this.tools.css.all.colorPalette;

            const allCSS = this.tools.css.all;
            const specificCSS = this.tools.css[side];

            let buttonCSS = Object.assign({}, allCSS, specificCSS);

            const me = this;
            const processedTools = [];

            let spaceSize = 0;
            for (let i = 0; i < tools.length; i++) {
                // TODO: Check if xtype exists
                const tool = tools[i];

                if (tool.xtype !== 'placeholder') {
                    if (spaceSize > 0) {
                        let margin = '';

                        switch (side) {
                            case 'left':
                                margin = spaceSize + 'px 0 0 0';
                                break;
                            case 'right':
                                margin = '0 0 ' + spaceSize + 'px 0';
                                break;
                            default:
                                break;
                        }

                        tool['margin'] = margin;

                        spaceSize = 0;
                    }

                    processedTools.push(tool);
                } else {
                    spaceSize = tool.size;
                }
            }

            toolPanel = Ext.create('Ext.container.Container', {
                floating: true,

                shadow: false,

                layout: {
                    type: (side === 'right' || side === 'left') ? 'hbox' : 'vbox',
                    align: 'stretch'
                },

                items: [
                    {
                        xtype: 'container',
                        layout: {
                            type: layout,
                            pack: alignment,
                            align: 'middle'
                        },

                        defaults: {
                            style: buttonCSS,
                            side: side,
                            // ui: 'map-tool-' + colorPalette,
                            userCls: 'map-btn map-btn-' + side,

                            focusable: false,

                            plugins: 'responsive',
                            responsiveConfig: {
                                'width <= 768': {
                                    width: buttonSize,
                                    height: buttonSize
                                },
                                'width > 768 && width <= 1080': {
                                    width: buttonSize + 5,
                                    height: buttonSize + 5
                                },
                                'width > 1080': {
                                    width: buttonSize + 10,
                                    height: buttonSize + 10
                                },
                            },
                            mapscope: me
                        },

                        items: processedTools
                    }
                ]
            });

            /**
             * TODO: We are forcing the masterdetail to anchor to the right side, All the others are ignored
             */
            if ('right' === side) {
                const md = this.createMasterDetail(side);

                if (side === 'left' || side === 'top') {
                    toolPanel.moveAfter(md, null);
                } else {
                    toolPanel.add(md);
                }

                this._masterdetail = md;
            }
        }

        return toolPanel;
    },

    createMasterDetail: function (side) {
        let resizeSide = 'w';

        switch(side){
            case 'left':
                resizeSide = 'e';
                break;
            case 'right':
                resizeSide = 'w';
                break;
            case 'top':
                resizeSide = 's';
                break;
            default:
                resizeSide = 'n';
                break;
        }

        return Ext.create({
            xtype: 'masterdetail',
            resizable: {
                handles: resizeSide
            },
        });
    },

    /**
     * Event Functions
     */

    /**
     * On resize, adjust the size and anchors of floating components
     * @param w
     * @param h
     */
    onResize: function (w, h) {
        let lw = 0,
            rw = 0;

        if (this._left) {
            this._left.setHeight(h);
            lw = this._left.getWidth();
        }

        if (this._right) {
            this._right.setHeight(h);
            this._right.anchorTo(this, 'tr-tr', [1, 0]); // TODO: extjs bug? This should not be needed
            rw = this._right.getWidth();
        }

        if (this._down) {
            this._down.setWidth(w - lw - rw);
            this._down.anchorTo(this, 'bl-bl', [lw, 0]);
        }

        if (this._up) {
            this._up.setWidth(w - lw - rw);
            this._up.anchorTo(this, 'tl-tl', [lw, 0]);
        }

        if (this._masterdetail) {
            this._masterdetail.setWidth(Math.floor(0.25 * w));
        }

        this.callParent()
    },

    /**
     * On render, initialize the geospatial map and load layers
     */
    onRender: function () {
        this.callParent();

        this.initializeMapView();

        if (this.autoLoad) {
            this.loadLayers();
        }
    },

    /**
     * On afterrender, finalize the setup of all the overlay components
     */
    afterRender: function () {
        this.callParent();

        const me = this;
        const mapEl = this.getEl(),
            leftPanel = this._left,
            rightPanel = this._right,
            topPanel = this._up,
            downPanel = this._down,
            cTools = this._ctools;

        if (leftPanel) {
            leftPanel.on('afterlayout', function () {
                leftPanel.anchorTo(me, 'tl-tl');
            });

            leftPanel.render(mapEl);
        }

        if (rightPanel) {
            rightPanel.on('afterlayout', function () {
                rightPanel.anchorTo(me, 'tr-tr');
            });

            rightPanel.render(mapEl);
        }

        if (downPanel) {
            downPanel.on('afterlayout', function () {
                downPanel.anchorTo(me, 'bl-bl');
            });

            downPanel.render(mapEl);
        }

        if (topPanel) {
            topPanel.on('afterlayout', function () {
                topPanel.anchorTo(me, 'tl-tl');
            });

            topPanel.render(mapEl);
        }

        if (cTools.length > 0) {
            for (let idx in cTools) {

                const t = cTools[idx];

                const pos = t.pos;

                t['mapscope'] = me;

                if (pos && Array.isArray(pos) && pos.length === 2) {

                    // TODO: Wondering if this property isn't dirty
                    t['floating'] = true;

                    const wrapper = Ext.create(t);

                    wrapper.on('afterrender', function () {
                        wrapper.anchorTo(me, 'tl-tl', pos);
                    });

                    wrapper.render(mapEl);

                } else {
                    console.log("[MapTools] No position specified for custom tool");
                }

            }
        }
    },

    onDestroy: function(){
        if(this._left){
            this._left.destroy();
        }

        if(this._right){
            this._right.destroy();
        }

        if(this._up){
            this._up.destroy();
        }

        if(this._down){
            this._down.destroy();
        }
    }
});
