# GeoXMap

GeoXMap is an ExtJs library that provides a simple way to create geospatial maps, overlayed with a set of tools.
Tools are created in the declarative json style that ExtJs uses to create its components and completely isolated from 
the map API. At the moment, GeoExt is used to bridge ExtJs with Openlayers. However, we plan to extent the variety of 
map API's in future releases.

## Dependencies

- [ExtJs (v6.2.0)]()
- [OpenLayers](https://openlayers.org/download/) 
- [GeoExt3](https://github.com/geoext/geoext3) 

## Setup

After adding the required dependencies for this library, clone this repository to your 3rd party folder:

```
git clone https://github.com/ntma/GeoXMap.git
```

And add the source path to the `app.json` configuration:

```json
"classpath": [
    "app",
    "${toolkit.name}/src",
    "./GeoXMap/${toolkit.name}"
]
```

## How to use

To create a new map using this library just declare:
```json
{
    xtype: 'geoxfullmap'
}
```

This will create a simple GeoExt map without any functionality other than what GeoExt offers.
To overlay the geotools to this map: 
```json
{
    xtype: 'geoxfullmap',
    tools: {
      left: [], // west tools
      right: [], // east tools
      top: [], // south tools
      down: [] // north tools
    }
}
```

Each tool is separated and wrapped by 4 separate containers, each placed on each end of the map (left, right, etc.). 
The following list of `xtype`'s shows a set of default tools already available to used:

- geo_zoomin - Zoom in;
- geo_zoomout - Zoom out;
- geo_extent - Reset extent;
- geo_load - Load/Reload all layers;
- geo_remove - Remove all layers;
- geo_query - Query point (requires a geoserver);
- geo_distance - Measure distance;
- geo_area - Measure area;
- geo_goto - Go to coordinates;
- geo_layers - Open/Close layers panel;

### Custom tools 

Aside from the default tools, developers can create custom tools. We advise using one of the following templates 
when doing so. These templates communicate with the map component through the `mapscope` variable. The map component itself 
has a `getMap()` and `getOlMap()` which returns a reference to the GeoExt component and OpenLayers map respectively. This 
way, every interaction between the custom tool and the map API is possible.

##### CButton - For tools that open a context window;
```json
{
    xtype: 'geo_ctxbtn',
    params: {
        ctxtype: '', // xtype to the component to show inside the context,
        position: 'anchor', // 'anchor' or 'centered
    }
}
```
##### PButton - For tools that require activation/deactivation.
```json
{
  // Will be bound to 'maptools' group. When pressed,
  // any toggable tool bound to this groupd will be untoggled
  xtype: 'geo_togglebtn'
}
```

##### MButton - For tools that control the MasterDetail panel content;
```json
{
  xtype: 'geo_detailbtn',
  params: {
    xtype: '' // Content to show in the master detail panel
  }
}
```

When using the template, a slidable component will be bound to the map. This component allows users to display 
denser map data that does not fit into the context windows. 


### Styling default tools

At the moment, styling options are limited to changing the map colors. More options will come soon.

```json
{
    xtype: 'geoxfullmap',
    tools: {
      ...
    },
    css: {
      colors: {
        base: '#454140', // Base map color
        hover: '#a79e84', // Tool hover color
        pressed: '#587e76' // Toggled tool color
      }
    }
}
```

### Styling custom tools

To style custom tools we prepared several CSS classes specific to certain ExtJs components. These classes are only used
to standardize the map colors.

- map-btn - map tools/buttons
- map-panel - extjs panels 
- map-window - extjs windows
