require('../node-indexeddbshim-test');
document.title = 'IDBDatabase.createObjectStore() - attempt to create an object store outside of a version change transaction ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');


var t = async_test(),
    open_rq = createdb(t)

open_rq.onupgradeneeded = function() {}
open_rq.onsuccess = function (e) {
    var db = e.target.result
    assert_throws(
        'InvalidStateError',
        function() { db.createObjectStore('fails') })
    t.done();
}

