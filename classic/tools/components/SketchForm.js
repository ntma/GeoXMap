Ext.define('GeoXMap.tools.components.SketchForm', {
    extend: 'GeoXMap.tools.base.ContextWindow',

    xtype: 'geo_sketchform',

    requires: [
        'Ext.ux.colorpick.Field',
        'GeoXMap.tools.components.SketchFormCtrl',
        'GeoXMap.tools.components.SketchFormVM'
    ],

    controller: 'geo_sketchform',

    viewModel: {
        type: 'geo_sketchform'
    },

    // ui: 'map-panel-profile1',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: 10,

    items: [
        {
            xtype: 'combobox',

            fieldLabel: 'Geometry',

            editable: false,

            displayField: 'text',
            valueField: 'value',

            bind: {
                value: '{geometry}'
            },

            store: Ext.create('Ext.data.Store', {
                fields: ['text', 'value'],
                data : [
                    {
                        text: 'Point',
                        value: 'Point'
                    },
                    {
                        text: 'Line',
                        value: 'LineString'
                    },
                    {
                        text: 'Polygon',
                        value: 'Polygon'
                    }
                ]
            }),

            listeners: {
                change: 'onChangeGeometry'
            }

        },
        {
            xtype: 'container',

            margin: '0 0 10px 0',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'colorfield',

                    flex: 8,

                    fieldLabel: 'Color',

                    bind: {
                        value: '{color}',
                    },

                    listeners : {
                        change: 'onChangeColor'
                    }
                },
                {
                    xtype: 'button',
                    bind: {
                        style: {
                            backgroundColor: '#' + '{color}',
                            borderColor: '#' + '{color}'
                        }
                    },
                    flex: 1
                }
            ]
        },
        {
            xtype: 'combobox',

            fieldLabel: 'Thickness',

            editable: false,

            bind: {
                value: '{thickness}'
            },

            store: Ext.create('Ext.data.Store', {
                fields: ['text'],
                data : [
                    {
                        text: 2
                    },
                    {
                        text: 5
                    },
                    {
                        text: 10
                    }
                ]
            }),

            listeners: {
                change: 'onChangeThickness'
            }

        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },

            items: [
                {
                    xtype: 'button',
                    iconCls: 'fa fa-pencil',
                    flex: 1,
                    margin: '0 10px 0 0',
                    userCls: 'map-btn',
                    toggable: true,
                    toggleGroup: 'geosketch',

                    tooltip: 'Draw',

                    listeners:{
                        toggle: 'onToggleDraw'
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'fa fa-mouse-pointer',
                    flex: 1,
                    margin: '0 10px 0 0',
                    userCls: 'map-btn',
                    toggable: true,
                    toggleGroup: 'geosketch',

                    tooltip: 'Select',

                    listeners:{
                        toggle: 'onToggleSelect'
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'fa fa-times',
                    flex: 1,
                    margin: '0 10px 0 0',
                    userCls: 'map-btn',
                    bind: {
                        disabled: '{!selectedGeom}'
                    },

                    tooltip: 'Delete',

                    handler: 'onClickDelete'
                },
                {
                    xtype: 'button',
                    iconCls: 'fa fa-trash',
                    flex: 1,
                    margin: '0 10px 0 0',
                    userCls: 'map-btn',

                    tooltip: 'Delete All',

                    handler: 'onClickDeleteAll'

                }
            ]
        }
    ],

});