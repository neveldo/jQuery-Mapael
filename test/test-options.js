/*
 * Unit Test for Mapael
 * Module: Options
 * 
 * Here are tested:
 *      - options.map.width
 *      - options.map.beforeInit
 *      - options.map.afterInit
 *      - options.map.cssClass
 *      - options.map.tooltip
 */
$(function() {
    
    QUnit.module("Options");
    
    QUnit.test("Force width", function(assert) {
        var responsive_async_done = assert.async();
        
        /* Create the map */
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments",
                width:CST_MAP_MAX_WIDTH/2
            }
        }));
        
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
    
    QUnit.test("Different map cssClass", function(assert) {
        var new_classname = "DIFFERENT_CLASSNAME";

        $(".mapcontainer .map").attr("class", "").addClass(new_classname);

        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: { 
                name: "france_departments",
                cssClass: new_classname
            }
        }));
        
        assert.ok($("." + new_classname + " svg")[0], "Map created" );
        
    });
    
    QUnit.test("Wrong map cssClass", function(assert) {
        assert.throws(function(){
            $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
                map: { 
                    name: "france_departments",
                    cssClass: "NOT_EXISTING" 
                }
            }));
        }, "Throw error" );
        
        assert.notOk($(".mapcontainer svg")[0], "Container not existing" );
    });
    
    QUnit.test("Check callbacks", function(assert) {
        var beforeInit_spy = sinon.spy();
        var afterInit_spy = sinon.spy();
        
        /* Create the map */
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments",
                beforeInit:beforeInit_spy,
                afterInit:afterInit_spy
            }
        }));
        
        assert.ok(beforeInit_spy.calledOnce, "beforeInit call");
        assert.ok(afterInit_spy.calledOnce, "afterInit call");

    });
    
    QUnit.test("Tooltip options", function(assert) {
        var tooltip_async_done = assert.async();
        var tooltip_class = "TOOLTIP_CLASSNAME";
        var additional_prop = {
            "border-left-width": "5px",
            "border-left-style": "solid",
            "border-left-color": "rgb(0, 255, 0)"
        };
        
        $('<div/>').addClass(tooltip_class).appendTo('.container');
        
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: { 
                name: "france_departments",
                tooltip: {
                    cssClass: tooltip_class,
                    css: additional_prop
                }
            },
            areas:{
                "department-56": {
                    tooltip: {content: "TOOLTIP_department-56"}
                }
            }
        }));
        
        assert.ok($("." + tooltip_class)[0], "Tooltip created" );
        assert.ok($(".mapcontainer > .map > ." + tooltip_class)[0], "Tooltip created in target" );
        
        $("path[data-id='department-56']").trigger("mouseover");
        
        setTimeout(function() {
            $.each(additional_prop, function(propertyName, value){
                assert.equal($("." + tooltip_class).css(propertyName), value, "CSS property " + propertyName + " added");
            });
            tooltip_async_done();
        }, 500);
    });
    
});
