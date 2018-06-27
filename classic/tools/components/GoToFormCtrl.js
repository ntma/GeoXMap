Ext.define('GeoXMap.tools.components.GoToFormCtrl', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.gotoform',

    onCancel: function(){
        this.getView().hide();
    },

    onAccept: function(){
        const coords = this.lookupReference('coordinates'),
            toEpsg = this.lookupReference('toepsg'),
            fromEpsg = this.lookupReference('fromepsg');

        if(coords.validate() && fromEpsg.validate() && toEpsg.validate()){
            const view = this.getView();
            const parsedCoords = coords.getValue().match(/[+-]?\d+(?:\.\d+)?/g).map(Number),
                parsedToEpsg = parseInt(toEpsg.getValue()),
                parsedFromEpsg = parseInt(fromEpsg.getValue());

            const map = view.getMapScope().getMap();

            const position = map.transformCoordinates(parsedCoords, parsedFromEpsg, parsedToEpsg);

            map.navigateToPoint(position);

            view.hide();
        } else {
            // Do nothing
        }
    },

    onShow: function(){
        const map = this.getView().getMapScope().getMap();

        const projectionCode = map.getProjectionCode();

        if(projectionCode){
            this.lookupReference('toepsg').setValue(projectionCode);
        }
    }
});