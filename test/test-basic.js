/*
 * Unit Test for Mapael
 * Module: Basic
 *
 * Here are tested:
 *      - Basic map creation/destruction
 *      - Basic map interaction
 *      - options.map.name
 */
$(function() {

    QUnit.module("Basic", CST_MODULE_OPTS);

    QUnit.test("Default instance creation", function(assert) {
        var self = this;

        /* Create the basic map! */
        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            }
        }));

        /* Some basic checks */
        assert.ok(self.$map.find(".map svg")[0], "SVG map created" );
        assert.ok(self.$map.find(".map svg path")[0], "Path in SVG map" );
        assert.equal(self.$map.find(".map svg path").length, CST_NB_OF_FRANCE_DPTMT, "All France department drawn" );
        assert.equal(self.$map.find(".map svg").attr("width"), CST_MAP_MAX_WIDTH, "Check map width size" );
        assert.equal(self.$map.find(".map svg").attr("height"), CST_MAP_MAX_HEIGHT, "Check map height size" );
        assert.ok(self.$map.hasClass("mapael"), "Has mapael class" );
        assert.ok(typeof self.$map.data("mapael") === "object", "Has mapael data" );
        assert.ok(self.$map.find(".map .mapTooltip")[0], "Has tooltip div" );

    });

    QUnit.test("Instance destruction", function(assert) {
        var self = this;

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: { name: "france_departments" }
        }));

        assert.ok(self.$map.find("svg")[0], "Map existing" );

        self.$map.data("mapael").destroy();

        assert.notOk(self.$map.find(".map svg")[0], "SVG map not created" );
        assert.notOk(self.$map.hasClass("mapael"), "Has not mapael class" );
        assert.notOk(typeof self.$map.data("mapael") === "object", "Has not mapael data" );
        assert.notOk(self.$map.find(".map .mapTooltip")[0], "Has not tooltip div" );
    });

    QUnit.test("Instance creation: existing map", function(assert) {
        var self = this;

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: { name: "france_departments" }
        }));

        assert.ok(self.$map.find("svg")[0], "First map existing" );

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: { name: "france_departments" }
        }));

        assert.ok(self.$map.find("svg")[0], "Second map existing" );
    });

    QUnit.test("Creation fail: wrong map", function(assert) {
        var self = this;

        /* Error if wrong map name */
        assert.throws(function(){
            self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
                map: { name: "not_existing_map" }
            }));
        }, "Throw error" );

        assert.notOk(self.$map.find("svg")[0], "Map not existing" );

    });

    QUnit.test("Creation fail: hidden map", function(assert) {
        var self = this;

        $(".container").hide();

        /* Error if map is hidden */
        assert.throws(function(){
            self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
                map: { name: "france_departments" }
            }));
        }, "Throw error" );

        assert.notOk(self.$map.find("svg")[0], "Map not existing" );

    });

    QUnit.test("Mouseover", function(assert) {
        var self = this;
        var mouseover_async_done = assert.async(CST_NB_OF_HOVER_CHECK);

        /* Create the map */
        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            }
        }));

        /* mouseover event check (background changement) */
        var default_fill = self.$map.find("svg path:first").attr("fill");
        var counter = 0;
        self.$map.find("svg path").slice(0, CST_NB_OF_HOVER_CHECK).each(function(id, elem) {
            var $elem = $(elem);
            setTimeout(function() {
                $elem.trigger("mouseover");
                setTimeout(function() {
                    var new_fill = $elem.attr("fill");
                    assert.notEqual(default_fill, new_fill, "Check new background" );
                    assert.ok(self.$map.find(".map .mapTooltip").is( ":hidden" ), "Check tooltip hidden" );

                    $elem.trigger("mouseout");
                    setTimeout(function() {
                        var new_fill = $elem.attr("fill");
                        assert.equal(new_fill, default_fill, "Check old background" );
                        mouseover_async_done();
                    }, CST_MOUSEOVER_TIMEOUT_MS);
                }, CST_MOUSEOVER_TIMEOUT_MS);
            }, counter * (CST_MOUSEOVER_TIMEOUT_MS * 2));
            counter++;
        });

    });

    QUnit.test("Responsive", function(assert) {
        var self = this;
        var responsive_async_done = assert.async();

        /* Create the map */
        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            }
        }));

        /* Responsive checks */
        self.$map.width(CST_MAP_MAX_WIDTH/2);
        $(window).trigger('resize');
        setTimeout(function() {
            var $svg = self.$map.find(".map svg");
            assert.equal($svg.attr("width"), CST_MAP_MAX_WIDTH/2, "Check new map width size" );
            assert.equal($svg.attr("height"), CST_MAP_MAX_HEIGHT/2, "Check new map height size" );

            self.$map.width(CST_MAP_MAX_WIDTH);
            $(window).trigger('resize');
            setTimeout(function() {
                var $svg = self.$map.find(".map svg");
                assert.equal($svg.attr("width"), CST_MAP_MAX_WIDTH, "Check old map width size" );
                assert.equal($svg.attr("height"), CST_MAP_MAX_HEIGHT, "Check old map height size" );
                responsive_async_done();
            }, 500);
        }, 500);

    });

});
