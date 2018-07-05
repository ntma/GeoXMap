Ext.define('GeoXMap.tools.templates.PButton', {
    extend: 'Ext.button.Button',

    xtype: 'geo_togglebtn',

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