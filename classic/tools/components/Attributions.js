Ext.define('GeoXMap.tools.components.Attributions', {
    extend: 'Ext.container.Container',
    xtype: 'geo_attributions',

    height:40,

    userCls: 'underlay-z-index',

    shadow: false,

    style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    layout: 'fit',

    constructor: function (config) {

        this.callParent([config]);

        const me = this;

        this.templateHtml = new Ext.Template(
            '<div class="map-attributions" style="" >' +
                '{prefix} <a href="{url}">{link}</a> {suffix}' +
            '</div>'
        );

            me.show({suffix: me.suffix, url: me.url, link: me.link, prefix: me.prefix});
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

        this.setHtml(html);
    }
});