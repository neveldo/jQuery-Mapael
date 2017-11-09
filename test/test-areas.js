/*
 * Unit Test for Mapael
 * Module: Areas
 *
 * Here are tested:
 *      - options.map.defaultArea
 *      - options.map.areas
 */
$(function() {

    QUnit.module("Areas", CST_MODULE_OPTS);

    QUnit.test("defaultArea option override", function(assert) {
        var self = this;
        var mouseover_async_done = assert.async(CST_NB_OF_HOVER_CHECK);

        var CST_DEFAULTAREA = {
            attrs: {
                fill: "#f4f4e8",
                stroke: "#ced8d0"
            },
            attrsHover: {
                fill: "#a4e100",
                stroke: "#aaaaaa"
            },
            text: {
                attrs: {
                    fill: "#505444"
                },
                attrsHover: {
                    fill: "#000"
                }
            }
        };

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments",
                defaultArea: CST_DEFAULTAREA
            }
        }));

        assert.ok(self.$map.find(".map svg")[0], "Map created" );

        var counter = 0;
        self.$map.find("svg path").slice(0, CST_NB_OF_HOVER_CHECK).each(function(id, elem) {
            var $elem = $(elem);
            var data_id = $elem.attr("data-id");
            assert.equal($elem.attr("fill"), CST_DEFAULTAREA.attrs.fill, "Check overriden fill before mouseover for " + data_id);
            assert.equal($elem.attr("stroke"), CST_DEFAULTAREA.attrs.stroke, "Check overriden stroke before mouseover for " + data_id);

            setTimeout(function() {
                $elem.trigger("mouseover");
                setTimeout(function() {
                    assert.equal($elem.attr("fill"), CST_DEFAULTAREA.attrsHover.fill, "Check overriden hover fill after mouseover for " + data_id);
                    assert.equal($elem.attr("stroke"), CST_DEFAULTAREA.attrsHover.stroke, "Check overriden hover stroke after mouseover for " + data_id);

                    $elem.trigger("mouseout");
                    setTimeout(function() {
                        assert.equal($elem.attr("fill"), CST_DEFAULTAREA.attrs.fill, "Check overriden fill after mouseout for " + data_id);
                        mouseover_async_done();
                    }, CST_MOUSEOVER_TIMEOUT_MS);
                }, CST_MOUSEOVER_TIMEOUT_MS);
            }, counter * (CST_MOUSEOVER_TIMEOUT_MS * 2));
            counter++;
        });
    });

    QUnit.test("Area custom option override", function(assert) {
        var self = this;
        var mouseover_async_done = assert.async(2);
        var text_mouseover_async_done = assert.async();

        var CST_CUSTOMAREA = {
            "department-56": {
                text: {
                    content: "TEXT_department-56",
                    attrs: {"font-size": 5},
                    attrsHover: {"font-size": 20}
                },
                tooltip: {content: "TOOLTIP_department-56"}
            },
            "department-21": {
                attrs: {
                    fill: "#488402"
                },
                attrsHover: {
                    fill: "#a4e100"
                }
            },
            "department-74": {
                text: {
                    content: "TEXT_department-74",
                    position:"top",
                    margin:0
                },
                href: "http://path.to.74.com",
                target: "_blank"
            }
        };

        self.$map.mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            },
            areas: CST_CUSTOMAREA
        }));

        assert.ok(self.$map.find(".map svg")[0], "Map created" );

        var $text_56 = self.$map.find(".map svg text[data-id='department-56']");
        var $text_74 = self.$map.find(".map svg text[data-id='department-74']");

        assert.ok($text_56[0], "Text created for department-56" );
        assert.equal($text_56.attr("font-size"), CST_CUSTOMAREA["department-56"].text.attrs["font-size"] + "px", "Font-size ok for department-56" );
        $text_56.trigger("mouseover");
        setTimeout(function() {
            assert.equal($text_56.attr("font-size"), CST_CUSTOMAREA["department-56"].text.attrsHover["font-size"] + "px", "Font-size hover ok for department-56" );
            text_mouseover_async_done();

            assert.ok($text_74[0], "Text created for department-74" );

            var counter = 0;
            self.$map.find("svg path").each(function(id, elem) {
                var $elem = $(elem);
                var data_id = $elem.attr("data-id");

                if (data_id === "department-21") {
                    assert.equal($elem.attr("fill"), CST_CUSTOMAREA[data_id].attrs.fill, "Check special overriden fill before mouseover for " + data_id);
                } else if (data_id === "department-74") {
                    /* Can't check more than that since href and target values are handled by onClick event... */
                }

                if ((data_id === "department-21") || (data_id === "department-56")) {
                    setTimeout(function () {
                        $elem.trigger("mouseover");
                        $elem.trigger("mousemove");
                        setTimeout(function () {
                            if (data_id === "department-21") {
                                assert.equal($elem.attr("fill"), CST_CUSTOMAREA[data_id].attrsHover.fill, "Check special overriden hover fill after mouseover for " + data_id);
                            } else if (data_id === "department-56") {
                                assert.ok(self.$map.find(".map .mapTooltip").is(":visible"), "Check tooltip visible for " + data_id);
                                assert.equal(self.$map.find(".map .mapTooltip").html(), CST_CUSTOMAREA[data_id].tooltip.content, "Check special tooltip content for " + data_id);
                            }

                            $elem.trigger("mouseout");
                            setTimeout(function () {
                                if (data_id === "department-21") {
                                    assert.equal($elem.attr("fill"), CST_CUSTOMAREA[data_id].attrs.fill, "Check special overriden fill after mouseout for " + data_id);
                                } else if (data_id === "department-56") {
                                    assert.ok(self.$map.find(".map .mapTooltip").is(":hidden"), "Check tooltip hidden after mouseout for " + data_id);
                                }

                                mouseover_async_done();
                            }, CST_MOUSEOVER_TIMEOUT_MS);
                        }, CST_MOUSEOVER_TIMEOUT_MS);
                    }, counter * (CST_MOUSEOVER_TIMEOUT_MS * 2));
                    counter++;
                }
            });
        }, CST_MOUSEOVER_TIMEOUT_MS);
    });

});
