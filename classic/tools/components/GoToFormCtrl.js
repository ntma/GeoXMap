Ext.define('GeoXMap.tools.components.GoToFormCtrl', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.gotoform',

    onCancel: function(){
        this.getView().hideWindow();
    },

    onAccept: function(){
        console.log(this)

        const coords = this.lookupReference('coordinates'),
            toEpsg = this.lookupReference('toepsg'),
            fromEpsg = this.lookupReference('fromepsg');

        if(coords.validate() && fromEpsg.validate() && toEpsg.validate()){
            // const position = ol.proj.transform(parsedCoords, 'EPSG:' + parsedIn, 'EPSG:' + parsedOut);

            const parsedCoords = coords.getValue().match(/[+-]?\d+(?:\.\d+)?/g).map(Number),
                parsedToEpsg = parseInt(toEpsg.getValue()),
                parsedFromEpsg = parseInt(fromEpsg.getValue());

            const map = this.getView().getMapScope().getMap();

            const position = map.transformCoordinates(parsedCoords, parsedToEpsg, parsedFromEpsg);

            map.navigateToPoint(position);

            this.getView().hideWindow();
        } else {
            // Do nothing
        }
    }
});