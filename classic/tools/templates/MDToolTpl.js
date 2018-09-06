Ext.define('GeoXMap.tools.templates.MDToolTpl', {
    extend: 'Ext.button.Button',

    xtype: 'geo_mdtooltpl',

    /**
     * Options for the master detail window
     */
    masterDetail: {

        /**
         * Xtype for the component to be shown in the master detail
         */
        xtype: 'panel'
    },

    /**
     * If this tool is toggagle or clickable
     */
    enableToggle: false,

    /**
     * Untoggles others tools that belong to this group
     */
    toggleGroup: 'maptools',


    /**
     * Reference to the master detail component
     */
    _mdWindow: null,


    constructor: function (config) {

        this.callParent([config]);

        const masterDetail = config.masterDetail;

        masterDetail['mapscope'] = config.mapscope;

        this._mdWindow = Ext.create(masterDetail);

        // If open on click
        if (!config.enableToggle) {
            this.on('click', this.onClickTool, this);
        } else {
            this.on('toggle', this.onToggleTool, this);
        }
    },

    // TODO: needs a refactor
    openWindow: function (params, stayopen) {
        const masterdetail = this.mapscope.getMasterDetail();
        const ctx = this._mdWindow;
        const mdxtype = this.masterDetail.xtype;

        let windowChange = false;

        if (masterdetail.activeId !== mdxtype) {

            const items = masterdetail.getRefItems();

            if (items.length > 1) {
                masterdetail.remove(items[1], false);
            }

            masterdetail.add(ctx);

            masterdetail.activeId = mdxtype;

            windowChange = true;
        }

        if (ctx.onOpenWindow) {
            ctx.onOpenWindow(params);
        }

        const slided = masterdetail.getSlided();

        if (windowChange && !slided) {
            // Do nothing here
        } else if (stayopen) {
            if (slided) {
                masterdetail.slideFx(false);
            }
        } else {
            masterdetail.slideFx(!slided);
        }
    },

    onClickMap: function (event) {
        const coord = event.coordinate;
        const pixel = event.pixel;

        const params = {
            coords: coord,
            pixel: pixel
        };

        this.openWindow(params, true);
    },

    onClickTool: function () {
        this.openWindow({}, false);
    },

    onToggleTool: function (scope, state) {

        const olmap = this.mapscope.getOlMap();

        // TODO: https://openlayers.org/en/latest/apidoc/ol.CanvasMap.html
        // single click is delayed by 250ms (default)

        if (state) {
            olmap.on('singleclick', this.onClickMap, this);
        } else {
            olmap.un('singleclick', this.onClickMap, this);
        }
    }
});