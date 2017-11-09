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

    QUnit.module("Options", CST_MODULE_OPTS);

    QUnit.test("Force width", function(assert) {
        var self = this;
        var responsive_async_done = assert.async();

        /* Create the map */
        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments",
                width:CST_MAP_MAX_WIDTH/2
            }
        }));

        var $svg = self.$map.find(".map svg");

        assert.equal($svg.attr("width"), CST_MAP_MAX_WIDTH/2, "Check map fixed width size" );
        assert.equal($svg.attr("height"), CST_MAP_MAX_HEIGHT/2, "Check map fixed height size" );

        /* Responsive checks */
        self.$map.width(CST_MAP_MAX_WIDTH/4);
        $(window).trigger('resize');
        setTimeout(function() {
            var $svg = self.$map.find(".map svg");
            assert.equal($svg.attr("width"), CST_MAP_MAX_WIDTH/2, "Check fixed map width size after resize" );
            assert.equal($svg.attr("height"), CST_MAP_MAX_HEIGHT/2, "Check fixed map height size after resize" );

            responsive_async_done();
        }, 500);

    });

    QUnit.test("Different map cssClass", function(assert) {
        var self = this;
        var new_classname = "DIFFERENT_CLASSNAME";

        self.$map.find(".map").attr("class", "").addClass(new_classname);

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments",
                cssClass: new_classname
            }
        }));

        assert.ok($("." + new_classname + " svg")[0], "Map created" );

    });

    QUnit.test("Wrong map cssClass", function(assert) {
        var self = this;
        assert.throws(function(){
            self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
                map: {
                    name: "france_departments",
                    cssClass: "NOT_EXISTING"
                }
            }));
        }, "Throw error" );

        assert.notOk(self.$map.find("svg")[0], "Container not existing" );
    });

    QUnit.test("Check callbacks", function(assert) {
        var self = this;
        var beforeInit_spy = sinon.spy();
        var afterInit_spy = sinon.spy();

        /* Create the map */
        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
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
        var self = this;
        var tooltip_async_done = assert.async();
        var tooltip_class = "TOOLTIP_CLASSNAME";
        var additional_prop = {
            "border-left-width": "5px",
            "border-left-style": "solid",
            "border-left-color": "rgb(0, 255, 0)"
        };

        $('<div/>').addClass(tooltip_class).appendTo('.container');

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
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
        assert.ok(self.$map.find(".map > ." + tooltip_class)[0], "Tooltip created in target" );

        $("path[data-id='department-56']").trigger("mouseover");

        setTimeout(function() {
            $.each(additional_prop, function(propertyName, value){
                assert.equal($("." + tooltip_class).css(propertyName), value, "CSS property " + propertyName + " added");
            });
            tooltip_async_done();
        }, 500);
    });

});
