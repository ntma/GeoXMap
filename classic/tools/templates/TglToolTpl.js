Ext.define('GeoXMap.tools.templates.TglToolTpl', {
    extend: 'Ext.button.Button',

    xtype: 'geo_tgltooltpl',

    enableToggle: true,

    toggleGroup: 'maptools',

    listeners: {
        toggle: function (btn, pressed) {

            // if(pressed){
            //     console.log("Toggle activated");
            // } else {
            //     console.log("Toggle deactivated");
            // }
        }
    }
});