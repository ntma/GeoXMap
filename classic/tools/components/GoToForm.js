Ext.define('GeoXMap.tools.components.GoToForm', {
    extend: 'Ext.panel.Panel',

    xtype: 'gotoform',

    requires: [
        'GeoXMap.tools.components.GoToFormCtrl'
    ],

    controller: 'gotoform',

    // ui: 'map-panel-profile1',

    layout: 'vbox',

    /**
     * Cancel/Accept options
     */
    dockedItems: [
        {
            xtype: 'container',
            dock: 'right',
            items: [
                {
                    xtype: 'button',
                    reference:'cancel',
                    // ui: 'map-tool-profile1',
                    iconCls: 'fa fa-times',
                    handler: 'onCancel'
                },
                {
                    xtype: 'button',
                    reference: 'accept',
                    // ui: 'map-tool-profile1',
                    iconCls: 'fa fa-check',
                    handler: 'onAccept'
                }
            ]
        }
    ],

    items: [
        /**
         * Input coordinates
         */
        {
            xtype: 'textfield',
            reference: 'coordinates',
            emptyText: 'Input Coordinates',
            width: '100%',
            margin: 0,

            // invalidText: 'Format: Lon,Lat | [Lon, Lat]',
            validateOnBlur: true,
            validator: function(val){
                console.log(val)

                const match = val.match(/[+-]?\d+(?:\.\d+)?/g);

                if(match){
                    const parsedCoords = match.map(Number);

                    return parsedCoords.length === 2;
                } else {
                    return false;
                }
            }
        },

        /**
         * Input EPSG
         */
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'textfield',
                    reference: 'toepsg',
                    emptyText: 'From EPSG',

                    validateOnBlur: true,
                    validator: function (val) {
                        return Number.isInteger(parseInt(val))
                    }
                },
                {
                    xtype: 'button',
                    disabled: true,
                    // ui: 'map-tool-profile1',
                    iconCls: 'fa fa-arrow-right'
                },
                {
                    xtype: 'textfield',
                    reference: 'fromepsg',
                    emptyText: 'To EPSG',

                    validateOnBlur: true,
                    validator: function (val) {
                        return Number.isInteger(parseInt(val))
                    }
                }
            ]
        }
    ]
});