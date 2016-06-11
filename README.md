# jQuery Mapael - Dynamic vector maps

[![Build Status](https://travis-ci.org/neveldo/jQuery-Mapael.svg?branch=master)](https://travis-ci.org/neveldo/jQuery-Mapael)

The complete documentation is available on [Mapael website](http://www.vincentbroute.fr/mapael) (repository:  ['neveldo/mapael-documentation'](https://github.com/neveldo/mapael-documentation)).

Additional maps are stored in the repository ['neveldo/mapael-maps'](https://github.com/neveldo/mapael-maps).

The documentation of Raphael.js is available [here](http://dmitrybaranovskiy.github.io/raphael/reference.html) ([mirror](http://www.vincentbroute.fr/mapael/raphael-js-documentation/)).

## Overview

jQuery Mapael is a [jQuery](http://jquery.com/) plugin based on [raphael.js](http://raphaeljs.com/) that allows you to display dynamic vector maps.  

For example, with Mapael, you can display a map of the world with clickable countries. You can also build simple dataviz by setting some parameters in order to automatically set a color depending on a value to each area of your map and display the associated legend. Moreover, you can plot cities on the map with circles, squares or images by their latitude and longitude. Many more options are available, read the documentation in order to get a complete overview of mapael abilities.

Mapael supports all modern browsers and Internet Explorer 9+. For older versions of IE, you can load jQuery 1.11.x and Raphael.js 2.1.2 as dependencies, most of the jQuery Mapael features should work fine.

![Dataviz example](http://www.vincentbroute.fr/mapael/assets/img/world-example.png)
[See this example !](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/dataviz_example.html)

## Key features

*   based on **jQuery and raphael.js**. And optionnaly based on jQuery mousewheel for the zoom on mousewheel feature.
*   **Interactive.** Set href, tooltip, add events and many more on the elements of your map.
*   **Plottable cities**  Cities can be plotted on the map with circles, squares, images or SVG paths by their latitude and longitude
*   **Areas and plotted points colorization with legends.** Mapael automatically sets attributes like color and size to each area and plotted point displayed on map and generates an interactive legend in order to build pretty dataviz
*   **Links between cities.** You can draw links between the cities of the map.
*   **Easy to add new maps.** Build your own maps based on SVG paths
*   **SEO-friendly.** An alternative content can be set for non-JS users and web crawlers
*   **Resizable** Maps are easily resizable.
*   **Zoom** Zoom and panning abilities (also on mobile devices).

## Basic code example

Here is the simplest example that shows how to display an empty map of the world :

**HTML :**

    <div class="container">
        <div class="map">Alternative content</div>
    </div>

**JS :**

    $(".container").mapael({
        map : {
            name : "world_countries"
        }
    });

## Examples

**Basic**

*   [Minimal example](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/minimal_example.html)
*   [Map with some custom plotted cities and areas](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/plotted_cities_areas.html)
*   [Map with zoom-in, zoom-out, zoom-reset buttons and zoom on mousewheel feature](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/zoom_features.html)
*   [Map with a legend for areas](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/legend_areas.html)
*   [Map with a legend for plotted cities](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/legend_plotted_cities.html)
*   [Map with a legend where slices are specified with a fixed value instead of min and max values](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/legend_slices_fixed_values.html)
*   [Map with a legend for images](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/legend_images.html)
*   [Map with SVG paths defined through the legend to plot some cities](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/legend_SVG_paths.html)
*   [Map with a legend for areas (only one item from the legend activated at a time.html)](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/legend_areas_one_item_activated_at_a_time.html)
*   [Map with a legend for plotted cities and areas](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/legend_plotted_cities_areas.html)
*   [Use legendSpecificAttrs option to apply specific attributes to the legend elements](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/legendSpecificAttrs_option.html)
*   [Map with an horizontal legend for plotted cities and areas](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/horizontal_legend.html)
*   [Map with href on areas and plotted cities](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/href_areas_plotted_cities.html)
*   [Multiple projection example (Equirectangular, Mercator and Miller.html)](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/basic/multiple_projections.html)

**Advanced**

*   [Map with links between the plotted cities](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/links_between_plotted_cities.html)
*   [Map with some updates on links performed](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/updates_on_links_performed.html)
*   [Map with multiple plotted cities legends that handle different criteria](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/multiple_legends_plotted_cities.html)
*   [Trigger an 'update' event for refreshing elements](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/update_event_for_refreshing_elements.html)
*   [Use the 'eventHandlers' option and the 'update' event for refreshing areas when the user click on them](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/eventHandlers_option_and_update_event_refresh_onclick.html)
*   [Use 'zoom' event in order to zoom on specific areas of the map](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/zoom_event_on_specific_area.html)
*   [Use 'zoom.init' option in order to set an initial zoom level on a specific position](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/initial_zoom_level_on_a_specific_position.html)
*   [Use 'afterInit' option to extend the Raphael paper](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/afterInit_extend_raphael_paper.html)
*   [Use the 'eventHandlers' option to display information about plotted cities in a div on mouseover](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/eventHandlers_display_information_about_plotted_cities.html)
*   [Dataviz example : population of countries and cities by year](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/dataviz_example.html)
*   [Importing data from JSON (French railway station for passengers.html)](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/import_from_json.html)
*   [Show or hide the legends through the 'update' event and the 'setLegendElemsState' option.](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/legend_show_hide.html)
*   [Multiple instances of Mapael on the same page with overriden default options](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/multiple_instances.html)
*   [Map with a range selection for areas](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/range_selection_areas.html)
*   [Map with a range selection for plotted cities](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/range_selection_plotted_cities.html)
*   [Zoom on click example](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/zoom_on_click.html)
*   [Map with some transformations performed on SVG plotted points](https://rawgit.com/neveldo/jQuery-Mapael/master/examples/advanced/transformations_on_svg_plots.html)

## License

Copyright (C) 2013-2016 [Vincent Brouté](http://www.vincentbroute.fr)

jQuery Mapael is licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
