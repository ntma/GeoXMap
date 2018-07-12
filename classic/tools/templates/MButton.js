Ext.define('GeoXMap.tools.templates.MButton', {
    extend: 'Ext.button.Button',

    xtype: 'geo_detailbtn',

    constructor: function (config) {

        this.callParent([config]);

        const params = config.params;

        params['mapscope'] = config.mapscope;

        this._context = Ext.create(params);

        if (config.clickopen) {
            this.on('click', function(){
                this.openWindow({}, false);
            }, this);
        }
    },

    // TODO: needs a refactor
    openWindow: function (params, stayopen) {
        const masterdetail = this.mapscope.getMasterDetail();
        const ctx = this._context;
        let windowChange = false;

        if (masterdetail.activeId !== this.xtype) {

            const items = masterdetail.getRefItems();

            if (items.length > 1) {
                masterdetail.remove(items[1], false);
            }

            masterdetail.add(ctx);

            masterdetail.activeId = this.xtype;

            windowChange = true;
        }

        if (ctx.onOpenWindow) {
            ctx.onOpenWindow(params);
        }

        const slided = masterdetail.getSlided();

        if(windowChange && !slided){
            // Do nothing here
        } else if(stayopen){
            if(slided){
                masterdetail.slideFx(false);
            }
        } else {
            masterdetail.slideFx(!slided);
        }
    }
});