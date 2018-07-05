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

    width: 200,

    constructor: function (config) {
        this.callParent([config]);

        this.fromEpsg = config.params.fromEpsg;
        this.toEpsg = config.params.toEpsg;

        if(config.params.url){

            const nominatimStore = this.createNominatimStore(config.params.url);

            // Setup store
            this.setStore(nominatimStore);
        }

        // Setup Layer
        this.setupLayer();
    },

    // Creates required layer and adds it to the olmap
    setupLayer: function(){
        const nominatimLayer = new ol.layer.Vector({
            name: 'nominatim--',
            source: new ol.source.Vector({})
        });

        this.mapscope.getOlMap().addLayer(nominatimLayer);

        this.nominatimLayer = nominatimLayer;
    },

    createNominatimStore: function(nominatimUrl){

        const nominatimStore = Ext.create('Ext.data.Store', {
            fields: [{
                name: "name",
                mapping: "display_name"
            }, {
                name: "bounds",
                convert: function(v, rec) {
                    const bbox = rec.get('boundingbox');
                    return [bbox[2], bbox[0], bbox[3], bbox[1]];
                }
            }, {
                name: "lonlat",
                convert: function(v, rec) {
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

            // vectorLayer.getSource().addFeature(geoMarker);

            map.animateToPoint(position, -1, 1000);
        }
    },

    listeners: {
        change: function(combo, value){
            this.onSearch(combo,value)
        }
    }
});