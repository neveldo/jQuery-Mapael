# Upgrading Mapael

## From 1.1.0 to 2.0.0

### A. Change your `update` event trigger ([#105](https://github.com/neveldo/jQuery-Mapael/issues/105))
The `update` event has a new signature.
It now accepts a single object containing all the options.

`opt.resetPlots` and `opt.resetAreas` were removed in favor of a new `options.replaceOptions`

**Old signature:**
```javascript
var updatedOptions = {};
var newPlots = {};
var deletedPlots = [];
var opt = {
    animDuration: 0,
    resetPlots: false,
    resetAreas: false,
    afterUpdate: function(){},
    newLinks: {}
    deletedLinks: []
};
$(".container").trigger('update', [updatedOptions, newPlots, deletedPlots, opt]);
```
**New signature:**
```javascript
var options = {
  mapOptions: {},             // was updatedOptions
  replaceOptions: false       // replace opt.resetPlots/resetAreas: whether mapsOptions should entirely replace current map options, or just extend it,
  newPlots: {},               // was newPlots
  newLinks: {},               // was opt.newLinks
  deletePlotKeys: [],         // was deletedPlots
  deleteLinkKeys: [],         // was opt.deletedLinks
  setLegendElemsState: true,  // is new
  animDuration: 0,            // was opt.animDuration
  afterUpdate: function(){}   // was opt.afterUpdate
};
$(".container").trigger('update', [options]);
```

### B. Behavior modification for legend slices ([#84](https://github.com/neveldo/jQuery-Mapael/issues/84))
The behavior has changed regarding the slices `max` value for legends: it is now inclusive like the `min` value.

**Old behavior:**
```
slices[].min <= value < slices[].max
```

**New behavior:**
```
slices[].min <= value <= slices[].max
```

### C. New architecture ([#117](https://github.com/neveldo/jQuery-Mapael/issues/117))
Mapael version 2.0.0 introduces a new architecture.

**Before**, the *unique* Mapael object was stored directly inside `$.fn.mapael` and accessible here.
The current Mapael instance of each map was not accessible.

**After**, you have:
- in `$.mapael`: the Mapael *prototype* (this is *not* an instance of mapael, this is only the prototype)
- in `$.fn.mapael`: the DOM attachment method (this is only a wrapper to attach mapael to the element by creating a mapael instance).
- in each DOM container data: the current instance of Mapael (accessible through `$(".mapcontainer").data("mapael")`)

These internal changes have some external impacts:

#### C.1. For your maps: extend `$.mapael` instead of `$.fn.mapael`
Extending `$.fn.mapael` is deprecated as of Mapael version 2.0.0 and support will be removed in future version.

A warning message is logged in the console at runtime for maps extending `$.fn.mapael`.

The best way would be to update your map in the [mapael-maps repository](https://github.com/neveldo/mapael-maps).

#### C.2. New way to override the default behavior
Basically, you need to modify the prototype inside `$.mapael` instead of the old `$.fn.mapael`.

**Before:**
- override the default options: `$.fn.mapael.defaultOptions = {}`
- override a method: `$.fn.mapael.tooltip = function() {}`

**After:**
- override the default options: `$.mapael.prototype.defaultOptions = {...}`
- override a method: `$.mapael.prototype.setTooltip = function(...) {...}`

Additional note: use `$.mapael.prototype.setTooltip.call(this, ...)` to call original behavior.

### D. New Zoom buttons functionnality ([#166](https://github.com/neveldo/jQuery-Mapael/issues/166))
The zoom buttons are more curstomizable! Also, a reset buttons is now available by default.

**Old options:**
```javascript 
zoom: {
    enabled: false,
    maxLevel: 10,
    step: 0.25,
    mousewheel: true,
    /* Old options */
    zoomIncssClass: "zoomIn",
    zoomOutcssClass: "zoomOut",
    /* - */
    touch: true,
    animDuration: 200,
    animEasing: "linear"
}
```

**New options:**
```javascript 
zoom: {
    enabled: false,
    maxLevel: 10,
    step: 0.25,
    mousewheel: true,
    touch: true,
    animDuration: 200,
    animEasing: "linear",
    /* New options */
    buttons: {
        "reset": {
            cssClass: "zoomButton zoomReset",
            content: "&#8226;", // bullet sign
            title: "Reset zoom"
        },
        "in": {
            cssClass: "zoomButton zoomIn",
            content: "+",
            title: "Zoom in"
        },
        "out": {
            cssClass: "zoomButton zoomOut",
            content: "&#8722;", // minus sign
            title: "Zoom out"
        }
    }
}
```

### E. Updated the CSS position of the tooltip

In the CSS file related to mapael maps, the tooltip position should now be 'absolute' instead of 'fixed'. 

**Old style:**
```css
.mapael .mapTooltip {
    position: fixed;
}
```
**New style:**
```css
.mapael .mapTooltip {
    position: absolute;
}
```