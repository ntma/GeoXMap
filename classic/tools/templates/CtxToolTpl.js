Ext.define('GeoXMap.tools.templates.CtxToolTpl', {
    extend: 'Ext.button.Button',

    xtype: 'geo_ctxtooltpl',

    // Public
    ctxmenu: {
        /**
         * Xtype to the component to be show inside the context widnow
         */
        type: 'panel',


        /**
         * True if the context window should get focus on show
         */
        focusable: false,


        /**
         * If the ctx menu is anchored to the tool
         */
        anchored: true,
    },

    // Private

    /**
     * Floatable window which will wrap the context menu component
     */
    _contextWindow: null,

    /**
     * Side to anchor the context menu
     * Defautls to left
     */
    _anchorSide: 'tl-tr',

    /**
     * Helper to initialize the context menu position
     */
    _firstShow: true,

    constructor: function (config) {

        this.callParent([config]);

        let anchorSide = 'tl-tl';

        switch (config.side) {
            case 'left':
                anchorSide = 'tl-tr';
                break;
            case 'right':
                anchorSide = 'tr-tl';
                break;
            case 'top':
                anchorSide = 'tl-bl';
                break;
            default:
                anchorSide = 'bl-tl';
                break;
        }

        this._anchorSide = anchorSide;


        const me = this;
        const mapscope = this.mapscope;
        const ctxmenu = config.ctxmenu;

        const ctxtype = ctxmenu.type;
        const ctxfocus = ctxmenu.focusable;
        const ctxanchored = ctxmenu.anchored;

        // this.onclickOpen = (ctxmenu.clickopen !== undefined) ? ctxmenu.clickopen : true;

        const ctxw = Ext.create({
            xtype: ctxtype,
            mapscope: mapscope,
            ctxfocus: ctxfocus
        });

        mapscope.on('resize', function () {
            if (ctxanchored) {
                me.alignCtxWindow();
            } else {
                ctxw.center();
            }
        });

        this.on('afterrender', function () {
            ctxw.render(mapscope.getEl());
        });

        // if(this.onclickOpen){
        this.on('click', this.openWindow, this);
        // }

        this._contextWindow = ctxw;
    },

    alignCtxWindow: function () {
        const window = this._contextWindow,
            mapscope = this.mapscope,
            button = this;

        const mapWidth = mapscope.getWidth(),
            mapHeight = mapscope.getHeight(),
            mapScreenX = mapscope.getX(),
            mapScreenY = mapscope.getY();

        const windowWidth = window.getWidth(),
            windowHeight = window.getHeight();

        const coords = window.getAlignToXY(button, button._anchorSide);

        let readjustX = 0.0,
            readjustY = 0.0;

        const newX = coords[0] - mapScreenX;
        const newY = coords[1] - mapScreenY;

        if (newY + windowHeight > mapHeight) {
            readjustY = -(newY + windowHeight - mapHeight);
        }

        if (newX + windowWidth > mapWidth) {
            readjustX = -(newX + windowWidth - mapWidth);
        }

        window.setPosition(newX + readjustX, newY + readjustY);
    },

    openWindow: function(){
        const ctxw = this._contextWindow;

        if (ctxw.isHidden()) {
            ctxw.show();
            ctxw.focus();

            if(this._firstShow && this.ctxmenu.anchored) {
                this.alignCtxWindow();

                this._firstShow = false;
            }
        } else {
            ctxw.hide();
        }
    },

    onDestroy: function () {
        if(this._contextWindow){
            this._contextWindow.destroy();
        }
    }
});