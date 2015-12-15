/*
 * Unit Test for Mapael
 * Module: Range event
 *
 * Here are tested:
 *      - showElementsInRange trigger event
 */
$(function() {

    QUnit.module("Range event");

    QUnit.test("Check callback", function(assert) {

        /* Create the map */
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            }
        }));

        var opt = {
            afterShowRange: sinon.spy()
        };

        $(".mapcontainer").trigger("showElementsInRange", [opt]);

        assert.ok(opt.afterShowRange.calledOnce, "afterShowRange call");

    });

    QUnit.test("Range test for plots", function(assert) {
        $(".mapcontainer").mapael($.extend(true, {}, CST_MAPCONF_NOANIMDURATION, {
            map: {
                name: "france_departments"
            },
            plots: {
                "p1": {
                    value: "0",
                    latitude: 1,
                    longitude: 1
                },
                "p2": {
                    value: "10",
                    latitude: 2,
                    longitude: 2
                },
                "p3": {
                    value: ["50", "10"],
                    latitude: 3,
                    longitude: 3
                },
                "p4": {
                    value: "5000",
                    latitude: 4,
                    longitude: 4
                },
                "p5": {
                    value: "-50",
                    latitude: 5,
                    longitude: 5
                }
            }
        }));

        var opt = {
            animDuration: 0,
            hiddenOpacity: 0.1,
            ranges: {
                plot: {}
            }
        };

        $p1 = $(".mapcontainer .map svg [data-id='p1']");
        $p2 = $(".mapcontainer .map svg [data-id='p2']");
        $p3 = $(".mapcontainer .map svg [data-id='p3']");
        $p4 = $(".mapcontainer .map svg [data-id='p4']");
        $p5 = $(".mapcontainer .map svg [data-id='p5']");

        // No range
        opt.ranges.plot = {};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") === undefined && $p1.css('display') !== 'none', "No range, p1 visible");
        assert.ok($p2.attr("opacity") === undefined && $p2.css('display') !== 'none', "No range, p2 visible");
        assert.ok($p3.attr("opacity") === undefined && $p3.css('display') !== 'none', "No range, p3 visible");
        assert.ok($p4.attr("opacity") === undefined && $p4.css('display') !== 'none', "No range, p4 visible");
        assert.ok($p5.attr("opacity") === undefined && $p5.css('display') !== 'none', "No range, p5 visible");

        // Check for min = 10000
        opt.ranges.plot = {min: 10000};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 0.1 && $p1.css('display') !== 'none', "Min = 1000, p1 opacity");
        assert.ok($p2.attr("opacity") == 0.1 && $p2.css('display') !== 'none', "Min = 1000, p2 opacity");
        assert.ok($p3.attr("opacity") == 0.1 && $p3.css('display') !== 'none', "Min = 1000, p3 opacity");
        assert.ok($p4.attr("opacity") == 0.1 && $p4.css('display') !== 'none', "Min = 1000, p4 opacity");
        assert.ok($p5.attr("opacity") == 0.1 && $p5.css('display') !== 'none', "Min = 1000, p5 opacity");

        // Check for min = 0
        opt.ranges.plot = {min: 0};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 1 && $p1.css('display') !== 'none', "Min = 0, p1 opacity");
        assert.ok($p2.attr("opacity") == 1 && $p2.css('display') !== 'none', "Min = 0, p2 opacity");
        assert.ok($p3.attr("opacity") == 1 && $p3.css('display') !== 'none', "Min = 0, p3 opacity");
        assert.ok($p4.attr("opacity") == 1 && $p4.css('display') !== 'none', "Min = 0, p4 opacity");
        assert.ok($p5.attr("opacity") == 0.1 && $p5.css('display') !== 'none', "Min = 0, p5 opacity");

        // Check for min = 50
        opt.ranges.plot = {min: 50};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 0.1 && $p1.css('display') !== 'none', "Min = 50, p1 opacity");
        assert.ok($p2.attr("opacity") == 0.1 && $p2.css('display') !== 'none', "Min = 50, p2 opacity");
        assert.ok($p3.attr("opacity") == 1 && $p3.css('display') !== 'none', "Min = 50, p3 opacity");
        assert.ok($p4.attr("opacity") == 1 && $p4.css('display') !== 'none', "Min = 50, p4 opacity");
        assert.ok($p5.attr("opacity") == 0.1 && $p5.css('display') !== 'none', "Min = 50, p5 opacity");

        // Check for min = 5000
        opt.ranges.plot = {max: 5000};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 1 && $p1.css('display') !== 'none', "Max = 5000, p1 opacity");
        assert.ok($p2.attr("opacity") == 1 && $p2.css('display') !== 'none', "Max = 5000, p2 opacity");
        assert.ok($p3.attr("opacity") == 1 && $p3.css('display') !== 'none', "Max = 5000, p3 opacity");
        assert.ok($p4.attr("opacity") == 1 && $p4.css('display') !== 'none', "Max = 5000, p4 opacity");
        assert.ok($p5.attr("opacity") == 1 && $p5.css('display') !== 'none', "Max = 5000, p5 opacity");

        // Check for max = 500000
        opt.ranges.plot = {max: 500000};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 1 && $p1.css('display') !== 'none', "Max = 500000, p1 opacity");
        assert.ok($p2.attr("opacity") == 1 && $p2.css('display') !== 'none', "Max = 500000, p2 opacity");
        assert.ok($p3.attr("opacity") == 1 && $p3.css('display') !== 'none', "Max = 500000, p3 opacity");
        assert.ok($p4.attr("opacity") == 1 && $p4.css('display') !== 'none', "Max = 500000, p4 opacity");
        assert.ok($p5.attr("opacity") == 1 && $p5.css('display') !== 'none', "Max = 500000, p5 opacity");

        // Check for max = -49
        opt.ranges.plot = {max: -49};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 0.1 && $p1.css('display') !== 'none', "Max = -49, p1 opacity");
        assert.ok($p2.attr("opacity") == 0.1 && $p2.css('display') !== 'none', "Max = -49, p2 opacity");
        assert.ok($p3.attr("opacity") == 0.1 && $p3.css('display') !== 'none', "Max = -49, p3 opacity");
        assert.ok($p4.attr("opacity") == 0.1 && $p4.css('display') !== 'none', "Max = -49, p4 opacity");
        assert.ok($p5.attr("opacity") == 1 && $p5.css('display') !== 'none', "Max = -49, p5 opacity");

        // Check for min: 25, max: 65
        opt.ranges.plot = {min: 25, max: 65};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 0.1 && $p1.css('display') !== 'none', "Range(25, 65), p1 opacity");
        assert.ok($p2.attr("opacity") == 0.1 && $p2.css('display') !== 'none', "Range(25, 65), p2 opacity");
        assert.ok($p3.attr("opacity") == 1 && $p3.css('display') !== 'none', "Range(25, 65), p3 opacity");
        assert.ok($p4.attr("opacity") == 0.1 && $p4.css('display') !== 'none', "Range(25, 65), p4 opacity");
        assert.ok($p5.attr("opacity") == 0.1 && $p5.css('display') !== 'none', "Range(25, 65), p5 opacity");

        // Check for range with unknown index (no modification of current opacity)
        opt.ranges.plot = {4:{min: 25, max: 65}};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 0.1 && $p1.css('display') !== 'none', "Unknown index, p1 opacity");
        assert.ok($p2.attr("opacity") == 0.1 && $p2.css('display') !== 'none', "Unknown index, p2 opacity");
        assert.ok($p3.attr("opacity") == 1 && $p3.css('display') !== 'none', "Unknown index, p3 opacity");
        assert.ok($p4.attr("opacity") == 0.1 && $p4.css('display') !== 'none', "Unknown index, p4 opacity");
        assert.ok($p5.attr("opacity") == 0.1 && $p5.css('display') !== 'none', "Unknown index, p5 opacity");

        // Check for range with known different index (p3 is the only one with two indexes)
        opt.ranges.plot = {
            0:{min: -200}, // shows all except p3
            1:{min: 11} // hide p3
        };
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 1 && $p1.css('display') !== 'none', "2 differents indexes, p1 opacity");
        assert.ok($p2.attr("opacity") == 1 && $p2.css('display') !== 'none', "2 differents indexes, p2 opacity");
        assert.ok($p3.attr("opacity") == 0.1 && $p3.css('display') !== 'none', "2 differents indexes, p3 opacity");
        assert.ok($p4.attr("opacity") == 1 && $p4.css('display') !== 'none', "2 differents indexes, p4 opacity");
        assert.ok($p5.attr("opacity") == 1 && $p5.css('display') !== 'none', "2 differents indexes, p5 opacity");

        // Check for range with 2nd index set
        opt.ranges.plot = {
            1:{min: 0}
        };
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 1 && $p1.css('display') !== 'none', "2nd index set, p1 opacity");
        assert.ok($p2.attr("opacity") == 1 && $p2.css('display') !== 'none', "2nd index set, p2 opacity");
        assert.ok($p3.attr("opacity") == 1 && $p3.css('display') !== 'none', "2nd index set, p3 opacity");
        assert.ok($p4.attr("opacity") == 1 && $p4.css('display') !== 'none', "2nd index set, p4 opacity");
        assert.ok($p5.attr("opacity") == 1 && $p5.css('display') !== 'none', "2nd index set, p5 opacity");

        // Check for no range, but range for area (no modification of current opacity)
        opt.ranges.plot = {};
        opt.ranges.area = {min:-1000};
        opt.ranges.link = {max:2000};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") == 1 && $p1.css('display') !== 'none', "No range + area, p1 opacity");
        assert.ok($p2.attr("opacity") == 1 && $p2.css('display') !== 'none', "No range + area, p2 opacity");
        assert.ok($p3.attr("opacity") == 1 && $p3.css('display') !== 'none', "No range + area, p3 opacity");
        assert.ok($p4.attr("opacity") == 1 && $p4.css('display') !== 'none', "No range + area, p4 opacity");
        assert.ok($p5.attr("opacity") == 1 && $p5.css('display') !== 'none', "No range + area, p5 opacity");

        // Check for min = 20000 with hiddenOpacity set to 0
        opt.ranges.plot = {min: 20000};
        opt.hiddenOpacity = 0;
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") === "0" && $p1.css('display') === 'none', "Min = 20000, hiddenOpacity 0, p1 opacity");
        assert.ok($p2.attr("opacity") === "0" && $p2.css('display') === 'none', "Min = 20000, hiddenOpacity 0, p2 opacity");
        assert.ok($p3.attr("opacity") === "0" && $p3.css('display') === 'none', "Min = 20000, hiddenOpacity 0, p3 opacity");
        assert.ok($p4.attr("opacity") === "0" && $p4.css('display') === 'none', "Min = 20000, hiddenOpacity 0, p4 opacity");
        assert.ok($p5.attr("opacity") === "0" && $p5.css('display') === 'none', "Min = 20000, hiddenOpacity 0, p5 opacity");

        // Check for min = -1000 with hiddenOpacity set to 0
        opt.ranges.plot = {min: -1000};
        $(".mapcontainer").trigger("showElementsInRange", [opt]);
        assert.ok($p1.attr("opacity") === "1" && $p1.css('display') !== 'none', "Min = -1000, hiddenOpacity 0, p1 opacity");
        assert.ok($p2.attr("opacity") === "1" && $p2.css('display') !== 'none', "Min = -1000, hiddenOpacity 0, p2 opacity");
        assert.ok($p3.attr("opacity") === "1" && $p3.css('display') !== 'none', "Min = -1000, hiddenOpacity 0, p3 opacity");
        assert.ok($p4.attr("opacity") === "1" && $p4.css('display') !== 'none', "Min = -1000, hiddenOpacity 0, p4 opacity");
        assert.ok($p5.attr("opacity") === "1" && $p5.css('display') !== 'none', "Min = -1000, hiddenOpacity 0, p5 opacity");

    });

});
