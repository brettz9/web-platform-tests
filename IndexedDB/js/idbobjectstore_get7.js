require('../node-indexeddbshim-test');
document.title = 'IDBObjectStore.get() - throw DataError when using invalid key ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      t = async_test();

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        db.createObjectStore("store", { keyPath: "key" })
    }

    open_rq.onsuccess = function(e) {
        var store = db.transaction("store")
                      .objectStore("store")
        assert_throws("DataError", function () {
            store.get(null)
        }, "throw DataError when using invalid key.");
        t.done();
    }
