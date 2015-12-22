// LCOV reporter, only if called with "lcovReport" parameter
if (location.href.match(/(\?|&)lcovReport($|&|=)/)) {
   blanket.options("reporter", "https://rawgit.com/alex-seville/blanket/v1.1.7/src/reporters/lcov_reporter.js");
   blanket.options("reporter_options", { toHTML:false });

   // send results to PhantomJS
   QUnit.done(function() {
        var data = JSON.stringify(['qunit.report', window._$blanket_LCOV]);

        // Fix for coveralls "Fatal error: ENOENT, no such file or directory"
        data = data.replace("file://", "");
        alert(data);
   });
}