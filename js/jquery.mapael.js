/*!
 *
 * Jquery Mapael - Dynamic maps jQuery plugin (based on raphael.js)
 * Requires jQuery, raphael.js and jquery.mousewheel
 *
 * Version: 2.0.0-dev
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
}(function ($, Raphael, mousewheel, undefined) {

    "use strict";

    // The plugin name (used on several places)
    var pluginName = "mapael";

    // Version number of jQuery Mapael. See http://semver.org/ for more information.
    var version = "2.0.0-dev";

    // Default map options
    var defaultOptions = {
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

    // Default legends option
    var legendDefaultOptions = {
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

    /*
     * Mapael constructor
     * Init instance vars and call init()
     * @param container the DOM element on which to apply the plugin
     * @param options the complete options to use
     */
    var Mapael = function(container, options) {
        var self = this;

        // the global container (DOM element object)
        self.container = container;

        // the global container (jQuery object)
        self.$container = $(container);

        // the global options
        self.options = options;

        // Version number
        self.version = version;

        // zoom TimeOut handler (used to set and clear)
        self.zoomTO = 0;

        // zoom center coordinate (set at touchstart)
        self.zoomCenterX = 0;
        self.zoomCenterY = 0;

        // Zoom pinch (set at touchstart and touchmove)
        self.previousPinchDist = 0;

        // Zoom data
        self.zoomData = {
            zoomLevel: 0,
            zoomX: 0,
            zoomY: 0,
            panX: 0,
            panY: 0
        };

        // resize TimeOut handler (used to set and clear)
        self.resizeTO = 0;

        // Panning: tell if panning action is in progress
        self.panning = false;

        // Panning TimeOut handler (used to set and clear)
        self.panningTO = 0;

        // Animate view box Interval handler (used to set and clear)
        self.animationIntervalID = null;

        // Map subcontainer jQuery object
        self.$map = {};

        // The tooltip jQuery object
        self.$tooltip = {};

        // The paper Raphael object
        self.paper = {};

        // The areas object list
        self.areas = {};

        // The plots object list
        self.plots = {};

        // The links object list
        self.links = {};

        // The map configuration object (taken from map file)
        self.mapConf = {};

        // Let's start the initialization
        self.init();
    };

    /*
     * Mapael Prototype
     * Defines all functions needed by Mapael
     */
    Mapael.prototype = {

        /*
         * Initialize the plugin
         * Called by the constructor
         */
        init: function() {
            var self = this;

            // Init check for class existence
            if (self.options.map.cssClass === "" || $("." + self.options.map.cssClass, self.container).length === 0) {
                throw new Error("The map class `" + self.options.map.cssClass + "` doesn't exists");
            }

            // Create the tooltip container
            self.$tooltip = $("<div>").addClass(self.options.map.tooltip.cssClass).css("display", "none");

            // Get the map container, empty it then append tooltip
            self.$map = $("." + self.options.map.cssClass, self.container).empty().append(self.$tooltip);

            // Get the map from $.mapael or $.fn.mapael (backward compatibility)
            if ($[pluginName] && $[pluginName].maps && $[pluginName].maps[self.options.map.name]) {
                // Mapael version >= 2.x
                self.mapConf = $[pluginName].maps[self.options.map.name];
            } else if ($.fn[pluginName] && $.fn[pluginName].maps && $.fn[pluginName].maps[self.options.map.name]) {
                // Mapael version <= 1.x - DEPRECATED
                self.mapConf = $.fn[pluginName].maps[self.options.map.name];
                if (window.console && window.console.warn) {
                    window.console.warn("Extending $.fn.mapael is deprecated (map '" + self.options.map.name + "')");
                }
            } else {
                throw new Error("Unknown map '" + self.options.map.name + "'");
            }

            // Create Raphael paper
            self.paper = new Raphael(self.$map[0], self.mapConf.width, self.mapConf.height);

            // add plugin class name on element
            self.$container.addClass(pluginName);

            if (self.options.map.tooltip.css) self.$tooltip.css(self.options.map.tooltip.css);
            self.paper.setViewBox(0, 0, self.mapConf.width, self.mapConf.height, false);

            // Draw map areas
            $.each(self.mapConf.elems, function(id) {
                var elemOptions = self.getElemOptions(
                    self.options.map.defaultArea
                    , (self.options.areas[id] ? self.options.areas[id] : {})
                    , self.options.legend.area
                );
                self.areas[id] = {"mapElem" : self.paper.path(self.mapConf.elems[id]).attr(elemOptions.attrs)};
            });

            // Hook that allows to add custom processing on the map
            if (self.options.map.beforeInit) self.options.map.beforeInit(self.$container, self.paper, self.options);

            // Init map areas in a second loop (prevent texts to be hidden by map elements)
            $.each(self.mapConf.elems, function(id) {
                var elemOptions = self.getElemOptions(
                    self.options.map.defaultArea
                    , (self.options.areas[id] ? self.options.areas[id] : {})
                    , self.options.legend.area
                );
                self.initElem(self.areas[id], elemOptions, id);
            });

            // Draw links
            self.links = self.drawLinksCollection(self.options.links);

            // Draw plots
            $.each(self.options.plots, function(id) {
                self.plots[id] = self.drawPlot(id);
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
            self.$container.on("zoom." + pluginName, function(e, zoomOptions) {
                var newLevel = Math.min(Math.max(zoomOptions.level, 0), self.options.map.zoom.maxLevel)
                    , panX = 0
                    , panY = 0
                    , previousZoomLevel = (1 + self.zoomData.zoomLevel * self.options.map.zoom.step)
                    , zoomLevel = (1 + newLevel * self.options.map.zoom.step)
                    , animDuration = (zoomOptions.animDuration !== undefined) ? zoomOptions.animDuration : self.options.map.zoom.animDuration
                    , offsetX = 0
                    , offsetY = 0
                    , coords = {};

                if (zoomOptions.latitude !== undefined && zoomOptions.longitude !== undefined) {
                    coords = self.mapConf.getCoords(zoomOptions.latitude, zoomOptions.longitude);
                    zoomOptions.x = coords.x;
                    zoomOptions.y = coords.y;
                }

                if (zoomOptions.x === undefined)
                    zoomOptions.x = self.paper._viewBox[0] + self.paper._viewBox[2] / 2;

                if (zoomOptions.y === undefined)
                    zoomOptions.y = (self.paper._viewBox[1] + self.paper._viewBox[3] / 2);

                if (newLevel === 0) {
                    panX = 0;
                    panY = 0;
                } else if (zoomOptions.fixedCenter !== undefined && zoomOptions.fixedCenter === true) {
                    offsetX = self.zoomData.panX + ((zoomOptions.x - self.zoomData.panX) * (zoomLevel - previousZoomLevel)) / zoomLevel;
                    offsetY = self.zoomData.panY + ((zoomOptions.y - self.zoomData.panY) * (zoomLevel - previousZoomLevel)) / zoomLevel;

                    panX = Math.min(Math.max(0, offsetX), (self.mapConf.width - (self.mapConf.width / zoomLevel)));
                    panY = Math.min(Math.max(0, offsetY), (self.mapConf.height - (self.mapConf.height / zoomLevel)));
                } else {
                    panX = Math.min(Math.max(0, zoomOptions.x - (self.mapConf.width / zoomLevel)/2), (self.mapConf.width - (self.mapConf.width / zoomLevel)));
                    panY = Math.min(Math.max(0, zoomOptions.y - (self.mapConf.height / zoomLevel)/2), (self.mapConf.height - (self.mapConf.height / zoomLevel)));
                }

                // Update zoom level of the map
                if (zoomLevel == previousZoomLevel && panX == self.zoomData.panX && panY == self.zoomData.panY) return;

                if (animDuration > 0) {
                    self.animateViewBox(panX, panY, self.mapConf.width / zoomLevel, self.mapConf.height / zoomLevel, animDuration, self.options.map.zoom.animEasing);
                } else {
                    self.paper.setViewBox(panX, panY, self.mapConf.width / zoomLevel, self.mapConf.height / zoomLevel);
                    clearTimeout(self.zoomTO);
                    self.zoomTO = setTimeout(function(){self.$map.trigger("afterZoom", {x1 : panX, y1 : panY, x2 : (panX+(self.mapConf.width / zoomLevel)), y2 : (panY+(self.mapConf.height / zoomLevel))});}, 150);
                }

                $.extend(self.zoomData, {
                    zoomLevel: newLevel,
                    panX: panX,
                    panY: panY,
                    zoomX: panX + self.paper._viewBox[2] / 2,
                    zoomY: panY + self.paper._viewBox[3] / 2
                });
            });

            if (self.options.map.zoom.enabled) {
            /*
            * Update the zoom level of the map on mousewheel
            */
                if (self.options.map.zoom.mousewheel) {
                    self.$map.on("mousewheel." + pluginName, function(e) {
                        var offset = self.$map.offset(),
                            initFactor = (self.options.map.width) ? (self.mapConf.width / self.options.map.width) : (self.mapConf.width / self.$map.width())
                            , zoomLevel = (e.deltaY > 0) ? 1 : -1
                            , zoomFactor = 1 / (1 + (self.zoomData.zoomLevel) * self.options.map.zoom.step)
                            , x = zoomFactor * initFactor * (e.clientX + $(window).scrollLeft() - offset.left) + self.zoomData.panX
                            , y = zoomFactor * initFactor * (e.clientY + $(window).scrollTop() - offset.top) + self.zoomData.panY;

                        self.$container.trigger("zoom." + pluginName, {"fixedCenter" : true, "level" : self.zoomData.zoomLevel + zoomLevel, "x" : x, "y" : y});

                        return false;
                    });
                }

                /*
                 * Update the zoom level of the map on touch pinch
                 */
                if (self.options.map.zoom.touch) {
                    self.$map.on("touchstart." + pluginName, function(e) {
                        if (e.originalEvent.touches.length === 2) {
                            self.zoomCenterX = (e.originalEvent.touches[0].clientX + e.originalEvent.touches[1].clientX) / 2;
                            self.zoomCenterY = (e.originalEvent.touches[0].clientY + e.originalEvent.touches[1].clientY) / 2;
                            self.previousPinchDist = Math.sqrt(Math.pow((e.originalEvent.touches[1].clientX - e.originalEvent.touches[0].clientX), 2) + Math.pow((e.originalEvent.touches[1].clientY - e.originalEvent.touches[0].clientY), 2));
                        }
                    });

                    self.$map.on("touchmove." + pluginName, function(e) {
                        var offset = 0, initFactor = 0, zoomFactor = 0, x = 0, y = 0, pinchDist = 0, zoomLevel = 0;

                        if (e.originalEvent.touches.length === 2) {
                            pinchDist = Math.sqrt(Math.pow((e.originalEvent.touches[1].clientX - e.originalEvent.touches[0].clientX), 2) + Math.pow((e.originalEvent.touches[1].clientY - e.originalEvent.touches[0].clientY), 2));

                            if (Math.abs(pinchDist - self.previousPinchDist) > 15) {
                                offset = self.$map.offset();
                                initFactor = (self.options.map.width) ? (self.mapConf.width / self.options.map.width) : (self.mapConf.width / self.$map.width());
                                zoomFactor = 1 / (1 + (self.zoomData.zoomLevel) * self.options.map.zoom.step);
                                x = zoomFactor * initFactor * (self.zoomCenterX + $(window).scrollLeft() - offset.left) + self.zoomData.panX;
                                y = zoomFactor * initFactor * (self.zoomCenterY + $(window).scrollTop() - offset.top) + self.zoomData.panY;

                                zoomLevel = (pinchDist - self.previousPinchDist) / Math.abs(pinchDist - self.previousPinchDist);
                                self.$container.trigger("zoom." + pluginName, {"fixedCenter" : true, "level" : self.zoomData.zoomLevel + zoomLevel, "x" : x, "y" : y});
                                self.previousPinchDist = pinchDist;
                            }
                            return false;
                        }
                    });
                }
                // Enable zoom
                self.initZoom(self.mapConf.width, self.mapConf.height, self.options.map.zoom);
            }

            // Set initial zoom
            if (self.options.map.zoom.init !== undefined) {
                if (self.options.map.zoom.init.animDuration === undefined) {
                    self.options.map.zoom.init.animDuration = 0;
                }
                self.$container.trigger("zoom." + pluginName, self.options.map.zoom.init);
            }

            // Create the legends for areas
            self.createLegends("area", self.areas, 1);

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
            self.$container.on("update." + pluginName, function(e, opt) {
                // Abort if opt is undefined
                if (typeof opt !== "object")  return;

                var i = 0
                    , animDuration = (opt.animDuration) ? opt.animDuration : 0
                    // This function remove an element using animation (or not, depending on animDuration)
                    // Used for deletePlotKeys and deleteLinkKeys
                    , fnRemoveElement = function(elem) {
                        // Unset all event handlers
                        self.unsetHover(elem.mapElem, elem.textElem);
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
                        elem.mapElem.animate({"opacity": (elem.mapElem.originalAttrs.opacity !== undefined) ? elem.mapElem.originalAttrs.opacity : 1}, animDuration);

                        if (elem.textElem) {
                            elem.textElem.attr({opacity : 0});
                            elem.textElem.animate({"opacity": (elem.textElem.originalAttrs.opacity !== undefined) ? elem.textElem.originalAttrs.opacity : 1}, animDuration);
                        }
                    };

                if (typeof opt.mapOptions === "object") {
                    if (opt.replaceOptions === true) self.options = $.extend(true, {}, defaultOptions, opt.mapOptions);
                    else $.extend(true, self.options, opt.mapOptions);

                    // IF we update areas, plots or legend, then reset all legend state to "show"
                    if (opt.mapOptions.areas !== undefined || opt.mapOptions.plots !== undefined || opt.mapOptions.legend !== undefined) {
                        $("[data-type='elem']", self.$container).each(function (id, elem) {
                            if ($(elem).attr('data-hidden') === "1") {
                                // Toggle state of element by clicking
                                $(elem).trigger("click." + pluginName, [false, animDuration]);
                            }
                        });
                    }
                }

                // Delete plots by name if deletePlotKeys is array
                if (typeof opt.deletePlotKeys === "object") {
                    for (;i < opt.deletePlotKeys.length; i++) {
                        if (self.plots[opt.deletePlotKeys[i]] !== undefined) {
                            fnRemoveElement(self.plots[opt.deletePlotKeys[i]]);
                            delete self.plots[opt.deletePlotKeys[i]];
                        }
                    }
                // Delete ALL plots if deletePlotKeys is set to "all"
                } else if (opt.deletePlotKeys === "all") {
                    $.each(self.plots, function(id, elem) {
                        fnRemoveElement(elem);
                    });
                    // Empty plots object
                    self.plots = {};
                }

                // Delete links by name if deleteLinkKeys is array
                if (typeof opt.deleteLinkKeys === "object") {
                    for (i = 0;i < opt.deleteLinkKeys.length; i++) {
                        if (self.links[opt.deleteLinkKeys[i]] !== undefined) {
                            fnRemoveElement(self.links[opt.deleteLinkKeys[i]]);
                            delete self.links[opt.deleteLinkKeys[i]];
                        }
                    }
                // Delete ALL links if deleteLinkKeys is set to "all"
                } else if (opt.deleteLinkKeys === "all") {
                    $.each(self.links, function(id, elem) {
                        fnRemoveElement(elem);
                    });
                    // Empty links object
                    self.links = {};
                }

                // New plots
                if (typeof opt.newPlots === "object") {
                    $.each(opt.newPlots, function(id) {
                        if (self.plots[id] === undefined) {
                            self.options.plots[id] = opt.newPlots[id];
                            self.plots[id] = self.drawPlot(id);
                            if (animDuration > 0) {
                                fnShowElement(self.plots[id]);
                            }
                        }
                    });
                }

                // New links
                if (typeof opt.newLinks === "object") {
                    var newLinks = self.drawLinksCollection(opt.newLinks);
                    $.extend(self.links, newLinks);
                    $.extend(self.options.links, opt.newLinks);
                    if (animDuration > 0) {
                        $.each(newLinks, function(id) {
                            fnShowElement(newLinks[id]);
                        });
                    }
                }

                // Update areas attributes and tooltips
                $.each(self.areas, function(id) {
                    var elemOptions = self.getElemOptions(
                        self.options.map.defaultArea
                        , (self.options.areas[id] ? self.options.areas[id] : {})
                        , self.options.legend.area
                    );

                    self.updateElem(elemOptions, self.areas[id], animDuration);
                });

                // Update plots attributes and tooltips
                $.each(self.plots, function(id) {
                    var elemOptions = self.getElemOptions(
                        self.options.map.defaultPlot
                        , (self.options.plots[id] ? self.options.plots[id] : {})
                        , self.options.legend.plot
                    );
                    if (elemOptions.type == "square") {
                        elemOptions.attrs.width = elemOptions.size;
                        elemOptions.attrs.height = elemOptions.size;
                        elemOptions.attrs.x = self.plots[id].mapElem.attrs.x - (elemOptions.size - self.plots[id].mapElem.attrs.width) / 2;
                        elemOptions.attrs.y = self.plots[id].mapElem.attrs.y - (elemOptions.size - self.plots[id].mapElem.attrs.height) / 2;
                    } else if (elemOptions.type == "image") {
                        elemOptions.attrs.width = elemOptions.width;
                        elemOptions.attrs.height = elemOptions.height;
                        elemOptions.attrs.x = self.plots[id].mapElem.attrs.x - (elemOptions.width - self.plots[id].mapElem.attrs.width) / 2;
                        elemOptions.attrs.y = self.plots[id].mapElem.attrs.y - (elemOptions.height - self.plots[id].mapElem.attrs.height) / 2;
                    } else { // Default : circle
                        elemOptions.attrs.r = elemOptions.size / 2;
                    }

                    self.updateElem(elemOptions, self.plots[id], animDuration);
                });

                // Update links attributes and tooltips
                $.each(self.links, function(id) {
                    var elemOptions = self.getElemOptions(
                        self.options.map.defaultLink
                        , (self.options.links[id] ? self.options.links[id] : {})
                        , {}
                    );

                    self.updateElem(elemOptions, self.links[id], animDuration);
                });

                // Update legends
                if (opt.mapOptions && typeof opt.mapOptions.legend === "object") {
                    self.createLegends("area", self.areas, 1);
                    if (self.options.map.width) {
                        self.createLegends("plot", self.plots, (self.options.map.width / self.mapConf.width));
                    } else {
                        self.createLegends("plot", self.plots, (self.$map.width() / self.mapConf.width));
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
                        var $legend = self.$container.find("." + legendCSSClass)[0];
                        if ($legend !== undefined) {
                            // Select all elem inside this legend
                            $("[data-type='elem']", $legend).each(function(id, elem) {
                                if (($(elem).attr('data-hidden') === "0" && action === "hide") ||
                                    ($(elem).attr('data-hidden') === "1" && action === "show")) {
                                    // Toggle state of element by clicking
                                    $(elem).trigger("click." + pluginName, [false, animDuration]);
                                }
                            });
                        }
                    });
                } else {
                    // setLegendElemsState is a string, or is undefined
                    // Default : "show"
                    var action = (opt.setLegendElemsState === "hide") ? "hide" : "show";

                    $("[data-type='elem']", self.$container).each(function(id, elem) {
                        if (($(elem).attr('data-hidden') === "0" && action === "hide") ||
                            ($(elem).attr('data-hidden') === "1" && action === "show")) {
                            // Toggle state of element by clicking
                            $(elem).trigger("click." + pluginName, [false, animDuration]);
                        }
                    });
                }
                if (opt.afterUpdate) opt.afterUpdate(self.$container, self.paper, self.areas, plots, self.options);
            });

            // Handle resizing of the map
            if (self.options.map.width) {
                self.paper.setSize(self.options.map.width, self.mapConf.height * (self.options.map.width / self.mapConf.width));

                // Create the legends for plots taking into account the scale of the map
                self.createLegends("plot", self.plots, (self.options.map.width / self.mapConf.width));
            } else {
                $(window).on("resize." + pluginName, function() {
                    clearTimeout(self.resizeTO);
                    self.resizeTO = setTimeout(function(){self.$map.trigger("resizeEnd." + pluginName);}, 150);
                });

                // Create the legends for plots taking into account the scale of the map
                var createPlotLegend = function() {
                    self.createLegends("plot", self.plots, (self.$map.width() / self.mapConf.width));

                    self.$map.off("resizeEnd." + pluginName, createPlotLegend);
                };

                self.$map.on("resizeEnd." + pluginName, function() {
                    var containerWidth = self.$map.width();
                    if (self.paper.width != containerWidth) {
                        self.paper.setSize(containerWidth, self.mapConf.height * (containerWidth / self.mapConf.width));
                    }
                }).on("resizeEnd." + pluginName, createPlotLegend).trigger("resizeEnd." + pluginName);
            }

            // Hook that allows to add custom processing on the map
            if (self.options.map.afterInit) self.options.map.afterInit(self.$container, self.paper, self.areas, self.plots, self.options);

            $(self.paper.desc).append(" and Mapael (http://www.vincentbroute.fr/mapael/)");
        },

        /*
         * Init the element "elem" on the map (drawing, setting attributes, events, tooltip, ...)
         */
        initElem: function(elem, elemOptions, id) {
            var self = this;
            var bbox = {}, textPosition = {};
            if (elemOptions.value !== undefined)
                elem.value = elemOptions.value;

            // Init attrsHover
            self.setHoverOptions(elem.mapElem, elemOptions.attrs, elemOptions.attrsHover);

            // Init the label related to the element
            if (elemOptions.text && elemOptions.text.content !== undefined) {
                // Set a text label in the area
                bbox = elem.mapElem.getBBox();
                textPosition = self.getTextPosition(bbox, elemOptions.text.position, elemOptions.text.margin);
                elemOptions.text.attrs["text-anchor"] = textPosition.textAnchor;
                elem.textElem = self.paper.text(textPosition.x, textPosition.y, elemOptions.text.content).attr(elemOptions.text.attrs);
                self.setHoverOptions(elem.textElem, elemOptions.text.attrs, elemOptions.text.attrsHover);
                if (elemOptions.eventHandlers) self.setEventHandlers(id, elemOptions, elem.mapElem, elem.textElem);
                self.setHover(elem.mapElem, elem.textElem);
                $(elem.textElem.node).attr("data-id", id);
            } else {
                if (elemOptions.eventHandlers) self.setEventHandlers(id, elemOptions, elem.mapElem);
                self.setHover(elem.mapElem);
            }

            // Init the tooltip
            if (elemOptions.tooltip) {
                elem.mapElem.tooltip = elemOptions.tooltip;
                self.setTooltip(elem.mapElem);

                if (elemOptions.text && elemOptions.text.content !== undefined) {
                    elem.textElem.tooltip = elemOptions.tooltip;
                    self.setTooltip(elem.textElem);
                }
            }

            // Init the link
            if (elemOptions.href) {
                elem.mapElem.href = elemOptions.href;
                elem.mapElem.target = elemOptions.target;
                self.setHref(elem.mapElem);

                if (elemOptions.text && elemOptions.text.content !== undefined) {
                    elem.textElem.href = elemOptions.href;
                    elem.textElem.target = elemOptions.target;
                    self.setHref(elem.textElem);
                }
            }

            $(elem.mapElem.node).attr("data-id", id);
        },

        /*
         * Draw all links between plots on the paper
         */
        drawLinksCollection: function(linksCollection) {
            var self = this;
            var p1 = {}
                , p2 = {}
                , coordsP1 = {}
                , coordsP2 ={}
                , links = {};

            $.each(linksCollection, function(id) {
                var elemOptions = self.getElemOptions(self.options.map.defaultLink, linksCollection[id], {});

                if (typeof linksCollection[id].between[0] == 'string') {
                    p1 = self.options.plots[linksCollection[id].between[0]];
                } else {
                    p1 = linksCollection[id].between[0];
                }

                if (typeof linksCollection[id].between[1] == 'string') {
                    p2 = self.options.plots[linksCollection[id].between[1]];
                } else {
                    p2 = linksCollection[id].between[1];
                }

                if (p1.latitude !== undefined && p1.longitude !== undefined) {
                    coordsP1 = self.mapConf.getCoords(p1.latitude, p1.longitude);
                } else {
                    coordsP1.x = p1.x;
                    coordsP1.y = p1.y;
                }

                if (p2.latitude !== undefined && p2.longitude !== undefined) {
                    coordsP2 = self.mapConf.getCoords(p2.latitude, p2.longitude);
                } else {
                    coordsP2.x = p2.x;
                    coordsP2.y = p2.y;
                }
                links[id] = self.drawLink(id, coordsP1.x, coordsP1.y, coordsP2.x, coordsP2.y, elemOptions);
            });
            return links;
        },

        /*
         * Draw a curved link between two couples of coordinates a(xa,ya) and b(xb, yb) on the paper
         */
        drawLink: function(id, xa, ya, xb, yb, elemOptions) {
            var self = this;
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

            elem.mapElem = self.paper.path("m "+xa+","+ya+" C "+x+","+y+" "+xb+","+yb+" "+xb+","+yb+"").attr(elemOptions.attrs);
            self.initElem(elem, elemOptions, id);

            return elem;
        },

        /*
         * Update the element "elem" on the map with the new elemOptions options
         */
        updateElem: function(elemOptions, elem, animDuration) {
            var self = this;
            var bbox, textPosition, plotOffsetX, plotOffsetY;
            if (elemOptions.value !== undefined)
                elem.value = elemOptions.value;

            // Update the label
            if (elem.textElem) {
                if (elemOptions.text !== undefined && elemOptions.text.content !== undefined && elemOptions.text.content != elem.textElem.attrs.text)
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

                textPosition = self.getTextPosition(bbox, elemOptions.text.position, elemOptions.text.margin);
                if (textPosition.x != elem.textElem.attrs.x || textPosition.y != elem.textElem.attrs.y) {
                    if (animDuration > 0) {
                        elem.textElem.attr({"text-anchor" : textPosition.textAnchor});
                        elem.textElem.animate({x : textPosition.x, y : textPosition.y}, animDuration);
                    } else
                        elem.textElem.attr({x : textPosition.x, y : textPosition.y, "text-anchor" : textPosition.textAnchor});
                }

                self.setHoverOptions(elem.textElem, elemOptions.text.attrs, elemOptions.text.attrsHover);
                if (animDuration > 0)
                    elem.textElem.animate(elemOptions.text.attrs, animDuration);
                else
                    elem.textElem.attr(elemOptions.text.attrs);
            }

            // Update elements attrs and attrsHover
            self.setHoverOptions(elem.mapElem, elemOptions.attrs, elemOptions.attrsHover);
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
                if (elem.mapElem.tooltip === undefined) {
                    self.setTooltip(elem.mapElem);
                    if (elem.textElem) self.setTooltip(elem.textElem);
                }
                elem.mapElem.tooltip = elemOptions.tooltip;
                if (elem.textElem) elem.textElem.tooltip = elemOptions.tooltip;
            }

            // Update the link
            if (elemOptions.href !== undefined) {
                if (elem.mapElem.href === undefined) {
                    self.setHref(elem.mapElem);
                    if (elem.textElem) self.setHref(elem.textElem);
                }
                elem.mapElem.href = elemOptions.href;
                elem.mapElem.target = elemOptions.target;
                if (elem.textElem) {
                    elem.textElem.href = elemOptions.href;
                    elem.textElem.target = elemOptions.target;
                }
            }
        },

        /*
         * Draw the plot
         */
        drawPlot: function(id) {
            var self = this;
            var plot = {}
                , coords = {}
                , elemOptions = self.getElemOptions(
                    self.options.map.defaultPlot
                    , (self.options.plots[id] ? self.options.plots[id] : {})
                    , self.options.legend.plot
                );

            if (elemOptions.x !== undefined && elemOptions.y !== undefined)
                coords = {x : elemOptions.x, y : elemOptions.y};
            else
                coords = self.mapConf.getCoords(elemOptions.latitude, elemOptions.longitude);

            if (elemOptions.type == "square") {
                plot = {"mapElem" : self.paper.rect(
                    coords.x - (elemOptions.size / 2)
                    , coords.y - (elemOptions.size / 2)
                    , elemOptions.size
                    , elemOptions.size
                ).attr(elemOptions.attrs)};
            } else if (elemOptions.type == "image") {
                plot = {
                    "mapElem" : self.paper.image(
                        elemOptions.url
                        , coords.x - elemOptions.width / 2
                        , coords.y - elemOptions.height / 2
                        , elemOptions.width
                        , elemOptions.height
                    ).attr(elemOptions.attrs)
                };
            } else if (elemOptions.type == "svg") {
                plot = {"mapElem" : self.paper.path(elemOptions.path).attr(elemOptions.attrs)};
                plot.mapElem.originalWidth = plot.mapElem.getBBox().width;
                plot.mapElem.originalHeight = plot.mapElem.getBBox().height;
                plot.mapElem.transform("m"+(elemOptions.width / plot.mapElem.originalWidth)+",0,0,"+(elemOptions.height / plot.mapElem.originalHeight)+","+(coords.x - elemOptions.width / 2)+","+(coords.y - elemOptions.height / 2));
            } else { // Default = circle
                plot = {"mapElem" : self.paper.circle(coords.x, coords.y, elemOptions.size / 2).attr(elemOptions.attrs)};
            }

            self.initElem(plot, elemOptions, id);
            return plot;
        },

        /*
         * Set target link on elem
         */
        setHref: function(elem) {
            var self = this;
            elem.attr({cursor : "pointer"});
            $(elem.node).on("click." + pluginName, function() {
                if (!self.panning && elem.href)
                    window.open(elem.href, elem.target);
            });
        },

        /*
         * Set a tooltip for the areas and plots
         * @param elem area or plot element
         * @param content the content to set in the tooltip
         */
        setTooltip: function(elem) {
            var self = this;
            var tooltipTO = 0
                , cssClass = self.$tooltip.attr('class')
                , updateTooltipPosition = function(x, y) {
                    var tooltipPosition = {
                        "left" : Math.min(self.$map.width() - self.$tooltip.outerWidth() - 5, x - self.$map.offset().left + 10),
                        "top" : Math.min(self.$map.height() - self.$tooltip.outerHeight() - 5, y - self.$map.offset().top + 20)
                    };

                    if (elem.tooltip.overflow !== undefined) {
                        if (elem.tooltip.overflow.right !== undefined && elem.tooltip.overflow.right === true) {
                            tooltipPosition.left = x - self.$map.offset().left + 10;
                        }
                        if (elem.tooltip.overflow.bottom !== undefined && elem.tooltip.overflow.bottom === true) {
                            tooltipPosition.top = y - self.$map.offset().top + 20;
                        }
                    }

                    self.$tooltip.css(tooltipPosition);
                };

            $(elem.node).on("mouseover." + pluginName, function(e) {
                tooltipTO = setTimeout(
                    function() {
                        self.$tooltip.attr("class", cssClass);
                        if (elem.tooltip !== undefined) {
                            if (elem.tooltip.content !== undefined) {
                                // if tooltip.content is function, call it. Otherwise, assign it directly.
                                var content = (typeof elem.tooltip.content === "function")? elem.tooltip.content(elem) : elem.tooltip.content;
                                self.$tooltip.html(content).css("display", "block");
                            }
                            if (elem.tooltip.cssClass !== undefined) {
                                self.$tooltip.addClass(elem.tooltip.cssClass);
                            }
                        }
                        updateTooltipPosition(e.pageX, e.pageY);
                    }
                    , 120
                );
            }).on("mouseout." + pluginName, function() {
                clearTimeout(tooltipTO);
                self.$tooltip.css("display", "none");
            }).on("mousemove." + pluginName, function(e) {
                updateTooltipPosition(e.pageX, e.pageY);
            });
        },

        /*
         * Set user defined handlers for events on areas and plots
         * @param id the id of the element
         * @param elemOptions the element parameters
         * @param mapElem the map element to set callback on
         * @param textElem the optional text within the map element
         */
        setEventHandlers: function(id, elemOptions, mapElem, textElem) {
            var self = this;
            $.each(elemOptions.eventHandlers, function(event) {
                (function(event) {
                    $(mapElem.node).on(event, function(e) {
                        if (!self.panning) elemOptions.eventHandlers[event](e, id, mapElem, textElem, elemOptions);
                    });
                    if (textElem) {
                        $(textElem.node).on(event, function(e) {
                            if (!self.panning) elemOptions.eventHandlers[event](e, id, mapElem, textElem, elemOptions);
                        });
                    }
                })(event);
            });
        },

        /*
         * Init zoom and panning for the map
         * @param mapWidth
         * @param mapHeight
        * @param zoom_options
         */
        initZoom: function(mapWidth, mapHeight, zoomOptions) {
            var self = this;
            var $zoomIn = $("<div>").addClass(zoomOptions.zoomInCssClass).html("+")
                , $zoomOut = $("<div>").addClass(zoomOptions.zoomOutCssClass).html("&#x2212;")
                , mousedown = false
                , previousX = 0
                , previousY = 0;

            // Zoom
            $.extend(self.zoomData, {
                zoomLevel: 0,
                panX: 0,
                panY: 0
            });

            self.$map.append($zoomIn).append($zoomOut);

            $zoomIn.on("click." + pluginName, function() {self.$container.trigger("zoom." + pluginName, {"level" : self.zoomData.zoomLevel + 1});});
            $zoomOut.on("click." + pluginName, function() {self.$container.trigger("zoom." + pluginName, {"level" : self.zoomData.zoomLevel - 1});});

            // Panning
            $("body").on("mouseup." + pluginName + (zoomOptions.touch ? " touchend" : ""), function() {
                mousedown = false;
                setTimeout(function () {self.panning = false;}, 50);
            });

            self.$map.on("mousedown." + pluginName + (zoomOptions.touch ? " touchstart" : ""), function(e) {
                if (e.pageX !== undefined) {
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
            }).on("mousemove." + pluginName + (zoomOptions.touch ? " touchmove" : ""), function(e) {
                var currentLevel = self.zoomData.zoomLevel
                    , pageX = 0
                    , pageY = 0;

                if (e.pageX !== undefined) {
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
                    var offsetX = (previousX - pageX) / (1 + (currentLevel * zoomOptions.step)) * (mapWidth / self.paper.width)
                        , offsetY = (previousY - pageY) / (1 + (currentLevel * zoomOptions.step)) * (mapHeight / self.paper.height)
                        , panX = Math.min(Math.max(0, self.paper._viewBox[0] + offsetX), (mapWidth - self.paper._viewBox[2]))
                        , panY = Math.min(Math.max(0, self.paper._viewBox[1] + offsetY), (mapHeight - self.paper._viewBox[3]));

                    if (Math.abs(offsetX) > 5 || Math.abs(offsetY) > 5) {
                        $.extend(self.zoomData, {
                            panX: panX,
                            panY: panY,
                            zoomX: panX + self.paper._viewBox[2] / 2,
                            zoomY: panY + self.paper._viewBox[3] / 2
                        });
                        self.paper.setViewBox(panX, panY, self.paper._viewBox[2], self.paper._viewBox[3]);

                        clearTimeout(self.panningTO);
                        self.panningTO = setTimeout(function(){self.$map.trigger("afterPanning", {x1 : panX, y1 : panY, x2 : (panX+self.paper._viewBox[2]), y2 : (panY+self.paper._viewBox[3])});}, 150);

                        previousX = pageX;
                        previousY = pageY;
                        self.panning = true;
                    }
                    return false;
                }
            });
        },

        /*
         * Draw a legend for areas and / or plots
         * @param legendOptions options for the legend to draw
         * @param legendType the type of the legend : "area" or "plot"
         * @param elems collection of plots or areas on the maps
         * @param legendIndex index of the legend in the conf array
         */
        drawLegend: function (legendOptions, legendType, elems, scale, legendIndex) {
            var self = this;
            var $legend = {}
                , legend_paper = {}
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

                $legend = $("." + legendOptions.cssClass, self.$container).empty();
                legend_paper = new Raphael($legend.get(0));
                height = width = 0;

                // Set the title of the legend
                if(legendOptions.title && legendOptions.title !== "") {
                    title = legend_paper.text(legendOptions.marginLeftTitle, 0, legendOptions.title).attr(legendOptions.titleAttrs);
                    title.attr({y : 0.5 * title.getBBox().height});

                    width = legendOptions.marginLeftTitle + title.getBBox().width;
                    height += legendOptions.marginBottomTitle + title.getBBox().height;
                }

                // Calculate attrs (and width, height and r (radius)) for legend elements, and yCenter for horizontal legends
                for(i = 0, length = legendOptions.slices.length; i < length; ++i) {
                    var current_yCenter = 0;

                    // Check if size is defined. If not, take defaultPlot size
                    if (legendOptions.slices[i].size === undefined)
                        legendOptions.slices[i].size = self.options.map.defaultPlot.size;

                    if (legendOptions.slices[i].legendSpecificAttrs === undefined)
                        legendOptions.slices[i].legendSpecificAttrs = {};

                    sliceAttrs[i] = $.extend(
                        {}
                        , (legendType == "plot") ? self.options.map.defaultPlot.attrs : self.options.map.defaultArea.attrs
                        , legendOptions.slices[i].attrs
                        , legendOptions.slices[i].legendSpecificAttrs
                    );

                    if (legendType == "area") {
                        if (sliceAttrs[i].width === undefined)
                            sliceAttrs[i].width = 30;
                        if (sliceAttrs[i].height === undefined)
                            sliceAttrs[i].height = 20;
                    } else if (legendOptions.slices[i].type == "square") {
                        if (sliceAttrs[i].width === undefined)
                            sliceAttrs[i].width = legendOptions.slices[i].size;
                        if (sliceAttrs[i].height === undefined)
                            sliceAttrs[i].height = legendOptions.slices[i].size;
                    } else if (legendOptions.slices[i].type == "image" || legendOptions.slices[i].type == "svg") {
                        if (sliceAttrs[i].width === undefined)
                            sliceAttrs[i].width = legendOptions.slices[i].width;
                        if (sliceAttrs[i].height === undefined)
                            sliceAttrs[i].height = legendOptions.slices[i].height;
                    } else {
                        if (sliceAttrs[i].r === undefined)
                            sliceAttrs[i].r = legendOptions.slices[i].size / 2;
                    }

                    // Compute yCenter for this legend slice
                    current_yCenter = legendOptions.marginBottomTitle;
                    // Add title height if it exists
                    if (title) {
                        current_yCenter += title.getBBox().height;
                    }
                    if(legendType == "plot" && (legendOptions.slices[i].type === undefined || legendOptions.slices[i].type == "circle")) {
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
                    if (legendOptions.slices[i].display === undefined || legendOptions.slices[i].display === true) {
                        if(legendType == "area") {
                            if (legendOptions.mode == "horizontal") {
                                x = width + legendOptions.marginLeft;
                                y = yCenter - (0.5 * scale * sliceAttrs[i].height);
                            } else {
                                x = legendOptions.marginLeft;
                                y = height;
                            }

                            elem = legend_paper.rect(x, y, scale * (sliceAttrs[i].width), scale * (sliceAttrs[i].height));
                        } else if(legendOptions.slices[i].type == "square") {
                            if (legendOptions.mode == "horizontal") {
                                x = width + legendOptions.marginLeft;
                                y = yCenter - (0.5 * scale * sliceAttrs[i].height);
                            } else {
                                x = legendOptions.marginLeft;
                                y = height;
                            }

                            elem = legend_paper.rect(x, y, scale * (sliceAttrs[i].width), scale * (sliceAttrs[i].height));

                        } else if(legendOptions.slices[i].type == "image" || legendOptions.slices[i].type == "svg") {
                            if (legendOptions.mode == "horizontal") {
                                x = width + legendOptions.marginLeft;
                                y = yCenter - (0.5 * scale * sliceAttrs[i].height);
                            } else {
                                x = legendOptions.marginLeft;
                                y = height;
                            }

                            if (legendOptions.slices[i].type == "image") {
                                elem = legend_paper.image(
                                    legendOptions.slices[i].url, x, y, scale * sliceAttrs[i].width, scale * sliceAttrs[i].height);
                            } else {
                                elem = legend_paper.path(legendOptions.slices[i].path);
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
                            elem = legend_paper.circle(x, y, scale * (sliceAttrs[i].r));
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

                        label = legend_paper.text(x, y, legendOptions.slices[i].label).attr(legendOptions.labelAttrs);

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

                            self.setHoverOptions(elem, sliceAttrs[i], sliceAttrs[i]);
                            self.setHoverOptions(label, legendOptions.labelAttrs, legendOptions.labelAttrsHover);
                            self.setHover(elem, label);
                            self.handleClickOnLegendElem(legendOptions, legendOptions.slices[i], label, elem, elems, legendIndex);
                        }
                    }
                }

                // VMLWidth option allows you to set static width for the legend
                // only for VML render because text.getBBox() returns wrong values on IE6/7
                if (Raphael.type != "SVG" && legendOptions.VMLWidth)
                    width = legendOptions.VMLWidth;

                legend_paper.setSize(width, height);
                return legend_paper;
        },

        /*
         * Allow to hide elements of the map when the user clicks on a related legend item
         * @param legendOptions options for the legend to draw
         * @param sliceOptions options of the slice
         * @param label label of the legend item
         * @param elem element of the legend item
         * @param elems collection of plots or areas displayed on the map
         * @param legendIndex index of the legend in the conf array
         */
        handleClickOnLegendElem: function(legendOptions, sliceOptions, label, elem, elems, legendIndex) {
            var self = this;
            var hideMapElems = function(e, hideOtherElems, animDuration) {
                var elemValue = 0
                    , hidden = $(label.node).attr('data-hidden')
                    , hiddenNewAttr = (hidden === '0') ? {"data-hidden": '1'} : {"data-hidden": '0'};

                // Check animDuration: if not set, this is a regular click, use the value specified in options
                if (animDuration === undefined) animDuration = legendOptions.hideElemsOnClick.animDuration;

                if (hidden === '0') {
                    if (animDuration > 0) label.animate({"opacity":0.5}, animDuration);
                    else label.attr({"opacity":0.5});
                } else {
                    if (animDuration > 0) label.animate({"opacity":1}, animDuration);
                    else label.attr({"opacity":1});
                }

                $.each(elems, function(id) {
                    // Retreive stored data of element
                    //      'hidden-by' contains the list of legendIndex that is hiding this element
                    var hiddenBy = elems[id].mapElem.data('hidden-by');
                    // Set to empty object if undefined
                    if (hiddenBy === undefined) hiddenBy = {};

                    if ($.isArray(elems[id].value)) {
                        elemValue = elems[id].value[legendIndex];
                    } else {
                        elemValue = elems[id].value;
                    }

                    if ((sliceOptions.sliceValue !== undefined && elemValue == sliceOptions.sliceValue)
                        || ((sliceOptions.sliceValue === undefined)
                            && (sliceOptions.min === undefined || elemValue >= sliceOptions.min)
                            && (sliceOptions.max === undefined || elemValue <= sliceOptions.max))
                    ) {
                        (function(id) {
                            if (hidden === '0') { // we want to hide this element
                                hiddenBy[legendIndex] = true; // add legendIndex to the data object for later use
                                if (animDuration > 0) {
                                    elems[id].mapElem.animate({"opacity":legendOptions.hideElemsOnClick.opacity}, animDuration, "linear", function() {
                                        if (legendOptions.hideElemsOnClick.opacity === 0) elems[id].mapElem.hide();
                                    });
                                    if (elems[id].textElem) {
                                        elems[id].textElem.animate({"opacity":legendOptions.hideElemsOnClick.opacity}, animDuration, "linear", function() {
                                            if (legendOptions.hideElemsOnClick.opacity === 0) elems[id].textElem.hide();
                                        });
                                    }
                                } else {
                                    if (legendOptions.hideElemsOnClick.opacity === 0) elems[id].mapElem.hide();
                                    else elems[id].mapElem.attr({"opacity":legendOptions.hideElemsOnClick.opacity});

                                    if (elems[id].textElem) {
                                        if (legendOptions.hideElemsOnClick.opacity === 0) elems[id].textElem.hide();
                                        else elems[id].textElem.animate({"opacity":legendOptions.hideElemsOnClick.opacity});
                                    }
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
                                    if (animDuration > 0) {
                                        elems[id].mapElem.animate({"opacity":elems[id].mapElem.originalAttrs.opacity !== undefined ? elems[id].mapElem.originalAttrs.opacity : 1}, animDuration);
                                        if (elems[id].textElem) elems[id].textElem.animate({"opacity":elems[id].textElem.originalAttrs.opacity !== undefined ? elems[id].textElem.originalAttrs.opacity : 1}, animDuration);
                                    } else {
                                        elems[id].mapElem.attr({"opacity":elems[id].mapElem.originalAttrs.opacity !== undefined ? elems[id].mapElem.originalAttrs.opacity : 1});
                                        if (elems[id].textElem) elems[id].textElem.attr({"opacity":elems[id].textElem.originalAttrs.opacity !== undefined ? elems[id].textElem.originalAttrs.opacity : 1});
                                    }
                                }
                            }
                            // Update elem data with new values
                            elems[id].mapElem.data('hidden-by', hiddenBy);
                        })(id);
                    }
                });

                $(elem.node).attr(hiddenNewAttr);
                $(label.node).attr(hiddenNewAttr);

                if ((hideOtherElems === undefined || hideOtherElems === true)
                    && legendOptions.exclusive !== undefined && legendOptions.exclusive === true
                ) {
                    $("[data-type='elem'][data-hidden=0]", self.$container).each(function() {
                        if ($(this).attr('data-index') !== $(elem.node).attr('data-index')) {
                            $(this).trigger("click." + pluginName, false);
                        }
                    });
                }
            };
            $(label.node).on("click." + pluginName, hideMapElems);
            $(elem.node).on("click." + pluginName, hideMapElems);

            if (sliceOptions.clicked !== undefined && sliceOptions.clicked === true) {
                $(elem.node).trigger("click." + pluginName, false);
            }
        },

        /*
         * Create all legends for a specified type (area or plot)
         * @param legendType the type of the legend : "area" or "plot"
         * @param elems collection of plots or areas displayed on the map
         * @param scale scale ratio of the map
         */
        createLegends: function (legendType, elems, scale) {
            var self = this;
            var legendsOptions = self.options.legend[legendType], legends = [];

            if (!$.isArray(self.options.legend[legendType])) {
                legendsOptions = [self.options.legend[legendType]];
            }

            for (var j = 0; j < legendsOptions.length; ++j) {
                // Check for class existence
                if(legendsOptions[j].cssClass === "" || $("." + legendsOptions[j].cssClass, self.$container).length === 0) {
                    throw new Error("The legend class `" + legendsOptions[j].cssClass + "` doesn't exists.");
                }
                if (legendsOptions[j].display === true && $.isArray(legendsOptions[j].slices) && legendsOptions[j].slices.length > 0) {
                    legends.push(self.drawLegend(legendsOptions[j], legendType, elems, scale, j));
                }
            }
            return legends;
        },

        /*
        * Set the attributes on hover and the attributes to restore for a map element
         * @param elem the map element
         * @param originalAttrs the original attributes to restore on mouseout event
         * @param attrsHover the attributes to set on mouseover event
         */
        setHoverOptions: function (elem, originalAttrs, attrsHover) {
            // Disable transform option on hover for VML (IE<9) because of several bugs
            if (Raphael.type != "SVG") delete attrsHover.transform;
            elem.attrsHover = attrsHover;

            if (elem.attrsHover.transform) elem.originalAttrs = $.extend({transform : "s1"}, originalAttrs);
            else elem.originalAttrs = originalAttrs;
        },

        /*
         * Set the hover behavior (mouseover & mouseout) for plots and areas
         * @param mapElem the map element
         * @param textElem the optional text element (within the map element)
         */
        setHover: function (mapElem, textElem) {
            var self = this;
            var $mapElem = {}
                , $textElem = {}
                , hoverTO = 0
                , overBehaviour = function() {hoverTO = setTimeout(function () {self.elemHover(mapElem, textElem);}, 120);}
                , outBehaviour = function () {clearTimeout(hoverTO);self.elemOut(mapElem, textElem);};

            $mapElem = $(mapElem.node);
            $mapElem.on("mouseover." + pluginName, overBehaviour);
            $mapElem.on("mouseout." + pluginName, outBehaviour);

            if (textElem) {
                $textElem = $(textElem.node);
                $textElem.on("mouseover." + pluginName, overBehaviour);
                $(textElem.node).on("mouseout." + pluginName, outBehaviour);
            }
        },

        /*
         * Remove the hover behavior for plots and areas
         * @param mapElem the map element
         * @param textElem the optional text element (within the map element)
         */
        unsetHover: function (mapElem, textElem) {
            $(mapElem.node).off("." + pluginName);
            if (textElem) $(textElem.node).off("." + pluginName);
        },

        /*
         * Set he behaviour for "mouseover" event
         * @param mapElem mapElem the map element
         * @param textElem the optional text element (within the map element)
         */
        elemHover: function (mapElem, textElem) {
            var self = this;
            // Set mapElem
            if (mapElem.attrsHover.animDuration > 0) mapElem.animate(mapElem.attrsHover, mapElem.attrsHover.animDuration);
            else mapElem.attr(mapElem.attrsHover);
            // Set textElem
            if (textElem) {
                if (textElem.attrsHover.animDuration > 0) textElem.animate(textElem.attrsHover, textElem.attrsHover.animDuration);
                else textElem.attr(textElem.attrsHover);
            }
            // workaround for older version of Raphael
            if (self.paper.safari) self.paper.safari();
        },

        /*
         * Set he behaviour for "mouseout" event
         * @param mapElem the map element
         * @param textElem the optional text element (within the map element)
         */
        elemOut: function (mapElem, textElem) {
            var self = this;
            // Set mapElem
            if (mapElem.attrsHover.animDuration > 0) mapElem.animate(mapElem.originalAttrs, mapElem.attrsHover.animDuration);
            else mapElem.attr(mapElem.originalAttrs);
            // Set textElem
            if (textElem) {
                if (textElem.attrsHover.animDuration > 0) textElem.animate(textElem.originalAttrs, textElem.attrsHover.animDuration);
                else textElem.attr(textElem.originalAttrs);
            }

            // workaround for older version of Raphael
            if (self.paper.safari) self.paper.safari();
        },

        /*
         * Get element options by merging default options, element options and legend options
         * @param defaultOptions
         * @param elemOptions
         * @param legendOptions
         */
        getElemOptions: function(defaultOptions, elemOptions, legendOptions) {
            var self = this;
            var options = $.extend(true, {}, defaultOptions, elemOptions);
            if (options.value !== undefined) {
                if ($.isArray(legendOptions)) {
                    for (var i = 0, length = legendOptions.length;i<length;++i) {
                        options = $.extend(true, {}, options, self.getLegendSlice(options.value[i], legendOptions[i]));
                    }
                } else {
                    options = $.extend(true, {}, options, self.getLegendSlice(options.value, legendOptions));
                }
            }
            return options;
        },

        /*
         * Get the coordinates of the text relative to a bbox and a position
         * @param bbox the boundary box of the element
         * @param textPosition the wanted text position (inner, right, left, top or bottom)
         */
        getTextPosition: function(bbox, textPosition, margin) {
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
        },

        /*
         * Get the legend conf matching with the value
         * @param value the value to match with a slice in the legend
         * @param legend the legend params object
         * @return the legend slice matching with the value
         */
        getLegendSlice: function (value, legend) {
            for(var i = 0, length = legend.slices.length; i < length; ++i) {
                if ((legend.slices[i].sliceValue !== undefined && value == legend.slices[i].sliceValue)
                    || ((legend.slices[i].sliceValue === undefined)
                        && (legend.slices[i].min === undefined || value >= legend.slices[i].min)
                        && (legend.slices[i].max === undefined || value <= legend.slices[i].max))
                ) {
                    return legend.slices[i];
                }
            }
            return {};
        },


        /*
          * Animated view box changes
          * As from http://code.voidblossom.com/animating-viewbox-easing-formulas/,
          * (from https://github.com/theshaun works on mapael)
          * @param x coordinate of the point to focus on
          * @param y coordinate of the point to focus on
          * @param w map defined width
          * @param h map defined height
          * @param duration defined length of time for animation
          * @param easying_function defined Raphael supported easing_formula to use
          * @param callback method when animated action is complete
          */
        animateViewBox: function (x, y, w, h, duration, easingFunction ) {
            var self = this;
            var cx = self.paper._viewBox ? self.paper._viewBox[0] : 0
                , dx = x - cx
                , cy = self.paper._viewBox ? self.paper._viewBox[1] : 0
                , dy = y - cy
                , cw = self.paper._viewBox ? self.paper._viewBox[2] : self.paper.width
                , dw = w - cw
                , ch = self.paper._viewBox ? self.paper._viewBox[3] : self.paper.height
                , dh = h - ch
                , interval = 25
                , steps = duration / interval
                , current_step = 0
                , easingFormula;

            easingFunction = easingFunction || "linear";
            easingFormula = Raphael.easing_formulas[easingFunction];

            clearInterval(self.animationIntervalID);

            self.animationIntervalID = setInterval(function() {
                    var ratio = current_step / steps;
                    self.paper.setViewBox(cx + dx * easingFormula(ratio),
                                          cy + dy * easingFormula(ratio),
                                          cw + dw * easingFormula(ratio),
                                          ch + dh * easingFormula(ratio), false);
                    if (current_step++ >= steps) {
                        clearInterval(self.animationIntervalID);
                        clearTimeout(self.zoomTO);
                        self.zoomTO = setTimeout(function(){self.$map.trigger("afterZoom", {x1 : x, y1 : y, x2 : (x+w), y2 : (y+h)});}, 150);
                    }
                }
                , interval
            );
        }

    };

    // Extend jQuery with Mapael
    $[pluginName] = Mapael;
    // Add jQuery DOM function
    $.fn[pluginName] = function(options) {

        // Extend default options with user options
        options = $.extend(true, {}, defaultOptions, options);

        // Extend legend default options
        $.each(options.legend, function(type) {
            if ($.isArray(options.legend[type])) {
                for (var i = 0; i < options.legend[type].length; ++i)
                    options.legend[type][i] = $.extend(true, {}, legendDefaultOptions[type], options.legend[type][i]);
            } else {
                options.legend[type] = $.extend(true, {}, legendDefaultOptions[type], options.legend[type]);
            }
        });

        // Now that everything is ready, call Mapael on each element
        return this.each(function () {
            // Avoid multiple instanciation
            if ($.data(this, pluginName)) throw new Error("Mapael already exists on this element.");
            // Create Mapael and save it as jQuery data
            // This allow external access to Mapael using $(".mapcontainer").data.mapael
            $.data(this, pluginName, new Mapael(this, options));
        });
    };

}));
