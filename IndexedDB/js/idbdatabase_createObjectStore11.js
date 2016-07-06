require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

var t = async_test(),
    open_rq = createdb(t);

open_rq.onupgradeneeded = function (e) {
    var db = e.target.result;
    db.createObjectStore("store");
    assert_throws("ConstraintError", function(){
        db.createObjectStore("store", {
            keyPath: "key1",
        });
    });
    t.done();
}
