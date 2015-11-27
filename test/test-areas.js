/*
 * Unit Test for Mapael
 * Module: Areas
 * 
 * Here are tested:
 *      - options.map.defaultArea
 *      - options.map.areas 
 */
$(function() {
    
    module("Areas");
    
    var CST_NB_OF_FRANCE_DPTMT = 96;
    
    test("defaultArea option override", function(assert) {
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
        
        assert.ok($(".mapcontainer .map svg text[data-id='department-56']")[0], "Text created for department-56" );
        
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
                    }
                    
                    mouseover_async_done();
                }, 500);
            }, 500);
        });
    });

});