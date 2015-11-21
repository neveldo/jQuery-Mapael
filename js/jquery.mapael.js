/*!
 *
 * Jquery Mapael - Dynamic maps jQuery plugin (based on raphael.js)
 * Requires jQuery, raphael.js and jquery.mousewheel
 *
 * Version: 1.1.0
 *
 * Copyright (c) 2015 Vincent Brouté (http://www.vincentbroute.fr/mapael)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 *
 * Thanks to Indigo744
 *
 */
(function (factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'), require('raphael'), require('mousewheel'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'raphael', 'mousewheel'], factory);
    } else {
        // Browser globals
        factory(jQuery, Raphael, jQuery.fn.mousewheel);
    }
}(function ($, Raphael, mousewheel) { // jshint ignore:line

    "use strict";
    
    var pluginName = "mapael";

    var Mapael = function(options) {

        // Extend legend default options with user options
        options = $.extend(true, {}, Mapael.defaultOptions, options);

        $.each(options.legend, function(type) {
            if ($.isArray(options.legend[type])) {
                for (var i = 0; i < options.legend[type].length; ++i)
                    options.legend[type][i] = $.extend(true, {}, Mapael.legendDefaultOptions[type], options.legend[type][i]);
            } else {
                options.legend[type] = $.extend(true, {}, Mapael.legendDefaultOptions[type], options.legend[type]);
            }
        });

        return this.each(function() {

            // Avoid multiple instanciation
            if ($.data(this, pluginName)) throw new Error("Mapael already exists on this element.");

            // Save instanciation on element
            // This allow external access to Mapael using $(".mapcontainer").data("mapael")
            $.data(this, pluginName, Mapael);

            Mapael.init(this, options);

        });
    };

    Mapael.init = function(container, options) {
            var $container = $(container) // the current element
                , $tooltip = $("<div>").addClass(options.map.tooltip.cssClass).css("display", "none") // the tooltip container
                , $map = $("." + options.map.cssClass, container).empty().append($tooltip) // the map container
                , mapConf = $.fn[pluginName].maps[options.map.name]
                , paper = new Raphael($map[0], mapConf.width, mapConf.height)
                , elemOptions = {}
                , resizeTO = 0
                , areas = {}
                , plots = {}
                , links = {}
                , zoomCenterX = 0
                , zoomCenterY = 0
                , previousPinchDist = 0;

            // add plugin class name on element
            $container.addClass(pluginName);

            if (options.map.tooltip.css) $tooltip.css(options.map.tooltip.css);
            paper.setViewBox(0, 0, mapConf.width, mapConf.height, false);

            // Draw map areas
            $.each(mapConf.elems, function(id) {
                elemOptions = Mapael.getElemOptions(
                    options.map.defaultArea
                    , (options.areas[id] ? options.areas[id] : {})
                    , options.legend.area
                );
                areas[id] = {"mapElem" : paper.path(mapConf.elems[id]).attr(elemOptions.attrs)};
            });

            // Hook that allows to add custom processing on the map
            if (options.map.beforeInit) options.map.beforeInit($container, paper, options);

            // Init map areas in a second loop (prevent texts to be hidden by map elements)
            $.each(mapConf.elems, function(id) {
                elemOptions = Mapael.getElemOptions(
                    options.map.defaultArea
                    , (options.areas[id] ? options.areas[id] : {})
                    , options.legend.area
                );
                Mapael.initElem(paper, areas[id], elemOptions, $tooltip, id);
            });

            // Draw links
            links = Mapael.drawLinksCollection(paper, options, options.links, mapConf.getCoords, $tooltip);

            // Draw plots
            $.each(options.plots, function(id) {
                plots[id] = Mapael.drawPlot(id, options, mapConf, paper, $tooltip);
            });

            /*
             * Zoom on the map at a specific level focused on specific coordinates
             * If no coordinates are specified, the zoom will be focused on the center of the map
             * options :
             *    "level" : level of the zoom between 0 and maxLevel
             *    "x" or "latitude" : x coordinate or latitude of the point to focus on
             *    "y" or "longitude" : y coordinate or longitude of the point to focus on
             *    "fixedCenter" : set to true in order to preserve the position of x,y in the canvas when zoomed
             *    "animDuration" : zoom duration
             */
            $container.on("zoom", function(e, zoomOptions) {
                var newLevel = Math.min(Math.max(zoomOptions.level, 0), options.map.zoom.maxLevel)
                    , panX = 0
                    , panY = 0
                    , previousZoomLevel = (1 + $container.data("zoomLevel") * options.map.zoom.step)
                    , zoomLevel = (1 + newLevel * options.map.zoom.step)
                    , animDuration = (typeof zoomOptions.animDuration != 'undefined') ? zoomOptions.animDuration : options.map.zoom.animDuration
                    , offsetX = 0
                    , offsetY = 0
                    , coords = {};

                if (typeof zoomOptions.latitude != "undefined" && typeof zoomOptions.longitude != "undefined") {
                    coords = mapConf.getCoords(zoomOptions.latitude, zoomOptions.longitude);
                    zoomOptions.x = coords.x;
                    zoomOptions.y = coords.y;
                }

                if (typeof zoomOptions.x == "undefined")
                    zoomOptions.x = paper._viewBox[0] + paper._viewBox[2] / 2;

                if (typeof zoomOptions.y == "undefined")
                    zoomOptions.y = (paper._viewBox[1] + paper._viewBox[3] / 2);

                if (newLevel === 0) {
                    panX = 0;
                    panY = 0;
                } else if (typeof zoomOptions.fixedCenter != 'undefined' && zoomOptions.fixedCenter === true) {
                    offsetX = $container.data("panX") + ((zoomOptions.x - $container.data("panX")) * (zoomLevel - previousZoomLevel)) / zoomLevel;
                    offsetY = $container.data("panY") + ((zoomOptions.y - $container.data("panY")) * (zoomLevel - previousZoomLevel)) / zoomLevel;

                    panX = Math.min(Math.max(0, offsetX), (mapConf.width - (mapConf.width / zoomLevel)));
                    panY = Math.min(Math.max(0, offsetY), (mapConf.height - (mapConf.height / zoomLevel)));
                } else {
                    panX = Math.min(Math.max(0, zoomOptions.x - (mapConf.width / zoomLevel)/2), (mapConf.width - (mapConf.width / zoomLevel)));
                    panY = Math.min(Math.max(0, zoomOptions.y - (mapConf.height / zoomLevel)/2), (mapConf.height - (mapConf.height / zoomLevel)));
                }

                // Update zoom level of the map
                if (zoomLevel == previousZoomLevel && panX == $container.data('panX') && panY == $container.data('panY')) return;

                if (animDuration > 0) {
                    Mapael.animateViewBox($map, paper, panX, panY, mapConf.width / zoomLevel, mapConf.height / zoomLevel, animDuration, options.map.zoom.animEasing);
                } else {
                    paper.setViewBox(panX, panY, mapConf.width / zoomLevel, mapConf.height / zoomLevel);
                    clearTimeout(Mapael.zoomTO);
                    Mapael.zoomTO = setTimeout(function(){$map.trigger("afterZoom", {x1 : panX, y1 : panY, x2 : (panX+(mapConf.width / zoomLevel)), y2 : (panY+(mapConf.height / zoomLevel))});}, 150);
                }

                $container.data({"zoomLevel" : newLevel, "panX" : panX, "panY" : panY, "zoomX" : panX + paper._viewBox[2] / 2, "zoomY" : panY + paper._viewBox[3] / 2});
            });

            if (options.map.zoom.enabled) {
            /*
            * Update the zoom level of the map on mousewheel
            */
                if (options.map.zoom.mousewheel) {
                    $map.on("mousewheel", function(e) {
                        var offset = $map.offset(),
                            initFactor = (options.map.width) ? (Mapael.maps[options.map.name].width / options.map.width) : (Mapael.maps[options.map.name].width / $map.width())
                            , zoomLevel = (e.deltaY > 0) ? 1 : -1
                            , zoomFactor = 1 / (1 + ($container.data("zoomLevel")) * options.map.zoom.step)
                            , x = zoomFactor * initFactor * (e.clientX + $(window).scrollLeft() - offset.left) + $container.data("panX")
                            , y = zoomFactor * initFactor * (e.clientY + $(window).scrollTop() - offset.top) + $container.data("panY");

                        $container.trigger("zoom", {"fixedCenter" : true, "level" : $container.data("zoomLevel") + zoomLevel, "x" : x, "y" : y});

                        return false;
                    });
                }

                /*
                 * Update the zoom level of the map on touch pinch
                 */
                if (options.map.zoom.touch) {
                    $map.on("touchstart", function(e) {
                        if (e.originalEvent.touches.length === 2) {
                            zoomCenterX = (e.originalEvent.touches[0].clientX + e.originalEvent.touches[1].clientX) / 2;
                            zoomCenterY = (e.originalEvent.touches[0].clientY + e.originalEvent.touches[1].clientY) / 2;
                            previousPinchDist = Math.sqrt(Math.pow((e.originalEvent.touches[1].clientX - e.originalEvent.touches[0].clientX), 2) + Math.pow((e.originalEvent.touches[1].clientY - e.originalEvent.touches[0].clientY), 2));
                        }
                    });

                    $map.on("touchmove", function(e) {
                        var offset = 0, initFactor = 0, zoomFactor = 0, x = 0, y = 0, pinchDist = 0, zoomLevel = 0;

                        if (e.originalEvent.touches.length === 2) {
                            pinchDist = Math.sqrt(Math.pow((e.originalEvent.touches[1].clientX - e.originalEvent.touches[0].clientX), 2) + Math.pow((e.originalEvent.touches[1].clientY - e.originalEvent.touches[0].clientY), 2));

                            if (Math.abs(pinchDist - previousPinchDist) > 15) {
                                offset = $map.offset();
                                initFactor = (options.map.width) ? (Mapael.maps[options.map.name].width / options.map.width) : ($.fn[pluginName].maps[options.map.name].width / $map.width());
                                zoomFactor = 1 / (1 + ($container.data("zoomLevel")) * options.map.zoom.step);
                                x = zoomFactor * initFactor * (zoomCenterX + $(window).scrollLeft() - offset.left) + $container.data("panX");
                                y = zoomFactor * initFactor * (zoomCenterY + $(window).scrollTop() - offset.top) + $container.data("panY");

                                zoomLevel = (pinchDist - previousPinchDist) / Math.abs(pinchDist - previousPinchDist);
                                $container.trigger("zoom", {"fixedCenter" : true, "level" : $container.data("zoomLevel") + zoomLevel, "x" : x, "y" : y});
                                previousPinchDist = pinchDist;
                            }
                            return false;
                        }
                    });
                }
                // Enable zoom
                Mapael.initZoom($map, paper, mapConf.width, mapConf.height, options.map.zoom);
            }

            // Set initial zoom
            if (typeof options.map.zoom.init != "undefined") {
                if (typeof options.map.zoom.init.animDuration == "undefined") {
                    options.map.zoom.init.animDuration = 0;
                }
                $container.trigger("zoom", options.map.zoom.init);
            }

            // Create the legends for areas
            Mapael.createLegends($container, options, "area", areas, 1);

            /*
             *
             * Update the current map
             * Refresh attributes and tooltips for areas and plots
             * @param opt option for the refresh :
             *  opt.mapOptions: options to update for plots and areas
             *  opt.replaceOptions: whether mapsOptions should entirely replace current map options, or just extend it
             *  opt.opt.newPlots new plots to add to the map
             *  opt.newLinks new links to add to the map
             *  opt.deletePlotKeys plots to delete from the map (array, or "all" to remove all plots)
             *  opt.deleteLinkKeys links to remove from the map (array, or "all" to remove all links)
             *  opt.setLegendElemsState the state of legend elements to be set : show (default) or hide
             *  opt.animDuration animation duration in ms (default = 0)
             *  opt.afterUpdate Hook that allows to add custom processing on the map
             */
            $container.on("update", function(e, opt) {
                // Abort if opt is undefined
                if (typeof opt !== "object")  return;
            
                var i = 0
                    , animDuration = (opt.animDuration) ? opt.animDuration : 0
                    , elemOptions = {}
                    // This function remove an element using animation (or not, depending on animDuration)
                    // Used for deletePlotKeys and deleteLinkKeys
                    , fnRemoveElement = function(elem) {
                        // Unset all event handlers
                        Mapael.unsetHover(elem.mapElem, elem.textElem);
                        if (animDuration > 0) {
                            elem.mapElem.animate({"opacity":0}, animDuration, "linear", function() {
                                elem.mapElem.remove();
                            });
                            if (elem.textElem) {
                                elem.textElem.animate({"opacity":0}, animDuration, "linear", function() {
                                    elem.textElem.remove();
                                });
                            }
                        } else {
                            elem.mapElem.remove();
                            if (elem.textElem) {
                                elem.textElem.remove();
                            }
                        }
                    }
                    // This function show an element using animation
                    // Used for newPlots and newLinks
                    , fnShowElement = function(elem) {
                        elem.mapElem.attr({opacity : 0});
                        elem.mapElem.animate({"opacity": (typeof elem.mapElem.originalAttrs.opacity != "undefined") ? elem.mapElem.originalAttrs.opacity : 1}, animDuration);

                        if (elem.textElem) {
                            elem.textElem.attr({opacity : 0});
                            elem.textElem.animate({"opacity": (typeof elem.textElem.originalAttrs.opacity != "undefined") ? elem.textElem.originalAttrs.opacity : 1}, animDuration);
                        }
                    };

                if (typeof opt.mapOptions === "object") {
                    if (opt.replaceOptions === true) options = $.extend(true, {}, Mapael.defaultOptions, opt.mapOptions);
                    else $.extend(true, options, opt.mapOptions);
                }

                // Delete plots by name if deletePlotKeys is array
                if (typeof opt.deletePlotKeys === "object") {
                    for (;i < opt.deletePlotKeys.length; i++) {
                        if (typeof plots[opt.deletePlotKeys[i]] != "undefined") {
                            fnRemoveElement(plots[opt.deletePlotKeys[i]]);
                            delete plots[opt.deletePlotKeys[i]];
                        }
                    }
                // Delete ALL plots if deletePlotKeys is set to "all"
                } else if (opt.deletePlotKeys === "all") {
                    $.each(plots, function(id, elem) {
                        fnRemoveElement(elem);
                    });
                    // Empty plots object
                    plots = {};
                }

                // Delete links by name if deleteLinkKeys is array
                if (typeof opt.deleteLinkKeys === "object") {
                    for (i = 0;i < opt.deleteLinkKeys.length; i++) {
                        if (typeof links[opt.deleteLinkKeys[i]] != "undefined") {
                            fnRemoveElement(links[opt.deleteLinkKeys[i]]);
                            delete links[opt.deleteLinkKeys[i]];
                        }
                    }
                // Delete ALL links if deleteLinkKeys is set to "all"
                } else if (opt.deleteLinkKeys === "all") {
                    $.each(links, function(id, elem) {
                        fnRemoveElement(elem);
                    });
                    // Empty links object
                    links = {};
                }

                // New plots
                if (typeof opt.newPlots === "object") {
                    $.each(opt.newPlots, function(id) {
                        if (typeof plots[id] == "undefined") {
                            options.plots[id] = opt.newPlots[id];
                            plots[id] = Mapael.drawPlot(id, options, mapConf, paper, $tooltip);
                            if (animDuration > 0) {
                                fnShowElement(plots[id]);
                            }
                        }
                    });
                }

                // New links
                if (typeof opt.newLinks === "object") {
                    var newLinks = Mapael.drawLinksCollection(paper, options, opt.newLinks, mapConf.getCoords, $tooltip);
                    $.extend(links, newLinks);
                    $.extend(options.links, opt.newLinks);
                    if (animDuration > 0) {
                        $.each(newLinks, function(id) {
                            fnShowElement(newLinks[id]);
                        });
                    }
                }

                // Update areas attributes and tooltips
                $.each(areas, function(id) {
                    elemOptions = Mapael.getElemOptions(
                        options.map.defaultArea
                        , (options.areas[id] ? options.areas[id] : {})
                        , options.legend.area
                    );

                    Mapael.updateElem(elemOptions, areas[id], $tooltip, animDuration);
                });

                // Update plots attributes and tooltips
                $.each(plots, function(id) {
                    elemOptions = Mapael.getElemOptions(
                        options.map.defaultPlot
                        , (options.plots[id] ? options.plots[id] : {})
                        , options.legend.plot
                    );
                    if (elemOptions.type == "square") {
                        elemOptions.attrs.width = elemOptions.size;
                        elemOptions.attrs.height = elemOptions.size;
                        elemOptions.attrs.x = plots[id].mapElem.attrs.x - (elemOptions.size - plots[id].mapElem.attrs.width) / 2;
                        elemOptions.attrs.y = plots[id].mapElem.attrs.y - (elemOptions.size - plots[id].mapElem.attrs.height) / 2;
                    } else if (elemOptions.type == "image") {
                        elemOptions.attrs.width = elemOptions.width;
                        elemOptions.attrs.height = elemOptions.height;
                        elemOptions.attrs.x = plots[id].mapElem.attrs.x - (elemOptions.width - plots[id].mapElem.attrs.width) / 2;
                        elemOptions.attrs.y = plots[id].mapElem.attrs.y - (elemOptions.height - plots[id].mapElem.attrs.height) / 2;
                    } else { // Default : circle
                        elemOptions.attrs.r = elemOptions.size / 2;
                    }

                    Mapael.updateElem(elemOptions, plots[id], $tooltip, animDuration);
                });

                // Update links attributes and tooltips
                $.each(links, function(id) {
                    elemOptions = Mapael.getElemOptions(
                        options.map.defaultLink
                        , (options.links[id] ? options.links[id] : {})
                        , {}
                    );

                    Mapael.updateElem(elemOptions, links[id], $tooltip, animDuration);
                });

                // Update legends
                if (opt.mapOptions && typeof opt.mapOptions.legend === "object") {
                    Mapael.createLegends($container, options, "area", areas, 1);
                    if (options.map.width) {
                        Mapael.createLegends($container, options, "plot", plots, (options.map.width / mapConf.width));
                    } else {
                        Mapael.createLegends($container, options, "plot", plots, ($map.width() / mapConf.width));
                    }
                }

                // Hide/Show all elements based on showlegendElems
                //      Toggle (i.e. click) only if:
                //          - slice legend is shown AND we want to hide
                //          - slice legend is hidden AND we want to show
                if (typeof opt.setLegendElemsState === "object") {
                    // setLegendElemsState is an object listing the legend we want to hide/show
                    $.each(opt.setLegendElemsState, function (legendCSSClass, action) {
                        // Search for the legend
                        var $legend = $container.find("." + legendCSSClass)[0];
                        if (typeof $legend !== "undefined") {
                            // Select all elem inside this legend
                            $("[data-type='elem']", $legend).each(function(id, elem) {
                                if (($(elem).attr('data-hidden') === "0" && action === "hide") ||
                                    ($(elem).attr('data-hidden') === "1" && action === "show")) {
                                    // Toggle state of element by clicking
                                    $(elem).trigger('click', [false, animDuration]);
                                }
                            });
                        }
                    });
                } else {
                    // setLegendElemsState is a string, or is undefined
                    // Default : "show"
                    var action = (opt.setLegendElemsState === "hide") ? "hide" : "show";

                    $("[data-type='elem']", $container).each(function(id, elem) {
                        if (($(elem).attr('data-hidden') === "0" && action === "hide") ||
                            ($(elem).attr('data-hidden') === "1" && action === "show")) {
                            // Toggle state of element by clicking
                            $(elem).trigger('click', [false, animDuration]);
                        }
                    });
                }
                if (opt.afterUpdate) opt.afterUpdate($container, paper, areas, plots, options);
            });

            // Handle resizing of the map
            if (options.map.width) {
                paper.setSize(options.map.width, mapConf.height * (options.map.width / mapConf.width));

                // Create the legends for plots taking into account the scale of the map
                Mapael.createLegends($container, options, "plot", plots, (options.map.width / mapConf.width));
            } else {
                $(window).on("resize", function() {
                    clearTimeout(resizeTO);
                    resizeTO = setTimeout(function(){$map.trigger("resizeEnd");}, 150);
                });

                // Create the legends for plots taking into account the scale of the map
                var createPlotLegend = function() {
                    Mapael.createLegends($container, options, "plot", plots, ($map.width() / mapConf.width));

                    $map.unbind("resizeEnd", createPlotLegend);
                };

                $map.on("resizeEnd", function() {
                    var containerWidth = $map.width();
                    if (paper.width != containerWidth) {
                        paper.setSize(containerWidth, mapConf.height * (containerWidth / mapConf.width));
                    }
                }).on("resizeEnd", createPlotLegend).trigger("resizeEnd");
            }

            // Hook that allows to add custom processing on the map
            if (options.map.afterInit) options.map.afterInit($container, paper, areas, plots, options);

            $(paper.desc).append(" and Mapael (http://www.vincentbroute.fr/mapael/)");

    };

    /*
     * Version number of jQuery Mapael. See http://semver.org/ for more information.
     *  @type string
     */
    Mapael.version = '1.1.0';

    Mapael.zoomTO = 0;

    /*
     * Init the element "elem" on the map (drawing, setting attributes, events, tooltip, ...)
     */
    Mapael.initElem = function(paper, elem, options, $tooltip, id) {
        var bbox = {}, textPosition = {};
        if (typeof options.value != "undefined")
            elem.value = options.value;

        // Init attrsHover
        Mapael.setHoverOptions(elem.mapElem, options.attrs, options.attrsHover);

        // Init the label related to the element
        if (options.text && typeof options.text.content != "undefined") {
            // Set a text label in the area
            bbox = elem.mapElem.getBBox();
            textPosition = Mapael.getTextPosition(bbox, options.text.position, options.text.margin);
            options.text.attrs["text-anchor"] = textPosition.textAnchor;
            elem.textElem = paper.text(textPosition.x, textPosition.y, options.text.content).attr(options.text.attrs);
            Mapael.setHoverOptions(elem.textElem, options.text.attrs, options.text.attrsHover);
            if (options.eventHandlers) Mapael.setEventHandlers(id, options, elem.mapElem, elem.textElem);
            Mapael.setHover(paper, elem.mapElem, elem.textElem);
            $(elem.textElem.node).attr("data-id", id);
        } else {
            if (options.eventHandlers) Mapael.setEventHandlers(id, options, elem.mapElem);
            Mapael.setHover(paper, elem.mapElem);
        }

        // Init the tooltip
        if (options.tooltip) {
            elem.mapElem.tooltip = options.tooltip;
            Mapael.setTooltip(elem.mapElem, $tooltip);

            if (options.text && typeof options.text.content != "undefined") {
                elem.textElem.tooltip = options.tooltip;
                Mapael.setTooltip(elem.textElem, $tooltip);
            }
        }

        // Init the link
        if (options.href) {
            elem.mapElem.href = options.href;
            elem.mapElem.target = options.target;
            Mapael.setHref(elem.mapElem);

            if (options.text && typeof options.text.content != "undefined") {
                elem.textElem.href = options.href;
                elem.textElem.target = options.target;
                Mapael.setHref(elem.textElem);
            }
        }

        $(elem.mapElem.node).attr("data-id", id);
    };

    /*
     * Draw all links between plots on the paper
     */
    Mapael.drawLinksCollection = function(paper, options, linksCollection, getCoords, $tooltip) {
        var p1 = {}
            , p2 = {}
            , elemOptions = {}
            , coordsP1 = {}
            , coordsP2 ={}
            , links = {};

        $.each(linksCollection, function(id) {
            elemOptions = Mapael.getElemOptions(options.map.defaultLink, linksCollection[id], {});

            if (typeof linksCollection[id].between[0] == 'string') {
                p1 = options.plots[linksCollection[id].between[0]];
            } else {
                p1 = linksCollection[id].between[0];
            }

            if (typeof linksCollection[id].between[1] == 'string') {
                p2 = options.plots[linksCollection[id].between[1]];
            } else {
                p2 = linksCollection[id].between[1];
            }

            if (typeof p1.latitude != "undefined" && typeof p1.longitude != "undefined") {
                coordsP1 = getCoords(p1.latitude, p1.longitude);
            } else {
                coordsP1.x = p1.x;
                coordsP1.y = p1.y;
            }

            if (typeof p2.latitude != "undefined" && typeof p2.longitude != "undefined") {
                coordsP2 = getCoords(p2.latitude, p2.longitude);
            } else {
                coordsP2.x = p2.x;
                coordsP2.y = p2.y;
            }
            links[id] = Mapael.drawLink(id, paper, coordsP1.x, coordsP1.y, coordsP2.x, coordsP2.y, elemOptions, $tooltip);
        });
        return links;
    };

    /*
     * Draw a curved link between two couples of coordinates a(xa,ya) and b(xb, yb) on the paper
     */
    Mapael.drawLink = function(id, paper, xa, ya, xb, yb, elemOptions, $tooltip) {
        var elem = {}

            // Compute the "curveto" SVG point, d(x,y)
            // c(xc, yc) is the center of (xa,ya) and (xb, yb)
            , xc = (xa + xb) / 2
             , yc = (ya + yb) / 2

             // Equation for (cd) : y = acd * x + bcd (d is the cure point)
             , acd = - 1 / ((yb - ya) / (xb - xa))
             , bcd = yc - acd * xc

             // dist(c,d) = dist(a,b) (=abDist)
             , abDist = Math.sqrt((xb-xa)*(xb-xa) + (yb-ya)*(yb-ya))

             // Solution for equation dist(cd) = sqrt((xd - xc)² + (yd - yc)²)
             // dist(c,d)² = (xd - xc)² + (yd - yc)²
             // We assume that dist(c,d) = dist(a,b)
             // so : (xd - xc)² + (yd - yc)² - dist(a,b)² = 0
             // With the factor : (xd - xc)² + (yd - yc)² - (factor*dist(a,b))² = 0
             // (xd - xc)² + (acd*xd + bcd - yc)² - (factor*dist(a,b))² = 0
             , a = 1 + acd*acd
             , b = -2 * xc + 2*acd*bcd - 2 * acd*yc
             , c = xc*xc + bcd*bcd - bcd*yc - yc*bcd + yc*yc - ((elemOptions.factor*abDist) * (elemOptions.factor*abDist))
             , delta = b*b - 4*a*c
             , x = 0
             , y = 0;

        // There are two solutions, we choose one or the other depending on the sign of the factor
        if (elemOptions.factor > 0) {
             x = (-b + Math.sqrt(delta)) / (2*a);
             y = acd * x + bcd;
        } else {
             x = (-b - Math.sqrt(delta)) / (2*a);
             y = acd * x + bcd;
        }

        elem.mapElem = paper.path("m "+xa+","+ya+" C "+x+","+y+" "+xb+","+yb+" "+xb+","+yb+"").attr(elemOptions.attrs);
        Mapael.initElem(paper, elem, elemOptions, $tooltip, id);

        return elem;
    };

    /*
     * Update the element "elem" on the map with the new elemOptions options
     */
    Mapael.updateElem = function(elemOptions, elem, $tooltip, animDuration) {
        var bbox, textPosition, plotOffsetX, plotOffsetY;
        if (typeof elemOptions.value != "undefined")
            elem.value = elemOptions.value;

        // Update the label
        if (elem.textElem) {
            if (typeof elemOptions.text != "undefined" && typeof elemOptions.text.content != "undefined" && elemOptions.text.content != elem.textElem.attrs.text)
                elem.textElem.attr({text : elemOptions.text.content});

            bbox = elem.mapElem.getBBox();

            if (elemOptions.size || (elemOptions.width && elemOptions.height)) {
                if (elemOptions.type == "image" || elemOptions.type == "svg") {
                    plotOffsetX = (elemOptions.width - bbox.width) / 2;
                    plotOffsetY = (elemOptions.height - bbox.height) / 2;
                } else {
                    plotOffsetX = (elemOptions.size - bbox.width) / 2;
                    plotOffsetY = (elemOptions.size - bbox.height) / 2;
                }
                bbox.x -= plotOffsetX;
                bbox.x2 += plotOffsetX;
                bbox.y -= plotOffsetY;
                bbox.y2 += plotOffsetY;
            }

            textPosition = Mapael.getTextPosition(bbox, elemOptions.text.position, elemOptions.text.margin);
            if (textPosition.x != elem.textElem.attrs.x || textPosition.y != elem.textElem.attrs.y) {
                if (animDuration > 0) {
                    elem.textElem.attr({"text-anchor" : textPosition.textAnchor});
                    elem.textElem.animate({x : textPosition.x, y : textPosition.y}, animDuration);
                } else
                    elem.textElem.attr({x : textPosition.x, y : textPosition.y, "text-anchor" : textPosition.textAnchor});
            }

            Mapael.setHoverOptions(elem.textElem, elemOptions.text.attrs, elemOptions.text.attrsHover);
            if (animDuration > 0)
                elem.textElem.animate(elemOptions.text.attrs, animDuration);
            else
                elem.textElem.attr(elemOptions.text.attrs);
        }

        // Update elements attrs and attrsHover
        Mapael.setHoverOptions(elem.mapElem, elemOptions.attrs, elemOptions.attrsHover);
        if (animDuration > 0)
            elem.mapElem.animate(elemOptions.attrs, animDuration);
        else
            elem.mapElem.attr(elemOptions.attrs);

        // Update dimensions of SVG plots
        if (elemOptions.type == "svg") {
            elem.mapElem.transform("m"+(elemOptions.width / elem.mapElem.originalWidth)+",0,0,"+(elemOptions.height / elem.mapElem.originalHeight)+","+bbox.x+","+bbox.y);
        }

        // Update the tooltip
        if (elemOptions.tooltip) {
            if (typeof elem.mapElem.tooltip == "undefined") {
                Mapael.setTooltip(elem.mapElem, $tooltip);
                if (elem.textElem) Mapael.setTooltip(elem.textElem, $tooltip);
            }
            elem.mapElem.tooltip = elemOptions.tooltip;
            if (elem.textElem) elem.textElem.tooltip = elemOptions.tooltip;
        }

        // Update the link
        if (typeof elemOptions.href != "undefined") {
            if (typeof elem.mapElem.href == "undefined") {
                Mapael.setHref(elem.mapElem);
                if (elem.textElem) Mapael.setHref(elem.textElem);
            }
            elem.mapElem.href = elemOptions.href;
            elem.mapElem.target = elemOptions.target;
            if (elem.textElem) {
                elem.textElem.href = elemOptions.href;
                elem.textElem.target = elemOptions.target;
            }
        }
    };

    /*
     * Draw the plot
     */
    Mapael.drawPlot = function(id, options, mapConf, paper, $tooltip) {
        var plot = {}
            , coords = {}
            , elemOptions = Mapael.getElemOptions(
                options.map.defaultPlot
                , (options.plots[id] ? options.plots[id] : {})
                , options.legend.plot
            );

        if (typeof elemOptions.x != "undefined" && typeof elemOptions.y != "undefined")
            coords = {x : elemOptions.x, y : elemOptions.y};
        else
            coords = mapConf.getCoords(elemOptions.latitude, elemOptions.longitude);

        if (elemOptions.type == "square") {
            plot = {"mapElem" : paper.rect(
                coords.x - (elemOptions.size / 2)
                , coords.y - (elemOptions.size / 2)
                , elemOptions.size
                , elemOptions.size
            ).attr(elemOptions.attrs)};
        } else if (elemOptions.type == "image") {
            plot = {
                "mapElem" : paper.image(
                    elemOptions.url
                    , coords.x - elemOptions.width / 2
                    , coords.y - elemOptions.height / 2
                    , elemOptions.width
                    , elemOptions.height
                ).attr(elemOptions.attrs)
            };
        } else if (elemOptions.type == "svg") {
            plot = {"mapElem" : paper.path(elemOptions.path).attr(elemOptions.attrs)};
            plot.mapElem.originalWidth = plot.mapElem.getBBox().width;
            plot.mapElem.originalHeight = plot.mapElem.getBBox().height;
            plot.mapElem.transform("m"+(elemOptions.width / plot.mapElem.originalWidth)+",0,0,"+(elemOptions.height / plot.mapElem.originalHeight)+","+(coords.x - elemOptions.width / 2)+","+(coords.y - elemOptions.height / 2));
        } else { // Default = circle
            plot = {"mapElem" : paper.circle(coords.x, coords.y, elemOptions.size / 2).attr(elemOptions.attrs)};
        }

        Mapael.initElem(paper, plot, elemOptions, $tooltip, id);
        return plot;
    };

    /*
     * Set target link on elem
     */
    Mapael.setHref = function(elem) {
        elem.attr({cursor : "pointer"});
        $(elem.node).bind("click", function() {
            if (!Mapael.panning && elem.href)
                window.open(elem.href, elem.target);
        });
    };

    /*
     * Set a tooltip for the areas and plots
     * @param elem area or plot element
     * @param $tooltip the tooltip container
     * @param content the content to set in the tooltip
     */
    Mapael.setTooltip = function(elem, $tooltip) {
        var tooltipTO = 0
            , $container = $tooltip.parent()
            , cssClass = $tooltip.attr('class')
            , updateTooltipPosition = function(x, y) {
                var tooltipPosition = {
                    "left" : Math.min($container.width() - $tooltip.outerWidth() - 5, x - $container.offset().left + 10),
                    "top" : Math.min($container.height() - $tooltip.outerHeight() - 5, y - $container.offset().top + 20)
                };

                if (typeof elem.tooltip.overflow != "undefined") {
                    if (typeof elem.tooltip.overflow.right != "undefined" && elem.tooltip.overflow.right === true) {
                        tooltipPosition.left = x - $container.offset().left + 10;
                    }
                    if (typeof elem.tooltip.overflow.bottom != "undefined" && elem.tooltip.overflow.bottom === true) {
                        tooltipPosition.top = y - $container.offset().top + 20;
                    }
                }

                $tooltip.css(tooltipPosition);
            };

        $(elem.node).on("mouseover", function(e) {
            tooltipTO = setTimeout(
                function() {
                    $tooltip.attr("class", cssClass);
                    if (typeof elem.tooltip != "undefined") {
                        if (typeof elem.tooltip.content != "undefined") {
                            // if tooltip.content is function, call it. Otherwise, assign it directly.
                            var content = (typeof elem.tooltip.content === "function")? elem.tooltip.content(elem) : elem.tooltip.content;
                            $tooltip.html(content).css("display", "block");
                        }
                        if (typeof elem.tooltip.cssClass != "undefined") {
                            $tooltip.addClass(elem.tooltip.cssClass);
                        }
                    }
                    updateTooltipPosition(e.pageX, e.pageY);
                }
                , 120
            );
        }).on("mouseout", function() {
            clearTimeout(tooltipTO);
            $tooltip.css("display", "none");
        }).on("mousemove", function(e) {
            updateTooltipPosition(e.pageX, e.pageY);
        });
    };

    /*
     * Set user defined handlers for events on areas and plots
     * @param id the id of the element
     * @param elemOptions the element parameters
     * @param mapElem the map element to set callback on
     * @param textElem the optional text within the map element
     */
    Mapael.setEventHandlers = function(id, elemOptions, mapElem, textElem) {
        $.each(elemOptions.eventHandlers, function(event) {
            (function(event) {
                $(mapElem.node).on(event, function(e) {
                    if (!Mapael.panning) elemOptions.eventHandlers[event](e, id, mapElem, textElem, elemOptions);
                });
                if (textElem) {
                    $(textElem.node).on(event, function(e) {
                        if (!Mapael.panning) elemOptions.eventHandlers[event](e, id, mapElem, textElem, elemOptions);
                    });
                }
            })(event);
        });
    };

    Mapael.panning = false;
    Mapael.panningTO = 0;

    /*
     * Init zoom and panning for the map
     * @param $map
     * @param paper
     * @param mapWidth
     * @param mapHeight
    * @param options
     */
    Mapael.initZoom = function($map, paper, mapWidth, mapHeight, options) {
        var $parentContainer = $map.parent()
            , $zoomIn = $("<div>").addClass(options.zoomInCssClass).html("+")
            , $zoomOut = $("<div>").addClass(options.zoomOutCssClass).html("&#x2212;")
            , mousedown = false
            , previousX = 0
            , previousY = 0;

        // Zoom
        $parentContainer.data("zoomLevel", 0).data({"panX" : 0, "panY" : 0});
        $map.append($zoomIn).append($zoomOut);

        $zoomIn.on("click", function() {$parentContainer.trigger("zoom", {"level" : $parentContainer.data("zoomLevel") + 1});});
        $zoomOut.on("click", function() {$parentContainer.trigger("zoom", {"level" : $parentContainer.data("zoomLevel") - 1});});

        // Panning
        $("body").on("mouseup" + (options.touch ? " touchend" : ""), function() {
            mousedown = false;
            setTimeout(function () {Mapael.panning = false;}, 50);
        });

        $map.on("mousedown" + (options.touch ? " touchstart" : ""), function(e) {
            if (typeof e.pageX !== 'undefined') {
                mousedown = true;
                previousX = e.pageX;
                previousY = e.pageY;
            } else {
                if (e.originalEvent.touches.length === 1) {
                    mousedown = true;
                    previousX = e.originalEvent.touches[0].pageX;
                    previousY = e.originalEvent.touches[0].pageY;
                }
            }
        }).on("mousemove" + (options.touch ? " touchmove" : ""), function(e) {
            var currentLevel = $parentContainer.data("zoomLevel")
                , pageX = 0
                , pageY = 0;

            if (typeof e.pageX !== 'undefined') {
                pageX = e.pageX;
                pageY = e.pageY;
            } else {
                if (e.originalEvent.touches.length === 1) {
                    pageX = e.originalEvent.touches[0].pageX;
                    pageY = e.originalEvent.touches[0].pageY;
                } else {
                    mousedown = false;
                }
            }

            if (mousedown && currentLevel !== 0) {
                var offsetX = (previousX - pageX) / (1 + (currentLevel * options.step)) * (mapWidth / paper.width)
                    , offsetY = (previousY - pageY) / (1 + (currentLevel * options.step)) * (mapHeight / paper.height)
                    , panX = Math.min(Math.max(0, paper._viewBox[0] + offsetX), (mapWidth - paper._viewBox[2]))
                    , panY = Math.min(Math.max(0, paper._viewBox[1] + offsetY), (mapHeight - paper._viewBox[3]));

                if (Math.abs(offsetX) > 5 || Math.abs(offsetY) > 5) {
                    $parentContainer.data({"panX" : panX, "panY" : panY, "zoomX" : panX + paper._viewBox[2] / 2, "zoomY" : panY + paper._viewBox[3] / 2});

                    paper.setViewBox(panX, panY, paper._viewBox[2], paper._viewBox[3]);

                    clearTimeout(Mapael.panningTO);
                    Mapael.panningTO = setTimeout(function(){$map.trigger("afterPanning", {x1 : panX, y1 : panY, x2 : (panX+paper._viewBox[2]), y2 : (panY+paper._viewBox[3])});}, 150);

                    previousX = pageX;
                    previousY = pageY;
                    Mapael.panning = true;
                }
                return false;
            }
        });
    };

    /*
     * Draw a legend for areas and / or plots
     * @param legendOptions options for the legend to draw
     * @param $container the whole element container
     * @param options map options object
     * @param legendType the type of the legend : "area" or "plot"
     * @param elems collection of plots or areas on the maps
     * @param legendIndex index of the legend in the conf array
     */
    Mapael.drawLegend = function (legendOptions, $container, options, legendType, elems, scale, legendIndex) {
        var $legend = {}
            , paper = {}
            , width = 0
            , height = 0
            , title = null
            , elem = {}
            , elemBBox = {}
            , label = {}
            , i = 0
            , x = 0
            , y = 0
            , yCenter = 0
            , sliceAttrs = []
            , length = 0;

            $legend = $("." + legendOptions.cssClass, $container).empty();
            paper = new Raphael($legend.get(0));
            height = width = 0;

            // Set the title of the legend
            if(legendOptions.title && legendOptions.title !== "") {
                title = paper.text(legendOptions.marginLeftTitle, 0, legendOptions.title).attr(legendOptions.titleAttrs);
                title.attr({y : 0.5 * title.getBBox().height});

                width = legendOptions.marginLeftTitle + title.getBBox().width;
                height += legendOptions.marginBottomTitle + title.getBBox().height;
            }

            // Calculate attrs (and width, height and r (radius)) for legend elements, and yCenter for horizontal legends
            for(i = 0, length = legendOptions.slices.length; i < length; ++i) {
                var current_yCenter = 0;

                // Check if size is defined. If not, take defaultPlot size
                if (typeof legendOptions.slices[i].size == "undefined")
                    legendOptions.slices[i].size = options.map.defaultPlot.size;

                if (typeof legendOptions.slices[i].legendSpecificAttrs == "undefined")
                    legendOptions.slices[i].legendSpecificAttrs = {};

                sliceAttrs[i] = $.extend(
                    {}
                    , (legendType == "plot") ? options.map.defaultPlot.attrs : options.map.defaultArea.attrs
                    , legendOptions.slices[i].attrs
                    , legendOptions.slices[i].legendSpecificAttrs
                );

                if (legendType == "area") {
                    if (typeof sliceAttrs[i].width == "undefined")
                        sliceAttrs[i].width = 30;
                    if (typeof sliceAttrs[i].height == "undefined")
                        sliceAttrs[i].height = 20;
                } else if (legendOptions.slices[i].type == "square") {
                    if (typeof sliceAttrs[i].width == "undefined")
                        sliceAttrs[i].width = legendOptions.slices[i].size;
                    if (typeof sliceAttrs[i].height == "undefined")
                        sliceAttrs[i].height = legendOptions.slices[i].size;
                } else if (legendOptions.slices[i].type == "image" || legendOptions.slices[i].type == "svg") {
                    if (typeof sliceAttrs[i].width == "undefined")
                        sliceAttrs[i].width = legendOptions.slices[i].width;
                    if (typeof sliceAttrs[i].height == "undefined")
                        sliceAttrs[i].height = legendOptions.slices[i].height;
                } else {
                    if (typeof sliceAttrs[i].r == "undefined")
                        sliceAttrs[i].r = legendOptions.slices[i].size / 2;
                }

                // Compute yCenter for this legend slice
                current_yCenter = legendOptions.marginBottomTitle;
                // Add title height if it exists
                if (title) {
                    current_yCenter += title.getBBox().height;
                }
                if(legendType == "plot" && (typeof legendOptions.slices[i].type == "undefined" || legendOptions.slices[i].type == "circle")) {
                    current_yCenter += scale * sliceAttrs[i].r;
                } else {
                    current_yCenter += scale * sliceAttrs[i].height/2;
                }
                // Update yCenter if current larger
                yCenter = Math.max(yCenter, current_yCenter);
            }

            if (legendOptions.mode == "horizontal") {
                width = legendOptions.marginLeft;
            }

            // Draw legend elements (circle, square or image in vertical or horizontal mode)
            for(i = 0, length = legendOptions.slices.length; i < length; ++i) {
                if (typeof legendOptions.slices[i].display == "undefined" || legendOptions.slices[i].display === true) {
                    if(legendType == "area") {
                        if (legendOptions.mode == "horizontal") {
                            x = width + legendOptions.marginLeft;
                            y = yCenter - (0.5 * scale * sliceAttrs[i].height);
                        } else {
                            x = legendOptions.marginLeft;
                            y = height;
                        }

                        elem = paper.rect(x, y, scale * (sliceAttrs[i].width), scale * (sliceAttrs[i].height));
                    } else if(legendOptions.slices[i].type == "square") {
                        if (legendOptions.mode == "horizontal") {
                            x = width + legendOptions.marginLeft;
                            y = yCenter - (0.5 * scale * sliceAttrs[i].height);
                        } else {
                            x = legendOptions.marginLeft;
                            y = height;
                        }

                        elem = paper.rect(x, y, scale * (sliceAttrs[i].width), scale * (sliceAttrs[i].height));

                    } else if(legendOptions.slices[i].type == "image" || legendOptions.slices[i].type == "svg") {
                        if (legendOptions.mode == "horizontal") {
                            x = width + legendOptions.marginLeft;
                            y = yCenter - (0.5 * scale * sliceAttrs[i].height);
                        } else {
                            x = legendOptions.marginLeft;
                            y = height;
                        }

                        if (legendOptions.slices[i].type == "image") {
                            elem = paper.image(
                                legendOptions.slices[i].url, x, y, scale * sliceAttrs[i].width, scale * sliceAttrs[i].height);
                        } else {
                            elem = paper.path(legendOptions.slices[i].path);
                            elem.transform("m"+((scale*legendOptions.slices[i].width) / elem.getBBox().width)+",0,0,"+((scale*legendOptions.slices[i].height) / elem.getBBox().height)+","+x+","+y);
                        }
                    } else {
                        if (legendOptions.mode == "horizontal") {
                            x = width + legendOptions.marginLeft + scale * (sliceAttrs[i].r);
                            y = yCenter;
                        } else {
                            x = legendOptions.marginLeft + scale * (sliceAttrs[i].r);
                            y = height + scale * (sliceAttrs[i].r);
                        }
                        elem = paper.circle(x, y, scale * (sliceAttrs[i].r));
                    }

                    // Set attrs to the element drawn above
                    delete sliceAttrs[i].width;
                    delete sliceAttrs[i].height;
                    delete sliceAttrs[i].r;
                    elem.attr(sliceAttrs[i]);
                    elemBBox = elem.getBBox();

                    // Draw the label associated with the element
                    if (legendOptions.mode == "horizontal") {
                        x = width + legendOptions.marginLeft + elemBBox.width + legendOptions.marginLeftLabel;
                        y = yCenter;
                    } else {
                        x = legendOptions.marginLeft + elemBBox.width + legendOptions.marginLeftLabel;
                        y = height + (elemBBox.height / 2);
                    }

                    label = paper.text(x, y, legendOptions.slices[i].label).attr(legendOptions.labelAttrs);

                    // Update the width and height for the paper
                    if (legendOptions.mode == "horizontal") {
                        var current_height = legendOptions.marginBottom + elemBBox.height;
                        width += legendOptions.marginLeft + elemBBox.width + legendOptions.marginLeftLabel + label.getBBox().width;
                        if(legendOptions.slices[i].type != "image" && legendType != "area") {
                            current_height += legendOptions.marginBottomTitle;
                        }
                        // Add title height if it exists
                        if (title) {
                            current_height += title.getBBox().height;
                        }
                        height = Math.max(height, current_height);
                    } else {
                        width = Math.max(width, legendOptions.marginLeft + elemBBox.width + legendOptions.marginLeftLabel + label.getBBox().width);
                        height += legendOptions.marginBottom + elemBBox.height;
                    }

                    $(elem.node).attr({"data-type": "elem", "data-index": i, "data-hidden": 0});
                    $(label.node).attr({"data-type": "label", "data-index": i, "data-hidden": 0});

                    // Hide map elements when the user clicks on a legend item
                    if (legendOptions.hideElemsOnClick.enabled) {
                        // Hide/show elements when user clicks on a legend element
                        label.attr({cursor:"pointer"});
                        elem.attr({cursor:"pointer"});

                        Mapael.setHoverOptions(elem, sliceAttrs[i], sliceAttrs[i]);
                        Mapael.setHoverOptions(label, legendOptions.labelAttrs, legendOptions.labelAttrsHover);
                        Mapael.setHover(paper, elem, label);
                        Mapael.handleClickOnLegendElem($container, legendOptions, legendOptions.slices[i], label, elem, elems, legendIndex);
                    }
                }
            }

            // VMLWidth option allows you to set static width for the legend
            // only for VML render because text.getBBox() returns wrong values on IE6/7
            if (Raphael.type != "SVG" && legendOptions.VMLWidth)
                width = legendOptions.VMLWidth;

            paper.setSize(width, height);
            return paper;
    };

    /*
     * Allow to hide elements of the map when the user clicks on a related legend item
     * @param $container the map container
     * @param legendOptions options for the legend to draw
     * @param sliceOptions options of the slice
     * @param label label of the legend item
     * @param elem element of the legend item
     * @param elems collection of plots or areas displayed on the map
     * @param legendIndex index of the legend in the conf array
     */
    Mapael.handleClickOnLegendElem = function($container, legendOptions, sliceOptions, label, elem, elems, legendIndex) {
        var hideMapElems = function(e, hideOtherElems, animDuration) {
            var elemValue = 0
                , hidden = $(label.node).attr('data-hidden')
                , hiddenNewAttr = (hidden === '0') ? {"data-hidden": '1'} : {"data-hidden": '0'};

            // Check animDuration: if not set, this is a regular click, use the value specified in options
            if (typeof animDuration === "undefined") animDuration = legendOptions.hideElemsOnClick.animDuration;

            if (hidden === '0') {
                label.animate({"opacity":0.5}, animDuration);
            } else {
                label.animate({"opacity":1}, animDuration);
            }

            $.each(elems, function(id) {
                // Retreive stored data of element
                //      'hidden-by' contains the list of legendIndex that is hiding this element
                var hiddenBy = elems[id].mapElem.data('hidden-by');
                // Set to empty object if undefined
                if (typeof hiddenBy == "undefined") hiddenBy = {};

                if ($.isArray(elems[id].value)) {
                    elemValue = elems[id].value[legendIndex];
                } else {
                    elemValue = elems[id].value;
                }

                if ((typeof sliceOptions.sliceValue != "undefined" && elemValue == sliceOptions.sliceValue)
                    || ((typeof sliceOptions.sliceValue == "undefined")
                        && (typeof sliceOptions.min == "undefined" || elemValue >= sliceOptions.min)
                        && (typeof sliceOptions.max == "undefined" || elemValue <= sliceOptions.max))
                ) {
                    (function(id) {
                        if (hidden === '0') { // we want to hide this element
                            hiddenBy[legendIndex] = true; // add legendIndex to the data object for later use
                            elems[id].mapElem.animate({"opacity":legendOptions.hideElemsOnClick.opacity}, animDuration, "linear", function() {
                                if (legendOptions.hideElemsOnClick.opacity === 0) elems[id].mapElem.hide();
                            });
                            if (elems[id].textElem) {
                                elems[id].textElem.animate({"opacity":legendOptions.hideElemsOnClick.opacity}, animDuration, "linear", function() {
                                    if (legendOptions.hideElemsOnClick.opacity === 0) elems[id].textElem.hide();
                                });
                            }
                        } else { // We want to show this element
                            delete hiddenBy[legendIndex]; // Remove this legendIndex from object
                            // Check if another legendIndex is defined
                            // We will show this element only if no legend is no longer hiding it
                            if ($.isEmptyObject(hiddenBy)) {
                                if (legendOptions.hideElemsOnClick.opacity === 0) {
                                    elems[id].mapElem.show();
                                    if (elems[id].textElem) elems[id].textElem.show();
                                }
                                elems[id].mapElem.animate({"opacity":typeof elems[id].mapElem.originalAttrs.opacity != "undefined" ? elems[id].mapElem.originalAttrs.opacity : 1}, animDuration);
                                if (elems[id].textElem) elems[id].textElem.animate({"opacity":typeof elems[id].textElem.originalAttrs.opacity != "undefined" ? elems[id].textElem.originalAttrs.opacity : 1}, animDuration);
                            }
                        }
                        // Update elem data with new values
                        elems[id].mapElem.data('hidden-by', hiddenBy);
                    })(id);
                }
            });

            $(elem.node).attr(hiddenNewAttr);
            $(label.node).attr(hiddenNewAttr);

            if ((typeof hideOtherElems === "undefined" || hideOtherElems === true)
                && typeof legendOptions.exclusive !== "undefined" && legendOptions.exclusive === true
            ) {
                $("[data-type='elem'][data-hidden=0]", $container).each(function() {
                    if ($(this).attr('data-index') !== $(elem.node).attr('data-index')) {
                        $(this).trigger('click', false);
                    }
                });
            }
        };
        $(label.node).on("click", hideMapElems);
        $(elem.node).on("click", hideMapElems);

        if (typeof sliceOptions.clicked !== "undefined" && sliceOptions.clicked === true) {
            $(elem.node).trigger('click', false);
        }
    };

    /*
     * Create all legends for a specified type (area or plot)
     * @param $container the whole element container
     * @param options map options
     * @param legendType the type of the legend : "area" or "plot"
     * @param elems collection of plots or areas displayed on the map
     * @param scale scale ratio of the map
     */
    Mapael.createLegends = function ($container, options, legendType, elems, scale) {
        var legendsOptions = options.legend[legendType], legends = [];

        if (!$.isArray(options.legend[legendType])) {
            legendsOptions = [options.legend[legendType]];
        }

        for (var j = 0; j < legendsOptions.length; ++j) {
            if (legendsOptions[j].display === true && $.isArray(legendsOptions[j].slices) && legendsOptions[j].slices.length > 0) {
                legends.push(Mapael.drawLegend(legendsOptions[j], $container, options, legendType, elems, scale, j));
            }
        }
        return legends;
    };

    /*
    * Set the attributes on hover and the attributes to restore for a map element
     * @param elem the map element
     * @param originalAttrs the original attributes to restore on mouseout event
     * @param attrsHover the attributes to set on mouseover event
     */
    Mapael.setHoverOptions = function (elem, originalAttrs, attrsHover) {
        // Disable transform option on hover for VML (IE<9) because of several bugs
        if (Raphael.type != "SVG") delete attrsHover.transform;
        elem.attrsHover = attrsHover;

        if (elem.attrsHover.transform) elem.originalAttrs = $.extend({transform : "s1"}, originalAttrs);
        else elem.originalAttrs = originalAttrs;
    };

    /*
     * Set the hover behavior (mouseover & mouseout) for plots and areas
     * @param paper Raphael paper object
     * @param mapElem the map element
     * @param textElem the optional text element (within the map element)
     */
    Mapael.setHover = function (paper, mapElem, textElem) {
        var $mapElem = {}
            , $textElem = {}
            , hoverTO = 0
            , overBehaviour = function() {hoverTO = setTimeout(function () {Mapael.elemHover(paper, mapElem, textElem);}, 120);}
            , outBehaviour = function () {clearTimeout(hoverTO);Mapael.elemOut(paper, mapElem, textElem);};

        $mapElem = $(mapElem.node);
        $mapElem.on("mouseover", overBehaviour);
        $mapElem.on("mouseout", outBehaviour);

        if (textElem) {
            $textElem = $(textElem.node);
            $textElem.on("mouseover", overBehaviour);
            $(textElem.node).on("mouseout", outBehaviour);
        }
    };

    /*
     * Remove the hover behavior for plots and areas
     * @param mapElem the map element
     * @param textElem the optional text element (within the map element)
     */
    Mapael.unsetHover = function (mapElem, textElem) {
        $(mapElem.node).off();
        if (textElem) $(textElem.node).off();
    };
    /*
     * Set he behaviour for "mouseover" event
     * @param paper paper Raphael paper object
     * @param mapElem mapElem the map element
     * @param textElem the optional text element (within the map element)
     */
    Mapael.elemHover = function (paper, mapElem, textElem) {
        mapElem.animate(mapElem.attrsHover, mapElem.attrsHover.animDuration);
        if (textElem) textElem.animate(textElem.attrsHover, textElem.attrsHover.animDuration);
        // workaround for older version of Raphael
        if (paper.safari) paper.safari();
    };

    /*
     * Set he behaviour for "mouseout" event
     * @param paper Raphael paper object
     * @param mapElem the map element
     * @param textElem the optional text element (within the map element)
     */
    Mapael.elemOut = function (paper, mapElem, textElem) {
        mapElem.animate(mapElem.originalAttrs, mapElem.attrsHover.animDuration);
        if (textElem) textElem.animate(textElem.originalAttrs, textElem.attrsHover.animDuration);
        // workaround for older version of Raphael
        if (paper.safari) paper.safari();
    };

    /*
     * Get element options by merging default options, element options and legend options
     * @param defaultOptions
     * @param elemOptions
     * @param legendOptions
     */
    Mapael.getElemOptions = function(defaultOptions, elemOptions, legendOptions) {
        var options = $.extend(true, {}, defaultOptions, elemOptions);
        if (typeof options.value != "undefined") {
            if ($.isArray(legendOptions)) {
                for (var i = 0, length = legendOptions.length;i<length;++i) {
                    options = $.extend(true, {}, options, Mapael.getLegendSlice(options.value[i], legendOptions[i]));
                }
            } else {
                options = $.extend(true, {}, options, Mapael.getLegendSlice(options.value, legendOptions));
            }
        }
        return options;
    };

    /*
     * Get the coordinates of the text relative to a bbox and a position
     * @param bbox the boundary box of the element
     * @param textPosition the wanted text position (inner, right, left, top or bottom)
     */
    Mapael.getTextPosition = function(bbox, textPosition, margin) {
        var textX = 0
            , textY = 0
            , textAnchor = "";

        switch (textPosition) {
            case "bottom" :
                textX = (bbox.x + bbox.x2) / 2;
                textY = bbox.y2 + margin;
                textAnchor = "middle";
                break;
            case "top" :
                textX = (bbox.x + bbox.x2) / 2;
                textY = bbox.y - margin;
                textAnchor = "middle";
                break;
            case "left" :
                textX = bbox.x - margin;
                textY = (bbox.y + bbox.y2) / 2;
                textAnchor = "end";
                break;
            case "right" :
                textX = bbox.x2 + margin;
                textY = (bbox.y + bbox.y2) / 2;
                textAnchor = "start";
                break;
            default : // "inner" position
                textX = (bbox.x + bbox.x2) / 2;
                textY = (bbox.y + bbox.y2) / 2;
                textAnchor = "middle";
        }
        return {"x" : textX, "y" : textY, "textAnchor" : textAnchor};
    };

    /*
     * Get the legend conf matching with the value
     * @param value the value to match with a slice in the legend
     * @param legend the legend params object
     * @return the legend slice matching with the value
     */
    Mapael.getLegendSlice = function (value, legend) {
        for(var i = 0, length = legend.slices.length; i < length; ++i) {
            if ((typeof legend.slices[i].sliceValue != "undefined" && value == legend.slices[i].sliceValue)
                || ((typeof legend.slices[i].sliceValue == "undefined")
                    && (typeof legend.slices[i].min == "undefined" || value >= legend.slices[i].min)
                    && (typeof legend.slices[i].max == "undefined" || value <= legend.slices[i].max))
            ) {
                return legend.slices[i];
            }
        }
        return {};
    };

    Mapael.animationIntervalID = null;

    /*
      * Animated view box changes
      * As from http://code.voidblossom.com/animating-viewbox-easing-formulas/,
      * (from https://github.com/theshaun works on mapael)
      * @param $map the map container
      * @param paper paper Raphael paper object
      * @param x coordinate of the point to focus on
      * @param y coordinate of the point to focus on
      * @param w map defined width
      * @param h map defined height
      * @param duration defined length of time for animation
      * @param easying_function defined Raphael supported easing_formula to use
      * @param callback method when animated action is complete
      */
    Mapael.animateViewBox = function animateViewBox($map, paper, x, y, w, h, duration, easingFunction ) {
        var cx = paper._viewBox ? paper._viewBox[0] : 0
            , dx = x - cx
            , cy = paper._viewBox ? paper._viewBox[1] : 0
            , dy = y - cy
            , cw = paper._viewBox ? paper._viewBox[2] : paper.width
            , dw = w - cw
            , ch = paper._viewBox ? paper._viewBox[3] : paper.height
            , dh = h - ch
            , interval = 25
            , steps = duration / interval
            , current_step = 0
            , easingFormula;

        easingFunction = easingFunction || "linear";
        easingFormula = Raphael.easing_formulas[easingFunction];

        clearInterval(Mapael.animationIntervalID);

        Mapael.animationIntervalID = setInterval(function() {
                var ratio = current_step / steps;
                paper.setViewBox(cx + dx * easingFormula(ratio),
                                cy + dy * easingFormula(ratio),
                                cw + dw * easingFormula(ratio),
                                ch + dh * easingFormula(ratio), false);
                if (current_step++ >= steps) {
                    clearInterval(Mapael.animationIntervalID);
                    clearTimeout(Mapael.zoomTO);
                    Mapael.zoomTO = setTimeout(function(){$map.trigger("afterZoom", {x1 : x, y1 : y, x2 : (x+w), y2 : (y+h)});}, 150);
                }
            }
            , interval
        );
    };

    // Default map options
    Mapael.defaultOptions = {
        map : {
            cssClass : "map"
            , tooltip : {
                cssClass : "mapTooltip"
            }
            , defaultArea : {
                attrs : {
                    fill : "#343434"
                    , stroke : "#5d5d5d"
                    , "stroke-width" : 1
                    , "stroke-linejoin" : "round"
                }
                , attrsHover : {
                    fill : "#f38a03"
                    , animDuration : 300
                }
                , text : {
                    position : "inner"
                    , margin : 10
                    , attrs : {
                        "font-size" : 15
                        , fill : "#c7c7c7"
                    }
                    , attrsHover : {
                        fill : "#eaeaea"
                        , "animDuration" : 300
                    }
                }
                , target : "_self"
            }
            , defaultPlot : {
                type : "circle"
                , size : 15
                , attrs : {
                    fill : "#0088db"
                    , stroke : "#fff"
                    , "stroke-width" : 0
                    , "stroke-linejoin" : "round"
                }
                , attrsHover : {
                    "stroke-width" : 3
                    , animDuration : 300
                }
                , text : {
                    position : "right"
                    , margin : 10
                    , attrs : {
                        "font-size" : 15
                        , fill : "#c7c7c7"
                    }
                    , attrsHover : {
                        fill : "#eaeaea"
                        , animDuration : 300
                    }
                }
                , target : "_self"
            }
            , defaultLink : {
                factor : 0.5
                , attrs : {
                    stroke : "#0088db"
                    , "stroke-width" : 2
                }
                , attrsHover : {
                    animDuration : 300
                }
                , text : {
                    position : "inner"
                    , margin : 10
                    , attrs : {
                        "font-size" : 15
                        , fill : "#c7c7c7"
                    }
                    , attrsHover : {
                        fill : "#eaeaea"
                        , animDuration : 300
                    }
                }
                , target : "_self"
            }
            , zoom : {
                enabled : false
                , maxLevel : 10
                , step : 0.25
                , zoomInCssClass : "zoomIn"
                , zoomOutCssClass : "zoomOut"
                , mousewheel : true
                , touch : true
                , animDuration : 200
                , animEasing : "linear"
            }
        }
        , legend : {
            area : []
            , plot : []
        }
        , areas : {}
        , plots : {}
        , links : {}
    };

    Mapael.legendDefaultOptions = {
        area : {
            cssClass : "areaLegend"
            , display : true
            , marginLeft : 10
            , marginLeftTitle : 5
            , marginBottomTitle: 10
            , marginLeftLabel : 10
            , marginBottom : 10
            , titleAttrs : {
                "font-size" : 16
                , fill : "#343434"
                , "text-anchor" : "start"
            }
            , labelAttrs : {
                "font-size" : 12
                , fill : "#343434"
                , "text-anchor" : "start"
            }
            , labelAttrsHover : {
                fill : "#787878"
                , animDuration : 300
            }
            , hideElemsOnClick : {
                enabled : true
                , opacity : 0.2
                , animDuration : 300
            }
            , slices : []
            , mode : "vertical"
        }
        , plot : {
            cssClass : "plotLegend"
            , display : true
            , marginLeft : 10
            , marginLeftTitle : 5
            , marginBottomTitle: 10
            , marginLeftLabel : 10
            , marginBottom : 10
            , titleAttrs : {
                "font-size" : 16
                , fill : "#343434"
                , "text-anchor" : "start"
            }
            , labelAttrs : {
                "font-size" : 12
                , fill : "#343434"
                , "text-anchor" : "start"
            }
            , labelAttrsHover : {
                fill : "#787878"
                , animDuration : 300
            }
            , hideElemsOnClick : {
                enabled : true
                , opacity : 0.2
            }
            , slices : []
            , mode : "vertical"
        }
    };

    // jQuery access
    $.fn[pluginName] = Mapael;

}));
