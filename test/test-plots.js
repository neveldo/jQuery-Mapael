/*
 * Unit Test for Mapael
 * Module: Plots
 *
 * Here are tested:
 *      - options.map.defaultPlot
 *      - options.map.plots
 */
$(function() {

    QUnit.module("Plots", CST_MODULE_OPTS);

    QUnit.test("Test adding Image plot", function(assert) {
        var self = this;

        var CST_PLOTS = {
            // Image plot
            'paris': {
                type: "image",
                url: "./marker.png",
                width: 12,
                height: 40,
                latitude: 48.86,
                longitude: 2.3444,
                attrs: {
                    opacity: 0.5
                },
                attrsHover: {
                    transform: "s1.5"
                }
            }
        };

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            },
            plots: CST_PLOTS
        }));

        var $plot_paris = self.$map.find(".map svg image[data-id='paris']");

        /* PARIS PLOT */
        assert.ok($plot_paris[0], "Paris plot: created");
        assert.equal($plot_paris.attr("href"), CST_PLOTS["paris"].url,"Paris plot: URL ok");
        assert.equal($plot_paris.attr("width"), CST_PLOTS["paris"].width,"Paris plot: width ok");
        assert.equal($plot_paris.attr("height"), CST_PLOTS["paris"].height,"Paris plot: height ok");
        assert.equal($plot_paris.attr("opacity"), CST_PLOTS["paris"].attrs.opacity,"Paris plot: opacity ok");

    });


    QUnit.test("Test adding SVG plots", function(assert) {
        var self = this;

        var CST_PLOTS = {
            // SVG plot
            'limoge': {
                type: "svg",
                path: "M 24.267286,27.102843 15.08644,22.838269 6.3686216,27.983579 7.5874348,17.934248 0,11.2331 9.9341158,9.2868473 13.962641,0 l 4.920808,8.8464793 10.077199,0.961561 -6.892889,7.4136777 z",
                latitude: 45.8188276,
                longitude: 1.1060351,
                attrs: {
                    opacity: 0.9
                }
            }
        };

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            },
            plots: CST_PLOTS
        }));

        var $plot_limoge = self.$map.find(".map svg path[data-id='limoge']");

        /* LIMOGE PLOT */
        assert.ok($plot_limoge[0], "limoge plot: created");
        // Not working: path seems to be modified ?
        // assert.equal($plot_limoge.attr("d"), CST_PLOTS["limoge"].path.replace(/\s/g, ''),"limoge plot: Path ok");
        assert.equal($plot_limoge.attr("opacity"), CST_PLOTS["limoge"].attrs.opacity,"limoge plot: opacity ok");

    });


    QUnit.test("Test adding Cicle plots", function(assert) {
        var self = this;

        var CST_PLOTS = {
            // Circle plot
            'lyon': {
                type: "circle",
                size: 50,
                latitude: 45.758888888889,
                longitude: 4.8413888888889
            },
            'bordeaux': {
                type: "circle",
                size: 30,
                latitude: 44.834763,
                longitude: -0.580991
            }
        };

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            },
            plots: CST_PLOTS
        }));

        var $plot_lyon = self.$map.find(".map svg circle[data-id='lyon']");
        var $plot_bordeaux = self.$map.find(".map svg circle[data-id='bordeaux']");

        /* LYON PLOT */
        assert.ok($plot_lyon[0], "lyon plot: created");
        assert.equal($plot_lyon.attr("r"), CST_PLOTS["lyon"].size / 2,"lyon plot: Rayon ok");

        /* BORDEAUX PLOT */
        assert.ok($plot_bordeaux[0], "bordeaux plot: created");
        assert.equal($plot_bordeaux.attr("r"), CST_PLOTS["bordeaux"].size / 2,"bordeaux plot: Rayon ok");

    });


    QUnit.test("Test adding Square plots", function(assert) {
        var self = this;

        var CST_PLOTS = {
            // Square plot
            'rennes': {
                type: "square",
                size: 20,
                latitude: 48.114166666667,
                longitude: -1.6808333333333
            }
        };

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            },
            plots: CST_PLOTS
        }));

        var $plot_rennes = self.$map.find(".map svg rect[data-id='rennes']");

        /* RENNES PLOT */
        assert.ok($plot_rennes[0], "rennes plot: created");
        assert.equal($plot_rennes.attr("width"), CST_PLOTS["rennes"].size,"rennes plot: width ok");
        assert.equal($plot_rennes.attr("height"), CST_PLOTS["rennes"].size,"rennes plot: height ok");

    });


    QUnit.test("Test adding X,Y plots", function(assert) {
        var self = this;

        var CST_PLOTS = {
            // Plot positioned by x and y instead of latitude, longitude
            'plotxy': {
                x: 300,
                y: 200
            }
        };

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            },
            plots: CST_PLOTS
        }));

        var $plot_plotxy = self.$map.find(".map svg circle[data-id='plotxy']");

        /* PLOTXY PLOT */
        assert.ok($plot_plotxy[0], "plotxy plot: created");
        assert.equal($plot_plotxy.attr("cx"), CST_PLOTS["plotxy"].x,"plotxy plot: X ok");
        assert.equal($plot_plotxy.attr("cy"), CST_PLOTS["plotxy"].y,"plotxy plot: Y ok");

    });


    QUnit.test("Test adding plots with text", function(assert) {
        var self = this;

        var CST_PLOTS = {
            // Circle plot
            'lyon': {
                type: "circle",
                size: 50,
                latitude: 45.758888888889,
                longitude: 4.8413888888889,
                tooltip: {content: "<span style=\"font-weight:bold;\">City :</span> Lyon <br /> Rhône-Alpes"},
                text: {content: "Lyon"}
            },
            // Square plot
            'rennes': {
                type: "square",
                size: 20,
                latitude: 48.114166666667,
                longitude: -1.6808333333333,
                tooltip: {content: "<span style=\"font-weight:bold;\">City :</span> Rennes <br /> Bretagne"},
                text: {content: "Rennes"}
            },
            // Plot positioned by x and y instead of latitude, longitude
            'plotxy': {
                x: 300,
                y: 200,
                text: {
                    content: "My plot"
                    , position: "bottom"
                    , attrs: {"font-size": 10, fill: "#004a9b", opacity: 0.6}
                    , attrsHover: {fill: "#004a9b", opacity: 1}
                },
            },
            'bordeaux': {
                type: "circle",
                size: 30,
                latitude: 44.834763,
                longitude: -0.580991,
                text: {
                    content: "33",
                    position: "inner",
                    attrs: {
                        "font-size": 16,
                        "font-weight": "bold",
                        fill: "#ffffff"
                    },
                    attrsHover: {
                        "font-size": 16,
                        "font-weight": "bold",
                        fill: "#ffffff"
                    }
                }
            }
        };

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            },
            plots: CST_PLOTS
        }));

        var $plot_lyon = self.$map.find(".map svg circle[data-id='lyon']");
        var $plot_rennes = self.$map.find(".map svg rect[data-id='rennes']");
        var $plot_plotxy = self.$map.find(".map svg circle[data-id='plotxy']");
        var $plot_bordeaux = self.$map.find(".map svg circle[data-id='bordeaux']");

        var $plot_txt_lyon = self.$map.find(".map svg text[data-id='lyon']");
        var $plot_txt_rennes = self.$map.find(".map svg text[data-id='rennes']");
        var $plot_txt_plotxy = self.$map.find(".map svg text[data-id='plotxy']");
        var $plot_txt_bordeaux = self.$map.find(".map svg text[data-id='bordeaux']");

        /* LYON PLOT TEXT */
        assert.ok($plot_txt_lyon[0], "lyon text: created");
        assert.equal($("tspan", $plot_txt_lyon).text(), CST_PLOTS["lyon"].text.content, "lyon text: content ok");

        /* RENNES PLOT TEXT */
        assert.ok($plot_txt_rennes[0], "rennes text: created");
        assert.equal($("tspan", $plot_txt_rennes).text(), CST_PLOTS["rennes"].text.content, "rennes text: content ok");

        /* PLOTXY PLOT TEXT */
        assert.ok($plot_txt_plotxy[0], "plotxy text: created");
        assert.equal($("tspan", $plot_txt_plotxy).text(), CST_PLOTS["plotxy"].text.content, "plotxy text: content ok");
        assert.equal($plot_txt_plotxy.attr("font-size"), CST_PLOTS["plotxy"].text.attrs["font-size"] + "px","plotxy text: font-size ok");
        assert.equal($plot_txt_plotxy.attr("fill"), CST_PLOTS["plotxy"].text.attrs["fill"],"plotxy text: fill ok");
        assert.equal($plot_txt_plotxy.attr("opacity"), CST_PLOTS["plotxy"].text.attrs["opacity"],"plotxy text: opacity ok");

        /* BORDEAUX PLOT TEXT */
        assert.ok($plot_txt_bordeaux[0], "bordeaux text: created");
        assert.equal($("tspan", $plot_txt_bordeaux).text(), CST_PLOTS["bordeaux"].text.content, "bordeaux text: content ok");
        assert.equal($plot_txt_bordeaux.attr("font-size"), CST_PLOTS["bordeaux"].text.attrs["font-size"] + "px","bordeaux text: font-size ok");
        assert.equal($plot_txt_bordeaux.attr("font-weight"), CST_PLOTS["bordeaux"].text.attrs["font-weight"],"bordeaux text: font-weight ok");
        assert.equal($plot_txt_bordeaux.attr("fill"), CST_PLOTS["bordeaux"].text.attrs["fill"],"bordeaux text: fill ok");

    });

});
