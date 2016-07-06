require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

var t = async_test(),
    open_rq = createdb(t);

open_rq.onupgradeneeded = function (e) {
    var db = e.target.result;
    var ostore = db.createObjectStore("store");
    ostore.createIndex("a", "a");
    assert_throws("ConstraintError", function(){
        ostore.createIndex("a", "a");
    });
    t.done();
}
