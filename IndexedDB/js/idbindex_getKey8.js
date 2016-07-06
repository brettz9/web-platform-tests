require('../node-indexeddbshim-test');
document.title = 'IDBIndex.getKey() - throw InvalidStateError on index deleted by aborted upgrade';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
        t = async_test();

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var store = db.createObjectStore("store", { keyPath: "key" });
        var index = store.createIndex("index", "indexedProperty");
        store.add({ key: 1, indexedProperty: "data" });

        e.target.transaction.abort();

        assert_throws("InvalidStateError", function(){
            index.getKey("data");
        });
        t.done();
    }
