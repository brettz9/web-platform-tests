require('../node-indexeddbshim-test');
document.title = 'IDBObjectStore.add() - Add a record where a value being indexed does not meet the constraints of a valid key ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      t = async_test(),
      record = { key: 1, indexedProperty: { property: "data" } };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;

        var rq,
          objStore = db.createObjectStore("store", { keyPath: "key" });

        objStore.createIndex("index", "indexedProperty");

        rq = objStore.add(record);

        assert_true(rq instanceof IDBRequest);
        rq.onsuccess = function() {
            t.done();
        }
    };
