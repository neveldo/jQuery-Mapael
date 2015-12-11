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
    
    QUnit.module("Basic");

    QUnit.test("Default instance creation", function(assert) {

        /* Create the basic map! */
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            }
        }));

        /* Some basic checks */
        assert.ok($(".mapcontainer .map svg")[0], "SVG map created" );
        assert.ok($(".mapcontainer .map svg path")[0], "Path in SVG map" );
        assert.equal($(".mapcontainer .map svg path").length, CST_NB_OF_FRANCE_DPTMT, "All France department drawn" );
        assert.equal($(".mapcontainer .map svg").attr("width"), CST_MAP_MAX_WIDTH, "Check map width size" );
        assert.equal($(".mapcontainer .map svg").attr("height"), CST_MAP_MAX_HEIGHT, "Check map height size" );
        assert.ok($(".mapcontainer").hasClass("mapael"), "Has mapael class" );
        assert.ok(typeof $(".mapcontainer").data("mapael") === "object", "Has mapael data" );
        assert.ok($(".mapcontainer .map .mapTooltip")[0], "Has tooltip div" );

    });
    
    QUnit.test("Instance destruction", function(assert) {
        
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: { name: "france_departments" }
        }));
        
        assert.ok($(".mapcontainer svg")[0], "Map existing" );
        
        $(".mapcontainer").data("mapael").destroy();
        
        assert.notOk($(".mapcontainer .map svg")[0], "SVG map not created" );
        assert.notOk($(".mapcontainer").hasClass("mapael"), "Has not mapael class" );
        assert.notOk(typeof $(".mapcontainer").data("mapael") === "object", "Has not mapael data" );
        assert.notOk($(".mapcontainer .map .mapTooltip")[0], "Has not tooltip div" );
    });
    
    QUnit.test("Instance creation: existing map", function(assert) {
        
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: { name: "france_departments" }
        }));
        
        assert.ok($(".mapcontainer svg")[0], "First map existing" );
        
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: { name: "france_departments" }
        }));
        
        assert.ok($(".mapcontainer svg")[0], "Second map existing" );
    });
    
    QUnit.test("Creation fail: wrong map", function(assert) {

        /* Error if wrong map name */
        assert.throws(function(){
            $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
                map: { name: "not_existing_map" }
            }));
        }, "Throw error" );
        
        assert.notOk($(".mapcontainer svg")[0], "Map not existing" );
        
    });
    
    QUnit.test("Creation fail: hidden map", function(assert) {
        
        $(".container").hide();

        /* Error if map is hidden */
        assert.throws(function(){
            $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
                map: { name: "france_departments" }
            }));
        }, "Throw error" );
        
        assert.notOk($(".mapcontainer svg")[0], "Map not existing" );
        
    });

    QUnit.test("Mouseover", function(assert) {
        var mouseover_async_done = assert.async(CST_NB_OF_FRANCE_DPTMT);
        
        /* Create the map */
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            }
        }));

        /* mouseover event check (background changement) */
        var default_fill = $(".mapcontainer svg path:first").attr("fill");
        $(".mapcontainer svg path").each(function(id, elem) {
            var $elem = $(elem);
            
            $elem.trigger("mouseover");
            setTimeout(function() {
                var new_fill = $elem.attr("fill");
                assert.notEqual(default_fill, new_fill, "Check new background" );
                assert.ok($(".mapcontainer .map .mapTooltip").is( ":hidden" ), "Check tooltip hidden" );
                
                $elem.trigger("mouseout");
                setTimeout(function() {
                    var new_fill = $elem.attr("fill");
                    assert.equal(new_fill, default_fill, "Check old background" );
                    mouseover_async_done();
                }, 500);
            }, 500);
        });
        
    });

    QUnit.test("Responsive", function(assert) {
        var responsive_async_done = assert.async();
        
        /* Create the map */
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            }
        }));
        
        /* Responsive checks */
        $(".mapcontainer").width(CST_MAP_MAX_WIDTH/2);
        $(window).trigger('resize');
        setTimeout(function() {
            var $svg = $(".mapcontainer .map svg");
            assert.equal($svg.attr("width"), CST_MAP_MAX_WIDTH/2, "Check new map width size" );
            assert.equal($svg.attr("height"), CST_MAP_MAX_HEIGHT/2, "Check new map height size" );
            
            $(".mapcontainer").width(CST_MAP_MAX_WIDTH);
            $(window).trigger('resize');
            setTimeout(function() {
                var $svg = $(".mapcontainer .map svg");
                assert.equal($svg.attr("width"), CST_MAP_MAX_WIDTH, "Check old map width size" );
                assert.equal($svg.attr("height"), CST_MAP_MAX_HEIGHT, "Check old map height size" );
                responsive_async_done();
            }, 500);
        }, 500);

    });

});
