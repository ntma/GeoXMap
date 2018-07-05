Ext.define('GeoXMap.tools.controls.ZoomIn', {
    extend: 'Ext.button.Button',
    xtype: 'geo_zoomin',

    iconCls: 'fa fa-plus',

    listeners: {
        click: function(){
            const map = this.mapscope.getMap();
            const view = map.getView();
            const delta = 1;
            if (!view) {
                // the map does not have a view, so we can't act
                // upon it
                return;
            }
            const currentResolution = view.getResolution();
            if (currentResolution) {
                const newResolution = view.constrainResolution(currentResolution, delta);
                // if (this.duration_ > 0) {
                //     if (view.getAnimating()) {
                //         view.cancelAnimations();
                //     }
                //     view.animate({
                //         resolution: newResolution,
                //         duration: this.duration_,
                //         easing: ol.easing.easeOut
                //     });
                // } else {
                    view.setResolution(newResolution);
                // }
            }
        }
    }
});