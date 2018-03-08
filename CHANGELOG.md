# ChangeLog
Change log for jQuery-Mapael

## 2.2.0 - March 8, 2018

- **Feature :** Added the ability to zoom on a specific plot or a specific area through the `zoom` event ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/32eb4d939fdb6b4c5ed3d967f1f8e58b51845bce))
- **Feature :** The cssClass option can now be updated when trigerring an 'update' event ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/40d569619655942481c6811e))
- **Feature :** Added links to the parameter of the `afterUpdate` hook ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/105cea82dfe6434f52fc6cc1f0e7214e04c7cbec))
- **Performance :** Optimised overall Zoom performances ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/4c39bba72c2d63fd30ef1dc0a67e408ac2dbd430))
- **Performance:** use event delegation ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/5c669155fe064be165b3f93c45c2553c723d031c))
- **Improvement :** Provide a better version of the map of the World ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/7e413999e3e151921e94522ae86dd9259b382eb0))
- **Improvement :** Better dependencies / installation instructions ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/28d08fe42a7846d31bf25d3f2fd028c728737fd4))
- **Improvement :** Mapael version is now accessible through $.mapael.version ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/da039772e811d32444b7f913de15997d89954fea))
- **Bugfix :** Fixed behaviour of the 'clicked' legend option with plots ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/a74e84de266a5c83c9c8aa95419be453fa5c7ad6))
- **Bugfix :** Fixed the update event when plotsOn option used ([Licht-T & Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/c86809aa91156c40185aab861e1e9ccfd465b3e0))

## 2.1.0 - March 13, 2017

- Feature : Allow to add custom CSS class to areas, plotted points and links ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/78de6aa1804b49bec93aa6743a8a061f82d742e6))
- Bugfix : Fix load for CommonJS ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/a83bd3a11e635ed9ffe99c070edb275f5c2cc9e4))
- Bugfix : Restaure 'mousewheel' event propagation ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/ff74f9b4961d3af1513c7d7f689b36ca60751dd9))
- Bugfix : Fix elements hidding through clicks on legend items when some values are straddling two different slices in hideMapElems() function ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/7f38564085eed2445ccecf30bbf7d267984de0cf))
- Bugfix : Prevent to move the clicked element instead of dragging the map (behaviour seen with Firefox) ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/c4efaae922fb901b4f5180b3e6d7fc212939665d))
- Bugfix : Fix destroy() in order to empty map and legends containers instead of the main container ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/d66b11c02d858a4ae2661766833181daadd95f6d))
- Feature : Add toFront option available on area/plot/link options when triggering ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/5b4ace8f602ea911b0513a5e601ace04cd851a27))
- Feature : Add redrawOnResize option ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/292a5b4c428db028b409d7956587797296de9ca1))
- Improve updateElem() performance ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/a2923c97c261bdad5399730b64cf623d9f71cb56))
- Bugfix : Fix namespaces for events bindings ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/ae9e200591cbbe5e41ea449f4bc9214bfdcd4a79))
- Feature : Added plotsOn option to add points on areas' centers ([Licht-T](https://github.com/neveldo/jQuery-Mapael/commit/898784514b124547e898e5bbf0d2374f0fb4dff0))
- Bugfix : Fix Western Sahara's code in world map ([dragoscirjan](https://github.com/neveldo/jQuery-Mapael/commit/3a329b590d2274b71ef131cc2370a3330a5e93b7))

## 2.0.0 - June 12, 2016

