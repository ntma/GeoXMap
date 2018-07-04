Ext.define('GeoXMap.tools.components.PointInfo', {
    extend: 'Ext.panel.Panel',

    xtype: 'pointinfo',

    defaults: {
        margin: 10
    },

    items: [
        {
            xtype: 'panel',
            userCls: 'map-panel',
            title: 'Coordinates',
            constrainHeader: true,

            layout: {

                type: 'vbox',
                align: 'center'
            },

            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Lon',
                    editable: false
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Lat',
                    labelPad: null,
                    editable: false
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Geospatial Information',
            userCls: 'map-panel',

            items: [
                //TODO: This info display
            ]
        }
    ],

    onOpenWindow: function(params){
        const coordinatesPanel = this.getRefItems()[0];

        const coordinateFields = coordinatesPanel.getRefItems();

        const idx = (coordinateFields.length > 2) ? 1 : 0;

        const lon = coordinateFields[idx];
        const lat = coordinateFields[idx + 1];

        lon.setValue(params.coords[0]);
        lat.setValue(params.coords[1]);

    }
});