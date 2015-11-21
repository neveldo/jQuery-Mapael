# ChangeLog
Change log for jQuery-Mapael

## 1.1.0 - 31 August 2015
Minor version release.

### New features
- Added support for animated zoom through the new option map.zoom.animDuration (200 by default, set to 0 in order to disable it). The option map.zoom.animEasing allows to set the easing function to animate the zoom action
- Panning is now allowed through touch event (it can be disabled through the option map.zoom.touch)
- Zooming is now allowed through pinch touch event (it can also be disabled through the option map.zoom.touch)
- In addition to 'circle', 'square' and 'image' plotted point types, the new 'svg' type allows to add SVG paths on the map
- Links can now be updated through the 'update' event : they can be edited or deleted and new links can be added to the map
- New legend.exclusive option allows the user to activate only one item from the legend at a time
- New ‘clicked’ option in order to initialize the legend item in the 'clicked' state on the map load
- Added hook 'beforeInit' hook that is called right after the initialization of the areas
- New map.tooltip.target option allows to specify a container where to append the tooltip div
- The new option 'cssClass' allows to set additional CSS class(es) the tooltip for a specific area or a plotted point
- Added events afterZoom and ‘afterPanning’

### Bugfixes & other
- Upgraded Raphael.js dependency to v2.1.4
- Fixed horizontal legend display with squares
- Fixed tooltip position

## 1.0.1 - 17 May 2015
Bugfix version release.
- Fixed undeclared variable in drawLegend function. IE >10 wasn't able to display the map legend.

## 1.0.0 - 4 January 2015
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

## 0.7.1 - 23 January 2014
Bugfix version release:
- Fixed legend colorisation with zero values in slices definition
- Don't animate areas and plots in the legend on mouse hover
- afterUpdate call : fixed undefined opt

## 0.7.0 - 17 November 2013
### Improvements
- Improved zooming feature. You can now trigger a 'zoom' event on the container (required parameter : level, optional parameters : x, y in order to zoom on a specific area). The current zoom level is now stored as data. Example of use : http://jsfiddle.net/neveldo/RahvT/
- Added two new hooks in order to allow custom processing on map initialization and map update ('update' event) : afterInit and afterUpdate. Here is an example with the afterInit() hook : http://jsfiddle.net/neveldo/8Ke69/
- Added labelAttrsHover option for the plots and areas legend that allows to customize the attributes of the labels in the legend on mouse hover.
- prevent the tooltip to overflow from the container
- 'update' event' now allows to update attrsHover for plots and area (bugfix)

## 0.6.0 - **29 September 2013**

### Improvements
- Added missing Michigan state on the USA map
- New map of France with equirectangular projection for better cities location
- Upgraded to version 2.1.2 of Raphael.js
- Truely hide the elements when user clicks on the legend and hideElems.OnClick.opacity is set to 0
- Squares and circles in the legend take account the scale of the map in order to draw them at the same scale
- Newattribute 'data-id' added to plots and areas's nodes
- New option 'display' that allows to display or hide a specific element from the legend
- Improved event handling (with the new option 'eventHandlers'). You can now attach handlers to all events from jQuery.
- Improved 'update' event that now allows to add or delete plot from the map, update text attributes (content, position, ...) and the contents of the tooltips
- New option text.margin that allows to customize the margin between the plot and its associated label
- Miscellaneous bug fixes

### Incompatible changes with 0.5.1
- Event handlers for plots and areas (previously set by options 'onclick', 'onmouseover' and 'onmouseout') now have to be defined with the option 'eventHandlers'. It contains the list of handlers (function(e, id, mapElem, textElem) { ...}) that will be called when events occur on elements. The key must match the event name (example : 'click', 'dblclick', ...). See documentation and examples for more information.
- Parameters for the update event are now the followings : updatedOptions, newPlots, deletedPlots, and opt. Example : $(".container").trigger('update', [updatedOptions, newPlots, deletedPlots, opt]);. See documentation and examples for more information.
- The options for the texts (previously text, textAttrs, textHoverAttrs and textPosition) are now the followings : text.content, text.attrs, text.attrsHover and text.position. See documentation and examples for more information.

## 0.5.1 - 24 August 2013
Fourth version

## 0.4.0 - 29 July 2013
Third version

## 0.3.0 - 15 July 2013
Second version

## 0.2.2 - 2 July 2013
First version
