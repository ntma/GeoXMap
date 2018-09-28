Ext.define('GeoXMap.tools.base.MasterDetailCard', {
    extend: 'Ext.panel.Panel',

    xtype: 'geo_masterdetailcard',

    title: 'Title',

    config: {
        _backtracerQueue: [],
    },

    layout: {
        type: 'card',
        align: 'stretch'
    },

    items: [],

    getQueueLength: function(){
        return this.getConfig('_backtracerQueue').length;
    },

    activateCard: function(nextCard){

        const cardLayout = this.getLayout();

        const curCard = cardLayout.getActiveItem();

        this.getConfig('_backtracerQueue').push(curCard);

        return cardLayout.setActiveItem(nextCard);
    },

    backToCard: function () {
        const queue = this.getConfig('_backtracerQueue');

        const prevCard = queue[queue.length -1];

        const activatedItem = this.getLayout().setActiveItem(prevCard);

        if(activatedItem){
            queue.pop();
        }

        return activatedItem;
        // return !!this._backtracerQueue.length;
    }
});