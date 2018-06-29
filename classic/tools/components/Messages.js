Ext.define('GeoXMap.tools.components.Messages', {
    extend: 'GeoXMap.tools.templates.ContextWindow',
    xtype: 'messages',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    hideMode: 'offsets',

    items: [
        {
            xtype: 'button',
            iconCls: 'fa fa-exclamation-triangle',
            userCls: 'map-btn',
            handler: function () {
                this.up().hide();
            }
        },
        {
            xtype: 'textfield',
            editable: false,
            text: 'WARNING',
            emptyText: 'WARNING'
        }
    ],

    constructor: function (config) {

        this.callParent([config]);

        const me = this;

        const mapscope = config.mapscope;

        this._msgTimeout = null;

        const dismissTime = this.dismissTime;
        const direction = this.direction;

        Ext.util.Observable.capture(mapscope, function (evtname) {


            const msg = me.convertEvtname(evtname);

            if (msg) {
                // Set the warning value
                me.down('textfield').setEmptyText(msg);

                me.show();

                me.animate(me.buildAnimations(direction, true));

                if (dismissTime && dismissTime > 0) {
                    if (me._msgTimeout) {
                        clearTimeout(me._msgTimeout);
                    }

                    me._msgTimeout = setTimeout(function () {
                        me.animate(me.buildAnimations(direction, false)).hide();
                    }, dismissTime * 1000);
                }
            }
        });
    },

    convertEvtname: function (evtname) {

        let msg = null;

        switch (evtname) {
            case 'afterloadlayers':
                msg = 'Loaded Layers';
                break;
            case 'afterremovelayers':
                msg = 'Removed Layers';
                break;
            default:
                break;
        }

        return msg;
    },

    buildAnimations: function (direction, show) {


        const mapscope = this.mapscope,
            me = this;
        const p = mapscope.getPosition(),
            w = mapscope.getWidth(),
            h = mapscope.getHeight(),
            initialPos = me.pos;

        let toPosition = {
            x: p[0],
            y: p[1]
        };

        if(show){

            switch(direction){
                case 'left':
                    toPosition.x += initialPos[0];
                    toPosition.y += initialPos[1];
                    break;
                case 'right':
                    toPosition.x += w - initialPos[0] - me.getWidth();
                    toPosition.y += initialPos[1];
                    break;

                case 'top':
                    toPosition.x += initialPos[0];
                    toPosition.y += initialPos[1];
                    break;

                default:
                    toPosition.x += initialPos[0];
                    toPosition.y += h - initialPos[1] - me.getHeight();
                    break;
            }
        } else {
            switch(direction){
                case 'left':
                    toPosition.x += - me.getWidth();
                    toPosition.y += initialPos[1];
                    break;
                case 'right':
                    toPosition.x += w + me.getWidth();
                    toPosition.y += initialPos[1];
                    break;

                case 'top':
                    toPosition.x += initialPos[0];
                    toPosition.y += - me.getHeight();
                    break;

                default:
                    toPosition.x += initialPos[0];
                    toPosition.y += h + me.getHeight();
                    break;
            }
        }

        return {to: toPosition};
    }
});