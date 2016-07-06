require('../node-indexeddbshim-test');
document.title = 'IDBIndex.get() - returns the record with the first key in the range ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db, t = async_test();

    var open_rq = createdb(t);

    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var store = db.createObjectStore("store", { keyPath: "key" });
        store.createIndex("index", "indexedProperty");

        for(var i = 0; i < 10; i++) {
            store.add({ key: i, indexedProperty: "data" + i });
        }
    }

    open_rq.onsuccess = function(e) {
        var rq = db.transaction("store")
                   .objectStore("store")
                   .index("index")
                   .get(IDBKeyRange.bound('data4', 'data7'));

        rq.onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result.key, 4);
            assert_equals(e.target.result.indexedProperty, 'data4');

            setTimeout(function() { t.done(); }, 4)
        });
    }
