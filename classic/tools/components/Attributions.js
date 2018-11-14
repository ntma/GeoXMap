Ext.define('GeoXMap.tools.components.Attributions', {
    extend: 'Ext.container.Container',
    xtype: 'geo_attributions',

    height:40,

    userCls: 'map-attributions-wrapper underlay-z-index',

    shadow: false,

    style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right'
    },

    layout: 'fit',

    constructor: function (config) {

        this.callParent([config]);

        const me = this;

        this.templateHtml = new Ext.Template(
            '<div class="map-attributions" style="" >' +
            '<div class="map-attributions-text"> {prefix} <a href="{url}">{link}</a> {suffix}' + // </div> <a class="map-attributions-icon"> i </a>' +
            '</div>'
        );

        me.show({suffix: me.suffix, url: me.turl, link: me.link, prefix: me.prefix});
    },

    show: function (values) {
        let html = '';

        if (values) {
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