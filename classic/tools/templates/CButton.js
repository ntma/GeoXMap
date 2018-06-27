Ext.define('GeoXMap.tools.templates.CButton', {
    extend: 'Ext.button.Button',

    xtype: 'ctxbtn',

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

        this._firstShow = true;

        this._anchorSide = anchorSide;

        const params = config.params;

        const me = this;
        const mapscope = this.mapscope;

        const ctxtype = params.ctxtype ? params.ctxtype : 'panel';
        this.position = params.position;

        this.ctxfocus = params.ctxfocus;

        const ctxw = Ext.create('Ext.window.Window', {
            header: false,
            resizable: false,
            bodyBorder: false,
            border: false,

            draggable: false,

            userCls: 'mappanel',
            // ui: me.ui.replace('tool', 'window'),

            hidden: true,
            hideMode: 'offsets',

            layout: 'fit',

            items: [
                {
                    xtype: ctxtype,

                    getMapScope: function () {
                        return mapscope;
                    },

                    hideWindow: function(){
                        ctxw.hide();
                    },

                    showWindow: function(){
                        ctxw.show();
                    }
                }
            ]
        });

        ctxw.on('focusleave',function(){
            if(me.ctxfocus){
                ctxw.hide();
            }
        });

        mapscope.on('resize', function () {
            if (me.position === 'anchor') {
                me.alignCtxWindow();
            } else {
                ctxw.center();
            }
        });

        this.on('afterrender', function () {
            ctxw.render(mapscope.getEl());
        });

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

    listeners: {
        click: function () {
            const ctxw = this._contextWindow;

            if (ctxw.isHidden()) {
                ctxw.show();
                ctxw.focus();

                if(this._firstShow && this.position === 'anchor') {
                    this.alignCtxWindow();

                    this._firstShow = false;
                }
            } else {
                ctxw.hide();
            }
        }
    }
});