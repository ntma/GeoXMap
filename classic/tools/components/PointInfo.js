Ext.define('GeoXMap.tools.components.PointInfo', {
    extend: 'Ext.panel.Panel',

    xtype: 'geo_pointinfo',

    defaults: {
        margin: 10
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    config: {
        idKey: '',
        columnsKey: ''
    },

    items: [
        {
            xtype: 'panel',

            flex: 1,
            userCls: 'map-panel',

            header: false,

            layout: {

                type: 'vbox',
                align: 'stretch'
            },


            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        style: {
                            textAlign: 'center'
                        }
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            value: 'Coordinate:',
                            flex: 2,
                            editable: false
                        },
                        {
                            xtype: 'displayfield',
                            value: 0,
                            flex: 3,
                            editable: false
                        },
                        {
                            xtype: 'displayfield',
                            value: 0,
                            flex: 3,
                            editable: false
                        }
                    ]
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: '# Features',
                    value: 0,
                    style: {
                        textAlign: 'center'
                    },
                    width: '100%',
                    editable: false
                },

            ]
        },
        {
            xtype: 'container',
            flex: 8,
            layout: 'accordion',
            items: [
                {
                    xtype: 'grid',
                    title: 'Feature Information',
                    reference: 'layersinfo',
                    titleAlign: 'center',

                    userCls: 'map-panel',
                    autoLoad: true,

                    features: [{ftype: 'grouping'}],

                    columns: [
                        {
                            text: 'Unique Id',
                            dataIndex: 'uniqueid',
                            flex: 1
                        },
                        {
                            text: 'Geometry Name',
                            dataIndex: 'name',
                            flex: 1
                        },
                        {
                            text: 'Geometry Type',
                            dataIndex: 'type',
                            flex: 1
                        }
                    ],

                    store: {
                        groupField: 'layer',

                        fields: [
                            'layer',
                            'name',
                            'type'
                        ],
                        data: [],
                    },
                    listeners: {
                        select: function (grid, record) {
                            const data = record.getData();

                            const properties = data.properties;

                            if (properties) {

                                const data = [];

                                for (const key in properties) {
                                    const f = {
                                        prop: key,
                                        value: properties[key]
                                    };

                                    data.push(f);
                                }

                                const detailedGrid = this.up().getRefItems()[1];

                                const store = detailedGrid.getStore();

                                // Need to expand first, else the grid refresh freaks out
                                detailedGrid.expand();

                                store.loadData(data, false);
                            }

                            // grid.deselect(record);
                        }
                    }
                },
                {
                    xtype: 'grid',
                    title: 'Geospatial Information',
                    titleAlign: 'center',

                    userCls: 'map-panel',

                    columns: [
                        {
                            text: 'Property',
                            dataIndex: 'prop',
                            flex: 3
                        },
                        {
                            text: 'Value',
                            dataIndex: 'value',
                            flex: 6
                        }
                    ],

                    store: {
                        fields: [
                            'prop',
                            'value'
                        ],
                        data: []
                    }
                }
            ]
        }
    ],

    onOpenWindow: function (params) {
        const me = this;

        // Collapse the second grid if expanded (to avoid a bug where the second store isn't found)
        const gridContainer = this.getRefItems()[1];
        const detailedGrid = gridContainer.getRefItems()[1];

        if (!detailedGrid.getCollapsed()) {
            detailedGrid.collapse();
        }

        // Get the clicked coordinates
        const pixel = params.pixel;
        const coord = params.coords;

        // Set the coordinates
        const coordinateFields = this.down('panel').getRefItems()[0].getRefItems();

        // In lon, lat
        coordinateFields[1].setValue(coord[0]);
        coordinateFields[2].setValue(coord[1]);

        // Header for the Ajax requests
        const header = {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50};

        // Get every layer at the clicked pixel
        const olmap = this.mapscope.getOlMap();
        const olView = olmap.getView();
        const olResolution = olView.getResolution();
        const olProjection = olView.getProjection();

        let layersData = [];

        // The humanid and the visibile field keys to extract from the layers that intersect the clicked point
        const idKey = this.getIdKey();
        const columnsKey = this.getColumnsKey();

        // Tack the Ajax requests (to the geoserver)
        let nRequests = 0;
        const ajaxRequests = [];

        // Prepare Ajax requests
        olmap.forEachLayerAtPixel(pixel, function (layer) {

            // console.log("Layer Info")
            // console.log(layer);
            // console.log(layer.get('name'));
            // console.log(layer.get('title'))

            // Using the keys, extract the humanid and the visible fields to fetch from this layer
            const visibleId = layer.get(idKey);
            const visibleColumns = layer.get(columnsKey);

            const layersource = layer.getSource();

            // TODO: The second check should not be needed
            if (layersource && layersource.getGetFeatureInfoUrl) {
                const url = layersource.getGetFeatureInfoUrl(
                    coord,
                    olResolution,
                    olProjection,
                    header
                );

                const request = {
                    layername: layer.get('name'),
                    url: url,
                    visibleId: visibleId,
                    visibleColumns: visibleColumns
                };

                nRequests += 1;

                ajaxRequests.push(request);
            }
        });

        // Aggregated data extracted from the intersected layers
        let layerData = [];

        // For each prepared Ajax request
        ajaxRequests.forEach(function (request) {

            const url = request.url; // Geoserver url
            const layername = request.layername; // Name of the layer intersected
            const visibleId = request.visibleId; // Human id
            const visibleColumns = (request.visibleColumns) ? request.visibleColumns.split(',') : null; // Visible fields

            // Execute the Ajax request
            Ext.Ajax.request({
                url: url,

                callback: function(req,success,response,opts){

                    if(success){
                        const obj = Ext.decode(response.responseText);

                        const features = obj.features; //.properties

                        const requestedfeatures = [];

                        // For each feature
                        features.forEach(function (feat) {

                            // Filter the properties of this feature (visible fields)
                            const properties = (visibleColumns) ? Object.keys(feat.properties)
                                .filter(key => visibleColumns.includes(key))
                                .reduce(function (obj, key) {
                                    obj[key] = feat.properties[key];
                                    return obj;
                                }, {}) : feat.properties;

                            const geometryType = feat.geometry.type;
                            const geometryName = feat.geometry_name;

                            // Create a data model entry
                            const featureInfo = {
                                layer: layername,
                                properties: properties,
                                uniqueid: properties[visibleId],
                                name: geometryName,
                                type: geometryType
                            };

                            requestedfeatures.push(featureInfo);
                        });

                        // Concat the parsed features with the other Ajax requests
                        layersData = layerData.concat(requestedfeatures);
                    }

                    nRequests -= 1;

                    // If no more pending requests
                    if (nRequests === 0) {
                        me.updateFeatureCount(layersData.length); // update the total features retrieved
                        me.down('grid').getStore().loadData(layersData); // Load the first grid
                    }
                }
            });
        });
    },

    updateFeatureCount: function (count) {
        const featureCount = this.down('panel').getRefItems()[1];

        featureCount.setValue(count);

    }
});