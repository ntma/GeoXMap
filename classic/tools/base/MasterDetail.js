Ext.define('GeoXMap.tools.base.MasterDetail', {
    extend: 'Ext.panel.Panel',

    xtype: 'geo_masterdetail',

    // header: false,
    // hidden: true,
    draggable: false,
    closable: true,

    layout: 'fit',

    userCls: 'map-panel',

    slided: true,

    // Active master detail component
    _activeId: null,

    items: [

    ],

    listeners: {
        beforeclose: function () {
            this.slideFx(true);

            return false;
        }
    },

    slideFx: function (close, duration) {
        const toolPanel = this.up();

        // MasterDetail size
        const w1 = this.getWidth(),
            // Scope size
            w2 = this.mapscope.getWidth(),
            // Tool bar size
            w4 = toolPanel.getWidth(),
            // offset
            w3 = w4 - w1;

        const offset = (close) ? w2 - w3 : w2 - w4;

        this.slided = close;

        const dur = (duration >= 0) ? duration : 1000;

        const me = this;

        Ext.create('Ext.fx.Anim', {
            target: toolPanel,
            duration: dur,
            to: {
                left: offset
            },
            listeners: {
                beforeanimate: function(){
                    me.up('geo_toolpanel').fireEvent('startslide');
                },
                afteranimate: function(){
                    me.up('geo_toolpanel').fireEvent('endslide');
                }
            }
        });
    },

    getSlided: function(){
        return this.slided;
    },

    getActiveChildId: function(){
        return this._activeId;
    },

    getInnerDetailCmp: function(){
        return this.getRefItems()[1];
    },

    setActiveChildId: function(id){
      this._activeId = id;
    },

    /**
     * Replaces the master detail component with a new one
     * Returns true if replaced, else the component is the same
     *
     * @param cmp: ext component
     * @returns {boolean}
     */

    replaceChildItem: function(cmp){

        if (this.getActiveChildId() !== cmp.xtype) {

            this.removeChildItem();

            this.addChildItem(cmp);

            this.setActiveChildId(cmp.xtype);

            return true;
        } else {
            return false;
        }
    },

    /**
     * Util to add a child component
     * @param cmp
     */
    addChildItem: function(cmp){
        this.add(cmp);
    },

    /**
     * Util to remove a child component
     */
    removeChildItem: function(){

        const items = this.getRefItems();

        if (items.length > 1) {
            this.remove(items[1], false);
        }
    }
});