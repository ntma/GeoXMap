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

            height: 120,
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
                            width: 100,
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
                    labelWidth: 100,
                    value: 0,
                    flex: 1,
                    style: {
                        textAlign: 'center'
                    },
                    editable: false
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'displayfield',
                            value: 'Status:',
                            width: 100,
                            style: {
                                textAlign: 'center'
                            }
                        },
                        {
                            xtype: 'progressbar',
                            flex: 1,
                            userCls: 'map-progress-bar'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',

            flex: 1,

            layout: {
                type: 'card'
            },

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
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 40,
                            items: [
                                {
                                    iconCls: 'fa fa-info',
                                    tooltip: 'Inspect',
                                    handler: function (view, recIndex, cellIndex, item, e, record) {

                                        const data = record.getData();

                                        const properties = data.properties;

                                        if (properties) {

                                            const jsonData = [];

                                            for (const key in properties) {
                                                const f = {
                                                    prop: key,
                                                    value: properties[key]
                                                };

                                                jsonData.push(f);
                                            }

                                            const grid = this.up('grid');

                                            const detailedGrid = grid.up().getRefItems()[1];

                                            const store = detailedGrid.getStore();

                                            // TODO: This should not be needed
                                            store.removeAll();
                                            store.loadData(jsonData, false);

                                            grid.up().getLayout().setActiveItem(1);

                                        }
                                    }
                                }
                            ]
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
                    }
                },
                {
                    xtype: 'grid',

                    title: 'Geospatial Information',
                    titleAlign: 'center',

                    userCls: 'map-panel',

                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            layout: {
                                type: 'hbox',
                                align: 'right'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Back',
                                    handler: function () {
                                        const grid = this.up('grid');
                                        const cardContainer = grid.up('container');

                                        cardContainer.getLayout().setActiveItem(0);
                                    }
                                }
                            ]
                        }
                    ],

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
        const gridContainerLayout = this.getRefItems()[1].getLayout();

        // TODO: This should only happen when in the second card
        gridContainerLayout.setActiveItem(0);

        // Get the clicked coordinates
        const pixel = params.pixel;
        const coord = params.coords;

        // Set the coordinates
        const coordinateFields = this.down('panel').getRefItems()[0].getRefItems();

        // Header for the Ajax requests
        const header = {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50};

        // Get every layer at the clicked pixel
        const extmap = this.mapscope.getMap();
        const olmap = this.mapscope.getOlMap();
        const olView = olmap.getView();
        const olResolution = olView.getResolution();
        const olProjection = olView.getProjection();

        const projectionCode = parseInt(olProjection.getCode().split(':')[1]);

        const lonLatCoords = (projectionCode === 4326) ? projectionCode : extmap.transformCoordinates(coord, projectionCode, 4326);

        // In lon, lat
        coordinateFields[1].setValue(lonLatCoords[0].toFixed(6));
        coordinateFields[2].setValue(lonLatCoords[1].toFixed(6));

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

        const statusBar = this.down('progressbar');
        const totalRequests = nRequests;

        statusBar.setValue(0.0);

        if (ajaxRequests.length === 0) {
            statusBar.setValue(1.0);

            return;
        }

        // For each prepared Ajax request
        ajaxRequests.forEach(function (request) {

            const url = request.url; // Geoserver url
            const layername = request.layername; // Name of the layer intersected
            const visibleId = request.visibleId; // Human id
            const visibleColumns = (request.visibleColumns) ? request.visibleColumns.split(',') : null; // Visible fields

            // Execute the Ajax request
            Ext.Ajax.request({
                url: url,

                callback: function (req, success, response, opts) {

                    if (success) {
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
                        statusBar.setValue(1.0);

                        me.updateFeatureCount(layersData.length); // update the total features retrieved
                        me.down('grid').getStore().loadData(layersData); // Load the first grid
                    } else {
                        statusBar.setValue(statusBar.getValue() + 1.0 / totalRequests);
                    }
                }
            });
        });
    },

    updateFeatureCount: function (count) {
        const featureCount = this.down('panel').getRefItems()[1];

        featureCount.setValue(count);

    },

    onToggleTool: function (scope, state) {

        console.log("TOggle")

    }
});