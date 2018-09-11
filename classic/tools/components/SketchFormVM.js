Ext.define('GeoXMap.tools.components.SketchFormVM', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.geo_sketchform',

    data: {
        selectedGeom: false,
        color: 'a16161',
        geometry: 'LineString',
        thickness: 5
    }

});