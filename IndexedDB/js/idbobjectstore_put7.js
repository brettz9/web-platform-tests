require('../node-indexeddbshim-test');
document.title = 'IDBObjectStore.put() - autoIncrement and out-of-line keys ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      t = async_test(),
      record = { property: "data" },
      expected_keys = [ 1, 2, 3, 4 ];

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objStore = db.createObjectStore("store", { autoIncrement: true });

        objStore.put(record);
        objStore.put(record);
        objStore.put(record);
        objStore.put(record);
    };

    open_rq.onsuccess = function(e) {
        var actual_keys = [],
          rq = db.transaction("store")
                 .objectStore("store")
                 .openCursor();

        rq.onsuccess = t.step_func(function(e) {
            var cursor = e.target.result;

            if (cursor) {
                actual_keys.push(cursor.key);
                cursor.continue();
            }
            else {
                assert_array_equals(actual_keys, expected_keys);
                t.done();
            }
        });
    };
