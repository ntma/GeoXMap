Ext.define('GeoXMap.tools.base.MasterDetail', {
    extend: 'Ext.panel.Panel',

    xtype: 'geo_masterdetail',

    draggable: false,

    header: false,

    layout: {
        type: 'vbox',//'fit'
        align: 'stretch'
    },

    userCls: 'map-panel',

    slided: true,

    // Active master detail component
    _activeId: null,

    items: [
        // Header
        {
            xtype: 'container',
            height: 50,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'container',
                    layout: 'fit',
                    userCls: 'map-ctn',
                    flex: 1,
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-arrow-left',
                            userCls: 'map-btn',
                            handler: function(){
                                this.up('geo_masterdetail').backToCard();
                            }
                        }
                    ]
                },
                {
                    xtype: 'title',
                    userCls: 'map-title',
                    editable: false,
                    text: 'Title',
                    flex: 7,
                    style: {
                        textAlign: 'center'
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'fa fa-times',
                    userCls: 'map-btn',

                    flex: 1,
                    handler: function(){
                        this.up('geo_masterdetail').close();
                    }
                }
            ]
        },

        // Body
        {
            xtype: 'container',

            flex:1,

            layout: 'fit',

            items: [

            ]
        }
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

    navigateToCard: function(xtype){
        const cardCmp = this.getRefItems()[1].down();

        const activedCmp = cardCmp.activateCard(xtype);

        this.setTitle(activedCmp.title);

        const goBackCtrl = this.getNavigationHeader().down('container').down('button');

        goBackCtrl.show();
    },

    backToCard: function(){
        const cardCmp = this.getRefItems()[1].down();

        const activedCmp = cardCmp.backToCard();

        this.setTitle(activedCmp.title);

        if(!cardCmp.getQueueLength()){
            const goBackCtrl = this.getNavigationHeader().down('container').down('button');

            goBackCtrl.hide();
        }
    },


    getNavigationHeader: function(){
        return this.down('container');
    },

    getSlided: function(){
        return this.slided;
    },

    getActiveChildId: function(){
        return this._activeId;
    },

    setActiveChildId: function(id){
      this._activeId = id;
    },

    // Intentional override
    setTitle: function(title){
        this.down('container').down('title').setText(title);
    },

    /**
     * Replaces the master detail component with a new one
     * Returns true if replaced, else the component is the same
     *
     * @param cmp: ext component
     * @returns {boolean}
     */

    replaceChildItem: function(cmp){

        const activeId = this.getActiveChildId();

        if (activeId !== cmp.xtype) {

            this.removeChildItem();

            this.setTitle(cmp.title);

            this.addChildItem(cmp);

            this.setActiveChildId(cmp.xtype);
            
            const goBackCtrl = this.getNavigationHeader().down('container').down('button');

            if(!cmp.getQueueLength()){
                goBackCtrl.hide();
            }

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
        const md = this.getRefItems()[1];

        md.add(cmp);
    },

    /**
     * Util to remove a child component
     */
    removeChildItem: function(){
        const md = this.getRefItems()[1];

        md.remove(0, false);
    }
});