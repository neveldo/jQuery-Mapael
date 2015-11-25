

test( "Basic instance", function(assert ) {
    var mouseover_done = assert.async(),
        responsive_done = assert.async();

    var CST_NB_OF_FRANCE_DPTMT = 96;
    var CST_MAP_MAX_WIDTH = 800;
    var CST_MAP_MAX_HEIGHT = 834.8948306319708; // Calculated

    /* Create the basic map! */
    $(".mapcontainer").mapael({
        map: {
            name: "france_departments"
        }
    });

    /* Some basic checks */
    ok($(".mapcontainer .map svg")[0], "SVG map created" );
    ok($(".mapcontainer .map svg path")[0], "Path in SVG map" );
    equal($(".mapcontainer .map svg path").length, CST_NB_OF_FRANCE_DPTMT, "All France department drawn" );
    equal($(".mapcontainer .map svg").attr("width"), CST_MAP_MAX_WIDTH, "Check map width size" );
    equal($(".mapcontainer .map svg").attr("height"), CST_MAP_MAX_HEIGHT, "Check map height size" );
    ok($(".mapcontainer").hasClass("mapael"), "Has mapael class" );
    ok(typeof $(".mapcontainer").data("mapael") === "function", "Has mapael data" );
    ok($(".mapcontainer .map .mapTooltip")[0], "Has tooltip div" );

    /*
     * Checking the mouseover event (background changement)
     */
    var default_fill = $(".mapcontainer svg path:first").attr("fill");
    $(".mapcontainer svg path:first").trigger("mouseover");
    setTimeout(function() {
        var new_fill = $(".mapcontainer svg path:first").attr("fill");
        notEqual(default_fill, new_fill, "Check mouse over" );
        mouseover_done();
    }, 500);

    /* Responsive checks */
    setTimeout(function() {
        $(".mapcontainer").width(CST_MAP_MAX_WIDTH/2);
        $(window).trigger('resize');
        setTimeout(function() {
            equal($(".mapcontainer .map svg").attr("width"), CST_MAP_MAX_WIDTH/2, "Responsive test: check new map width size" );
            equal($(".mapcontainer .map svg").attr("height"), CST_MAP_MAX_HEIGHT/2, "Responsive test: check new map height size" );
            responsive_done();
        }, 500);
    }, 600);

});



