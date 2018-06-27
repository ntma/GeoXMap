Ext.define('GeoXMap.tools.controls.Layers', {
    extend: 'Ext.button.Button',
    xtype: 'maplayers',

    iconCls: 'fa fa-list',

    constructor(config){
        this._layerspanel = config.mapscope.getLayersPanel();

        if(config.animated){
            this._layerspanel.animateTarget = this;
        }

        this.callParent([config])
    },

    listeners: {
        click: function(){
            const layerspanel = this._layerspanel;

            if(layerspanel.isHidden()){
                layerspanel.show();
            } else {
                layerspanel.hide();
            }
        }
    }
});