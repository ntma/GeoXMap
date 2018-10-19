Ext.define('GeoXMap.tools.components.Attributions', {
    extend: 'Ext.container.Container',
    xtype: 'geo_attributions',

    height:50,

    userCls: 'map-attributions-wrapper',

    items: [
        {
            xtype: 'panel',
            height: 25,
            userCls: 'map-attributions',
            margin: 10
        }
    ],

    layout: 'fit',

    constructor: function (config) {

        this.callParent([config]);

        const me = this;

        this.templateHtml = new Ext.Template('<div style="padding:3px" > {prefix} <a href="{url}">{link}</a> {suffix}</div>');

        const mapscope = config.mapscope;

        mapscope.on('afterloadlayers', function(){
            me.show({suffix: me.suffix, url: me.url, link: me.link, prefix: me.prefix});
        });
    },

    show: function(values){
        let html = '';

        if(values){
            html = this.templateHtml.apply({
                prefix: values.prefix,
                url: values.url,
                link: values.link,
                suffix: values.suffix
            });
        }

        this.down('panel').setHtml(html);
    }
});