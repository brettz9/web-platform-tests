document.title = 'IDBIndex.get() - throw InvalidStateError on index deleted by aborted upgrade';

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
            index.get("data");
        });
        t.done();
    }
