require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

var db,
    t = async_test(),
    open_rq = createdb(t);

open_rq.onupgradeneeded = function() {};
open_rq.onsuccess = function(e) {
    db = e.target.result;
    assert_throws('InvalidAccessError', function() { db.transaction([]); });
    t.done();
};
