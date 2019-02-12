Ext.define('GeoXMap.tools.components.Search', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'geo_search',

    displayField: 'name',
    valueField: 'lonlat',
    emptyText: 'Search Address...',

    queryMode: 'remote',
    queryParam: 'q',
    minChar: 4,

    store: null,

    hideTrigger: true,

    width: 300,

    pos: [70, 20],

    userCls: 'underlay-z-index',

    shadow: false,

    constructor: function (config) {
        this.callParent([config]);

        this.fromEpsg = config.params.fromEpsg;
        this.toEpsg = config.params.toEpsg;

        this.zoom = (config.params.zoom) ? config.params.zoom : 16;
        this.duration = (config.params.duration) ? config.params.duration : 1000;

        const nominatimStore = (config.params.url) ? this.createUrlNominatimStore(config.params.url) :
                                                     this.createCustomNominatimStore(config.params.model);

        // Setup store
        this.setStore(nominatimStore);

        // Setup Layer
        this.setupLayer();
    },

    // Creates required layer and adds it to the olmap
    setupLayer: function () {
        const nominatimLayer = new ol.layer.Vector({
            name: 'nominatim--',
            source: new ol.source.Vector({})
        });

        this.mapscope.getOlMap().addLayer(nominatimLayer);

        this.nominatimLayer = nominatimLayer;
    },

    createUrlNominatimStore: function (nominatimUrl) {

        const nominatimStore = Ext.create('Ext.data.Store', {
            fields: [{
                name: "name",
                mapping: "display_name"
            }, {
                name: "bounds",
                convert: function (v, rec) {
                    const bbox = rec.get('boundingbox');
                    return [bbox[2], bbox[0], bbox[3], bbox[1]];
                }
            }, {
                name: "lonlat",
                convert: function (v, rec) {
                    return [rec.get('lon'), rec.get('lat')];
                }
            }],
            proxy: {
                type: 'ajax',
                url: nominatimUrl,
                reader: {
                    type: 'json'
                }
            }
        });

        return nominatimStore;
    },

    createCustomNominatimStore: function (nominatimModel) {

        const nominatimStore = Ext.create('Ext.data.Store', {
            model: nominatimModel
        });

        return nominatimStore;
    },

    /**
     * On search nominatim
     * @param combo: Combobox reference
     * @param coords: Coordinates
     */
    onSearch: function (combo, coords) {
        const map = this.mapscope.getMap();

        const vectorLayer = this.nominatimLayer;
        vectorLayer.getSource().clear(true);

        if (Array.isArray(coords)) {
            const fromEpsgCode = (this.fromEpsg) ? this.fromEpsg : map.getProjectionCode();
            const toEpsgCode = (this.toEpsg) ? this.toEpsg : map.getProjectionCode();

            const position = map.transformCoordinates(coords.map(Number), fromEpsgCode, toEpsgCode);
            // const geoMarker = new ol.Feature({
            //     geometry: new ol.geom.Point(position)
            // });
            //
            // vectorLayer.getSource().addFeature(geoMarker);

            map.animateToPoint(position, this.zoom, this.duration);
        }
    },

    listeners: {
        change: function (combo, value) {
            this.onSearch(combo, value)
        }
    }
});