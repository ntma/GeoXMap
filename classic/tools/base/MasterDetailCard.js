Ext.define('GeoXMap.tools.base.MasterDetailCard', {
    extend: 'Ext.panel.Panel',

    xtype: 'geo_masterdetailcard',

    title: 'Title',

    _backtracerQueue: [],

    layout: {
        type: 'card',
        align: 'stretch'
    },

    items: [],

    getQueueLength: function(){
        return this._backtracerQueue.length;
    },

    activateCard: function(nextCard){

        const cardLayout = this.getLayout();

        const curCard = cardLayout.getActiveItem();

        this._backtracerQueue.push(curCard);

        cardLayout.setActiveItem(nextCard);
    },

    backToCard: function () {
        const prevCard = this._backtracerQueue.pop();

        this.getLayout().setActiveItem(prevCard);

        return !!this._backtracerQueue.length;
    }
});