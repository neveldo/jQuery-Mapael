// LCOV reporter, only if called with "lcovReport" parameter
if (location.href.match(/(\?|&)lcovReport($|&|=)/)) {
   blanket.options("reporter", "https://rawgit.com/alex-seville/blanket/v1.1.7/src/reporters/lcov_reporter.js");
   blanket.options("reporter_options", { toHTML:false });

   // send results to PhantomJS
   QUnit.done(function() {
      alert(JSON.stringify(['qunit.report', window._$blanket_LCOV]));
   });
}