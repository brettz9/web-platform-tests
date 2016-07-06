require('../node-indexeddbshim-test');
document.title = 'IDBObjectStore.add() - add with an out-of-line key ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      t = async_test(),
      key = 1,
      record = { property: "data" };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objStore = db.createObjectStore("store");

        objStore.add(record, key);
    };

    open_rq.onsuccess = function(e) {
        var rq = db.transaction("store")
                   .objectStore("store")
                   .get(key);

        rq.onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result.property, record.property);

            t.done();
        });
    };