- Feature : Update jQuery to v3.0.0 and Raphael.js to v2.2.0 (neveldo)
- Feature : Add tooltip.offset.left and tooltip.offset.top options to set a custom offset between the cursor and the tooltip ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/e01e1aae53854ee61946658adbe489e1202bd4ab))
- Bugfix : Prevent from updating unneeded areas, plots and links in the 'update' event ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/e9195136dad543036884578a51fc346863e92042))
- Feature : Allow transformations on SVG plotted points ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/cadd617e9a4ebd9b319a261849850027fbbb5670))
- Bugfix : Fix updateElem() function for SVG elements (bbox object undefined) ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/b374f196956c70e0f2868c2ab1d8b965e864016f))
- Feature : Add new minLevel option ([billyrennekamp](https://github.com/neveldo/jQuery-Mapael/commit/0f8b4e8f5a1c3cf4508d438cdc487835a9ac2046))
- Bugfix : Fix the flicker on mouseover between text and area ([billyrennekamp](https://github.com/neveldo/jQuery-Mapael/commit/826a340631b9459630205b684b31594e7c829875))
- Feature : margin option now accept an object in order to fine tune x and y offset of text position ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/06a4a0f49bdf44916ecf4f0f1846322611c07508))
- Bugfix : initElem : setHover only if attrsHover set ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/4a8d1e015d7d502d5ab45589306a470dc9b05602))
- Feature : Allow zoom trigger with no level set ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/02f04ac2cdcfd8f78e2723edcc33694d2a85139d))
- Feature : Relative zoom for onZoom ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/b17da7e75446c60cb31a258a8c8e3d74c2573eb5))
- Misc : Add Mercator and Miller world map ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/e1657c047fbab109591ec80aa880d61ccfcbf411))
- Feature : Legends are redrawn on resize ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/37e98a7dca5d17ce92cb2b6555bca7ffd5f9884c))
- Feature : Expand zoom buttons functionality ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/45f7407a7358f990de54f1bb050459c7a4995420))
- Feature : Add checkForRaphaelBBoxBug() function in order to check for a known bug from Raphael.js when creating a paper in an hidden container ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/e5d32cdbaf91a5b22ce582de54fc0112903f1ddc))
- Feature : Add 'showElementsInRange' event to filter the elements to show on the map depending on values intervals ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/a634d2d731a070b0369f4d7cd55109c05c8ac579))
- Refactoring : Move default options inside prototype to allow overriding ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/c17c0de61a90581e1a88aace64fd2b97fbcb1bb1))
- Refactoring : Refactored internal structure of the plugin (Indigo744)
- Misc : Add many new code examples (Indigo744)
- Misc : Add unit tests (Indigo744)
- Refactoring : Provide new update event signature ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/3ad903b8e38bcc7dd5e3d368f07c1d379a0e19d4))
- Bugfix : Fix leaking when removing plots/links ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/2c9aa9bdbec554286c3f69d8b194bac3a23b5602))
- Feature : tooltip.content accept function ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/489cad8f93fc1d328a6e76d5d0fd824af6eec00d))
- Bugfix : handleClickOnLegendElem take into account other legends ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/23419ccbc522b497831478a2f827819460e1b6fd))
- Bugfix : Set default size when no size is set on slices ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/2f4fa5c6dddacf52cb1308ae261e94239791fceb))
- Bugfix : Fix target for zoom related events 'mousewheel', 'touchstart' and 'touchmove' ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/b3f8ab04ed76c13aa0c3dc97dff582e612ebb503))
- Feature : Delete all plots/links in 'update' event ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/822a1caa322c5c0e422447e204b7624c5e3e1885))
- Refactoring : Set legend slice max value inclusive ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/68f95555858bfc9e3afcea96d95d00c3d573e34b))
- Bugfix : hide/show elements only on current map ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/dc1994c0c92e14e6a1356dfb514b051acbdc7067))
- Feature : Allow to update legend in the update event ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/191149446d0fe3cb34910ef44e430ed960b6b08e))
- Feature : Add AMD and CommonJS compatibility to mapael and mapel maps ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/56f941f5ce03254a4cb65963860a9868a6813da9))
- Feature : Add animDuration option to 'zoom' event and set it to 0 by default for initial zoom ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/bbcecae471e31c1b37aa62d7ed83842550837ae6))
- Refactoring : Remove map.tooltip.target option ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/f1e8758b91504f399392e4af390ed020ad935bdf))
- Feature : Add tooltip.overflow.right and tooltip.overflow.bottom options to allow tooltip overflow from the container ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/476fbbad7a23f622bc49e80f6be47413f585cf31))
- Bugfix : Fix raphael.safari() call with laster version of Raphael.js ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/f458ea8af781a57d6d3b77e1dd6b52bbfb8332ed))
- Bugfix : Fix legend display when no title is defined ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/3d8200706548a9bbd0710d3dd6829d767c7d2ffc))
- Refactoring : Tooltip position is computed as absolute instead of Fix ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/7907701a46ae7a270d68a7f6ac9c9be96d95f8df))
- Bugfix : Fix IE8 js error on map update ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/44798289cc28ff5150e3f94dbe11c02b5d0bc33c))
- Feature : Add legend.(area|plot).hideElemsOnClick.animDuration option ([Indigo744](https://github.com/neveldo/jQuery-Mapael/commit/52eef6549b70ea09d982ccfc78a5b8f6ea944d8a))
- Bugfix : Fix current zoomX and zommY values set in container’ data. ([neveldo](https://github.com/neveldo/jQuery-Mapael/commit/438858423f5eb816124d9171806030f6be1261a7))

## 1.1.0 - August 31, 2015
Minor version release.

### New features
- Add support for animated zoom through the new option map.zoom.animDuration (200 by default, set to 0 in order to disable it). The option map.zoom.animEasing allows to set the easing function to animate the zoom action
- Panning is now allowed through touch event (it can be disabled through the option map.zoom.touch)
- Zooming is now allowed through pinch touch event (it can also be disabled through the option map.zoom.touch)
- In addition to 'circle', 'square' and 'image' plotted point types, the new 'svg' type allows to add SVG paths on the map
- Links can now be updated through the 'update' event : they can be edited or deleted and new links can be Add to the map
- New legend.exclusive option allows the user to activate only one item from the legend at a time
- New ‘clicked’ option in order to initialize the legend item in the 'clicked' state on the map load
- Add hook 'beforeInit' hook that is called right after the initialization of the areas
- New map.tooltip.target option allows to specify a container where to append the tooltip div
- The new option 'cssClass' allows to set additional CSS class(es) the tooltip for a specific area or a plotted point
- Add events afterZoom and ‘afterPanning’

### Bugfixes & other
- Upgrade Raphael.js dependency to v2.1.4
- Fix horizontal legend display with squares
- Fix tooltip position

## 1.0.1 - May 17, 2015
Bugfix version release.
- Fix undeclared variable in drawLegend function. IE >10 wasn't able to display the map legend.

## 1.0.0 - January 4, 2015
Major version release with breaking change.
### New features
- You can now add curved links between two cities, between two points defined by a latitude and a longitude, or between two points defined by a x and y coordinates
- jQuery Mapael now handles multiple criteria legends. Each point or each area can be associated with one or several values
- You can use non-vector images in order to plot locations on your map.Moreover, non-vector images can be used in the legends
- The legend can be displayed horizontally or vertically
- The jQuery mousewheel is now fully integrated with jQuery mapael and zoom on mousewheel features have been improved. Zoom is now focused on the cursor position
- The target of each link on the map can be specified
- You can define each slice of a legend with a single value or with a minimum and a maximum values
- You can display a map with an initial zoom level that is focused on a particular location
- Dependencies are now included through Bower packages manager.
- Mapael allows users to set specific attributes for the elements in the legend independently from the attributes for the matching elements on the map
- A new tutorial that explain how to create a map for jQuery Mapael is now available. It comes with some useful online tools.

### Breaking changes 
Here are the changes that are not compatible with the 0.7.1:
- If you have overloaded $.fn.mapael.defaultOptions, note that the default Mapael options (previously stored in $.fn.mapael.defaultOptions) are now stored in two different variables : $.fn.mapael.defaultOptions and $.fn.mapael.legendDefaultOptions . The last one is specific to legends options.
- Legends 'display' option is now set to true by default instead of false

## 0.7.1 - January 23, 2014
Bugfix version release:
- Fix legend colorisation with zero values in slices definition
- Don't animate areas and plots in the legend on mouse hover
- afterUpdate call : Fix undefined opt

## 0.7.0 - November 17, 2013
### Improvements
- Improve zooming feature. You can now trigger a 'zoom' event on the container (required parameter : level, optional parameters : x, y in order to zoom on a specific area). The current zoom level is now stored as data. Example of use : http://jsfiddle.net/neveldo/RahvT/
- Add two new hooks in order to allow custom processing on map initialization and map update ('update' event) : afterInit and afterUpdate. Here is an example with the afterInit() hook : http://jsfiddle.net/neveldo/8Ke69/
- Add labelAttrsHover option for the plots and areas legend that allows to customize the attributes of the labels in the legend on mouse hover.
- prevent the tooltip to overflow from the container
- 'update' event' now allows to update attrsHover for plots and area (bugfix)

## 0.6.0 - September 29, 2013

### Improvements
- Add missing Michigan state on the USA map
- New map of France with equirectangular projection for better cities location
- Upgrade to version 2.1.2 of Raphael.js
- Truely hide the elements when user clicks on the legend and hideElems.OnClick.opacity is set to 0
- Squares and circles in the legend take account the scale of the map in order to draw them at the same scale
- Newattribute 'data-id' Add to plots and areas's nodes
- New option 'display' that allows to display or hide a specific element from the legend
- Improve event handling (with the new option 'eventHandlers'). You can now attach handlers to all events from jQuery.
- Improve 'update' event that now allows to add or delete plot from the map, update text attributes (content, position, ...) and the contents of the tooltips
- New option text.margin that allows to customize the margin between the plot and its associated label
- Miscellaneous bug fixes

### Incompatible changes with 0.5.1
- Event handlers for plots and areas (previously set by options 'onclick', 'onmouseover' and 'onmouseout') now have to be defined with the option 'eventHandlers'. It contains the list of handlers (function(e, id, mapElem, textElem) { ...}) that will be called when events occur on elements. The key must match the event name (example : 'click', 'dblclick', ...). See documentation and examples for more information.
- Parameters for the update event are now the followings : updatedOptions, newPlots, deletedPlots, and opt. Example : $(".container").trigger('update', [updatedOptions, newPlots, deletedPlots, opt]);. See documentation and examples for more information.
- The options for the texts (previously text, textAttrs, textHoverAttrs and textPosition) are now the followings : text.content, text.attrs, text.attrsHover and text.position. See documentation and examples for more information.

## 0.5.1 - August 24, 2013
Fourth version

## 0.4.0 - July 29, 2013
Third version

## 0.3.0 - July 15, 2013
Second version

## 0.2.2 - July 2, 2013
First version
