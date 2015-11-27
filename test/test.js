$(function() {
    
    module("Basic");
    
    var CST_MAP_MAX_WIDTH = 800;
    var CST_MAP_MAX_HEIGHT = 834.8948306319708; // Calculated

    test( "Default instance creation", function(assert ) {

        var CST_NB_OF_FRANCE_DPTMT = 96;

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

    test( "Mouseover", function(assert ) {
        var mouseover_done = assert.async();
        
        /* Create the map */
        $(".mapcontainer").mapael({
            map: {
                name: "france_departments"
            }
        });

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
        
    });

    test( "Responsive", function(assert ) {
        var responsive_done = assert.async();
        
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
            assert.equal($(".mapcontainer .map svg").attr("width"), CST_MAP_MAX_WIDTH/2, "Responsive test: check new map width size" );
            assert.equal($(".mapcontainer .map svg").attr("height"), CST_MAP_MAX_HEIGHT/2, "Responsive test: check new map height size" );
            responsive_done();
        }, 500);

    });

});