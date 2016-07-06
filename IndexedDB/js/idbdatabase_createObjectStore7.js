require('../node-indexeddbshim-test');
document.title = 'IDBDatabase.createObjectStore() - create an object store with an unknown optional parameter ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');


var t = async_test(document.title, {timeout: 10000}),
    open_rq = createdb(t)

open_rq.onupgradeneeded = function(e) {
    var db = e.target.result
    db.createObjectStore("with unknown param", { parameter: 0 });

    t.done()
}

