$(function() {
    
    module("Basic");
    
    var CST_NB_OF_FRANCE_DPTMT = 96;
    var CST_MAP_MAX_WIDTH = 800;
    var CST_MAP_MAX_HEIGHT = 834.8948306319708; // Calculated

    test("Default instance creation", function(assert) {

        /* Create the basic map! */
        $(".mapcontainer").mapael({
            map: {
                name: "france_departments"
            }
        });

        /* Some basic checks */
        assert.ok($(".mapcontainer .map svg")[0], "SVG map created" );
        assert.ok($(".mapcontainer .map svg path")[0], "Path in SVG map" );
        assert.equal($(".mapcontainer .map svg path").length, CST_NB_OF_FRANCE_DPTMT, "All France department drawn" );
        assert.equal($(".mapcontainer .map svg").attr("width"), CST_MAP_MAX_WIDTH, "Check map width size" );
        assert.equal($(".mapcontainer .map svg").attr("height"), CST_MAP_MAX_HEIGHT, "Check map height size" );
        assert.ok($(".mapcontainer").hasClass("mapael"), "Has mapael class" );
        assert.ok(typeof $(".mapcontainer").data("mapael") === "function", "Has mapael data" );
        assert.ok($(".mapcontainer .map .mapTooltip")[0], "Has tooltip div" );

    });
    

    test("Creation fail", function(assert) {

        /* Error if wrong map name */
        assert.throws(function(){
            $(".mapcontainer").mapael({
                map: { name: "not_existing_map" }
            });
        }, "Not existing map" );
        
        /* Create map, then create again!
        $(".mapcontainer").mapael({
            map: { name: "france_departments" }
        });
        assert.throws(function(){
            $(".mapcontainer").mapael({
                map: { name: "france_departments" }
            });
        }, "Already existing map" );
 */
    });

    test("Mouseover", function(assert) {
        var mouseover_async_done = assert.async(CST_NB_OF_FRANCE_DPTMT);
        
        /* Create the map */
        $(".mapcontainer").mapael({
            map: {
                name: "france_departments"
            }
        });

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

    test("Responsive", function(assert) {
        var responsive_async_done = assert.async();
        
        /* Create the map */
        $(".mapcontainer").mapael({
            map: {
                name: "france_departments"
            }
        });
        
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
    
    module("Options");
    
    test("Force width", function(assert) {
        var responsive_async_done = assert.async();
        
        /* Create the map */
        $(".mapcontainer").mapael({
            map: {
                name: "france_departments",
                width:CST_MAP_MAX_WIDTH/2
            }
        });
        
        var $svg = $(".mapcontainer .map svg");
        
        assert.equal($svg.attr("width"), CST_MAP_MAX_WIDTH/2, "Check map fixed width size" );
        assert.equal($svg.attr("height"), CST_MAP_MAX_HEIGHT/2, "Check map fixed height size" );
        
        /* Responsive checks */
        $(".mapcontainer").width(CST_MAP_MAX_WIDTH/4);
        $(window).trigger('resize');
        setTimeout(function() {
            var $svg = $(".mapcontainer .map svg");
            assert.equal($svg.attr("width"), CST_MAP_MAX_WIDTH/2, "Check fixed map width size after resize" );
            assert.equal($svg.attr("height"), CST_MAP_MAX_HEIGHT/2, "Check fixed map height size after resize" );
            
            responsive_async_done();
        }, 500);

    });
    
    test("Default option override", function(assert) {
        var mouseover_async_done = assert.async(CST_NB_OF_FRANCE_DPTMT);
        
        var CST_DEFAULTAREA = {
            attrs: {
                fill: "#f4f4e8", 
                stroke: "#ced8d0"
            }
            , attrsHover: {
                fill: "#a4e100", 
                stroke: "#aaaaaa"
            }
            , text: {
                attrs: {
                    fill: "#505444"
                }
                , attrsHover: {
                    fill: "#000"
                }
            }
        };
        var CST_CUSTOMAREA = {
            "department-56": {
                text: {content: "TEXT_department-56", attrs: {"font-size": 10}},
                tooltip: {content: "TOOLTIP_department-56"}
            },
            "department-21": {
                attrs: {
                    fill: "#488402"
                }
                , attrsHover: {
                    fill: "#a4e100"
                }
            }
        };
        
        $(".mapcontainer").mapael({
            map: {
                name: "france_departments",
                defaultArea: CST_DEFAULTAREA
            },
            areas: CST_CUSTOMAREA
        }); 
        
        assert.ok($(".mapcontainer .map svg")[0], "Map created" );
        
        $(".mapcontainer svg path").each(function(id, elem) {
            var $elem = $(elem);
            var data_id = $elem.attr("data-id");
            
            if (data_id === "department-21") {
                assert.equal($elem.attr("fill"), CST_CUSTOMAREA[data_id].attrs.fill, "Check special overriden fill before mouseover for " + data_id);
            } else {
                assert.equal($elem.attr("fill"), CST_DEFAULTAREA.attrs.fill, "Check overriden fill before mouseover for " + data_id);
            }
            assert.equal($elem.attr("stroke"), CST_DEFAULTAREA.attrs.stroke, "Check overriden stroke before mouseover for " + data_id);
            
            $elem.trigger("mouseover");
            setTimeout(function() {
                
                if (data_id === "department-21") {
                    assert.equal($elem.attr("fill"), CST_CUSTOMAREA[data_id].attrsHover.fill, "Check special overriden hover fill after mouseover for " + data_id);
                } else {
                    assert.equal($elem.attr("fill"), CST_DEFAULTAREA.attrsHover.fill, "Check overriden hover fill after mouseover for " + data_id);
                }
                assert.equal($elem.attr("stroke"), CST_DEFAULTAREA.attrsHover.stroke, "Check overriden hover stroke after mouseover for " + data_id);
                
                if (data_id === "department-56") {
                    assert.ok($(".mapcontainer .map .mapTooltip").is( ":visible" ), "Check tooltip visible for " + data_id);
                    assert.equal($(".mapcontainer .map .mapTooltip").html(), CST_CUSTOMAREA[data_id].tooltip.content, "Check special tooltip content for " + data_id);
                    /* TODO : check text? */
                } else {
                    /* We can't test the following because it will fail for area around dptmt 56... */
                    //assert.ok($(".mapcontainer .map .mapTooltip").is( ":hidden" ), "Check tooltip hidden for " + data_id);
                    //assert.equal($(".mapcontainer .map .mapTooltip").html(), "", "Check empty tooltip content for " + data_id);
                }
                
                $elem.trigger("mouseout");
                setTimeout(function() {
                    if (data_id === "department-21") {
                    assert.equal($elem.attr("fill"), CST_CUSTOMAREA[data_id].attrs.fill, "Check special overriden fill after mouseout for " + data_id);
                    } else {
                    assert.equal($elem.attr("fill"), CST_DEFAULTAREA.attrs.fill, "Check overriden fill after mouseout for " + data_id);
                    }
                    
                    if (data_id === "department-56") {
                        assert.ok($(".mapcontainer .map .mapTooltip").is( ":hidden" ), "Check tooltip hidden after mouseout for " + data_id);
                        // assert.equal($(".mapcontainer .map .mapTooltip").html(), "", "Check empty tooltip content after mouseout for " + data_id);
                    } else {
                        /* We can't test the following because it will fail for area around dptmt 56... */
                    }
                    
                    mouseover_async_done();
                }, 500);
            }, 500);
        });
    });

});