Ext.define('GeoXMap.map.Fullmap', {
    extend: 'Ext.panel.Panel',
    xtype: 'geo_fullmap',

    requires: [
        'GeoXMap.map.Map',

        'GeoXMap.tools.base.MasterDetail',
        'GeoXMap.tools.base.ToolPanel',

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
        'GeoXMap.tools.controls.Sketch',

        'GeoXMap.tools.components.Layers',
        'GeoXMap.tools.components.GoToForm',
        'GeoXMap.tools.components.Search',
        'GeoXMap.tools.components.Messages',
        'GeoXMap.tools.components.PointInfo'
    ],

    /**
     * Events:
     *   - afterloadlayers
     *   - afterremovelayers
     *   - ...
     */

    /**
     * Map tools configuration
     */
    config: {
        /**
         * Map View parameters
         */
        view: {
            zoom: 12,
            center: [-13627361.035049738, 4548863.085837512],
            extent: [-13640450.876143575, 4531664.754473347, -13614271.193955902, 4566061.417201677],
            projection: 3857
        },

        /**
         * Map Tools configuration
         */
        tools: null
    },


    /**
     * Tool panels reference (west, north, east, south)
     */
    _left: null,
    _top: null,
    _right: null,
    _bottom: null,

    /**
     * Custom tools reference
     */
    _custom: [],

    /**
     * Reference to custom tools (i.e. nominatim search)
     * TODO: To be removed in future release
     */
    _cTools: null,

    /**
     * Reference for master detail panel
     * TODO: multiple master details
     */
    _masterdetail: null,

    /**
     * Contender for layers
     */
    _rawLayers: null,

    autoHeight: true,

    items: [
        {
            xtype: 'geo_map'
        }
    ],

    constructor: function (config) {
        this.callParent([config]);

        /**
         * Setup auto height adjustment on parent resize
         */
        this.setupAutoMapHeight();

        /**
         * Layers Store
         */
        // TODO: This is the store that will actually load layers into the map
        // this.store = null

        /**
         * Setup map tools
         */
        this.setupMapTools(config.headerTools, config.tools);
    },

    setupMapTools: function(headerTools, tools){
        /**
         * Header
         */
        if(this.title || headerTools){

            this.header = false;

            const header = this.createHeaderPanel(this.title, headerTools);

            // TODO: remove this dirty patch
            if(this.down('geo_headerpanel')){
                this.down('geo_headerpanel').destroy();
            }

            this.insert(0, header);

            this.headerHeight = header.height;

            this.headerPanel = header;
        } else {
            this.headerHeight = 0;
        }

        /**
         * Map Tools
         */
        if (tools) {
            // Left panel tools
            const leftPanel = this.createToolsPanel(tools.left, 'vbox', 'start', 'left');
            const rightPanel = this.createToolsPanel(tools.right, 'vbox', 'end', 'right');

            const bottomPanel = this.createToolsPanel(tools.bottom, 'hbox', 'center', 'bottom');
            const topPanel = this.createToolsPanel(tools.top, 'hbox', 'end', 'top');

            this._ctools = tools.custom;

            this._left = leftPanel;
            this._right = rightPanel;

            this._bottom = bottomPanel;
            this._top = topPanel;
        }
    },


    loadLayers: function (layers, append) {
        if (!layers) {
            return;
        }

        if(!append){
            this.removeLayers();
        }

        const olmap = this.getOlMap();

        const layersArray = (Array.isArray(layers)) ? layers : [layers];

        layersArray.forEach(function (layer) {
            olmap.addLayer(layer);
        });

        this._rawLayers = (append) ? this._rawLayers.concat(layers) : layers;

        this.fireEvent('afterloadlayers');
    },

    reloadLayers: function () {
        // console.log("[Fullmap] Reload layers");

        this.removeLayers();

        this.loadLayers(this._rawLayers);
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
        const view = this.view,
            zoom = view.zoom,
            center = view.center,
            projection = view.projection;

        this.getMap().setMapView(center, zoom, 'EPSG:' + projection);
    },

    setupAutoMapHeight: function(){

        if(!this.autoHeight){
            return;
        }

        const parentCmp = this.up(),
            map = this.getMap(),
            me = this;

        if(parentCmp){
            const padding = parentCmp.padding;

            // Account for padding, since it affects the internal height of the parentCmp
            let rawPadding = 0;

            if(typeof padding === 'string'){
                let tdPadding = padding.match(/\d+/g);

                rawPadding = parseInt(tdPadding[0]) + parseInt(tdPadding[2]);

            } else if(Number.isInteger(padding)){
                rawPadding = 2 * padding;
            }

            // TODO: unregister this
            parentCmp.on('resize', function (cmp, width ,height, oldWidth, oldHeight) {

                if(height !== oldHeight){

                    const parentCmpHeader = (parentCmp.getHeader) ? parentCmp.getHeader() : null;

                    const headerHeight = (parentCmpHeader) ? parentCmpHeader.getHeight() : 0;

                    const totalHeight = height - headerHeight - rawPadding - me.headerHeight;

                    map.setHeight(totalHeight);
                }
            });
        }
    },

    /**
     * GETTERS
     */
    getMap() {
        return this.down('geo_map');
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
    createHeaderPanel: function(title, headerTools){
        const header = Ext.create({
            xtype: 'geo_headerpanel'
        });

        header.setTitle(title);

        for(let idx in headerTools){
            const tool = headerTools[idx];

            tool['mapscope'] = this;

            header.addTool(Ext.create(tool));
        }

        return header;
    },

    createToolsPanel(tools, layout, alignment, side) {

        if(!tools){
            return null;
        }

        let toolPanel = null;

        if (tools.length > 0) {
            const me = this;

            toolPanel = Ext.create({
                xtype: 'geo_toolpanel',

                layout: {
                    type: (side === 'right' || side === 'left') ? 'hbox' : 'vbox',
                    align: 'stretch'
                },

                zindex: 1,

                items: [
                    {
                        xtype: 'container',
                        layout: {
                            type: layout,
                            pack: alignment,
                            align: 'middle'
                        },

                        defaults: {
                            margin: (side === 'right') ? '0 0 20px 0' : '20px 0 0 0',
                            side: side,
                            userCls: 'map-btn clickable',

                            focusable: false,

                            plugins: 'responsive',
                            responsiveConfig: {
                                'width <= 768': {
                                    width: 40,
                                    height: 40
                                },
                                'width > 768 && width <= 1080': {
                                    width: 45,
                                    height: 45
                                },
                                'width > 1080': {
                                    width: 50,
                                    height: 50
                                },
                            },
                            mapscope: me
                        },

                        items: tools
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

                toolPanel['userCls'] = 'map-tool-container-detail unclickable';

                this._masterdetail = md;
            }
        }

        return toolPanel;
    },

    createMasterDetail: function (side) {
        let resizeSide = 'w';

        switch (side) {
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
            xtype: 'geo_masterdetail',
            resizable: {
                handles: resizeSide
            },
            mapscope: this
        });
    },

    setColorProfile: function(colors){
        const rootCSS = Ext.util.CSS.getRule(':root').style;

        const base = colors.base,
            hover = colors.hover,
            pressed = colors.pressed;

        if(base){
            rootCSS.setProperty('--map-base-color', base);
        }

        if(hover){
            rootCSS.setProperty('--map-hover-color', hover);
        }

        if(pressed){
            rootCSS.setProperty('--map-pressed-color', pressed);
        }
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

        const offsetH = h - this.headerHeight;

        if (this._left) {
            this._left.setHeight(offsetH);
            lw = this._left.getWidth();
        }

        if (this._right) {
            this._right.setHeight(offsetH);

            // TODO: masterdetail will be dynamic in side. THis has to be too
            if(this._masterdetail){
                // Fetch the width from the visible border
                this._right.getRefItems()[0].getWidth();
            } else {
                rw = this._right.getWidth();
            }
        }

        if (this._bottom) {
            this._bottom.setWidth(w - lw - rw);
        }

        if (this._top) {
            this._top.setWidth(w - lw - rw);
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

        // TODO: Pass layers as a json config?
        // if (this.autoLoad) {
        //     this.loadLayers();
        // }
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
            topPanel = this._top,
            bottomPanel = this._bottom,
            cTools = this._ctools;

        const event = 'afterlayout';

        const offsetH = this.headerHeight;

        if (leftPanel) {
            leftPanel.on(event, function () {
                leftPanel.anchorTo(me, 'tl-tl', [0, offsetH]);
            });

            leftPanel.render(mapEl);
        }

        if (rightPanel) {
            // TODO: masterdetail is bounded to the right panel ONLY, in future to be dynamic
            rightPanel.on(event, function () {
                const slided = me._masterdetail.getSlided();

                const offset = (slided) ? [Math.floor(me._masterdetail.getWidth()), offsetH] : [0,offsetH];

                rightPanel.removeAnchor().anchorTo(me, 'tr-tr', offset);
            });

            rightPanel.render(mapEl);
        }

        if (bottomPanel) {
            bottomPanel.on(event, function () {
                bottomPanel.anchorTo(me, 'bl-bl');
            });

            bottomPanel.render(mapEl);
        }

        if (topPanel) {
            topPanel.on(event, function () {
                topPanel.anchorTo(me, 'tl-tl', [0,offsetH]);
            });

            topPanel.render(mapEl);
        }

        if (cTools && cTools.length > 0) {
            for (let idx in cTools) {

                const t = cTools[idx];

                t['mapscope'] = me;
                t['floating'] = true;

                const wrapper = Ext.create(t);
                wrapper.pos[1] += me.headerHeight;

                const pos = wrapper.pos;

                if (pos && Array.isArray(pos) && pos.length === 2) {
                    // TODO: need refactor this event handler
                    me.on('resize', function(){

                        switch(wrapper.posAnchorX){
                            case 'right':
                                wrapper.pos[0] = me.getWidth() - wrapper.getWidth();
                                break;
                            case 'center':
                                wrapper.pos[0] = Math.floor(me.getWidth() / 2.0);
                                break;
                            case 'left':
                                wrapper.pos[0] = 0;
                                break;
                        }

                        switch(wrapper.posAnchorY){
                            case 'down':
                                wrapper.pos[1] = me.getHeight() - wrapper.getHeight();
                                break;
                            case 'center':
                                wrapper.pos[1] = Math.floor(me.getHeight() / 2.0);
                                break;
                            case 'top':
                                wrapper.pos[1] = 0;
                                break;
                        }

                        if(wrapper.rendered){
                            wrapper.anchorTo(me, 'tl-tl', wrapper.pos);
                        }
                    });

                    wrapper.on(event, function () {

                        const p = pos;

                        switch(wrapper.posAnchorX){
                            case 'right':
                                p[0] = me.getWidth() - wrapper.getWidth();
                                break;
                            case 'center':
                                p[0] = Math.floor(me.getWidth() / 2.0) - wrapper.getWidth() / 2.0;
                                break;
                            case 'left':
                                p[0] = 0;
                                break;
                        }

                        switch(wrapper.posAnchorY){
                            case 'down':
                                p[1] = me.getHeight() - wrapper.getHeight();
                                break;
                            case 'center':
                                p[1] = Math.floor(me.getHeight() / 2.0);
                                break;
                            case 'top':
                                p[1] = 0;
                                break;
                        }

                        wrapper.pos = pos;

                        wrapper.anchorTo(me, 'tl-tl', p);
                    });

                    // Store the reference, so we can destroy it later
                    me._custom.push(wrapper);

                    wrapper.render(mapEl);

                } else {
                    console.log("[MapTools] No position specified for custom tool");
                }

            }
        }
    },

    onDestroy: function () {
        if (this._left) {
            this._left.destroy();
        }

        if (this._right) {
            this._right.destroy();
        }

        if (this._top) {
            this._top.destroy();
        }

        if (this._bottom) {
            this._bottom.destroy();
        }

        if(this._custom.length){
            const customTools = this._custom;

            for(let key in customTools){
                customTools[key].destroy();
            }
        }
    }
});
