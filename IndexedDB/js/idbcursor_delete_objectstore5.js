document.title = 'IDBCursor.delete() - object store - throw InvalidStateError when the cursor is being iterated';

    var db,
        t = async_test(),
        records = [{ pKey: "primaryKey_0"},
                   { pKey: "primaryKey_1"}];

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function (event) {
        db = event.target.result;
        var objStore = db.createObjectStore("store", {keyPath:"pKey"});
        for (var i = 0; i < records.length; i++) {
            objStore.add(records[i]);
        }
    }

    open_rq.onsuccess = function (event) {
        var txn = db.transaction("store", "readwrite");
        var rq = txn.objectStore("store").openCursor();
        rq.onsuccess = t.step_func(function(event) {
            var cursor = event.target.result;
            assert_true(cursor instanceof IDBCursor, "cursor exist");

            cursor.continue();
            assert_throws("InvalidStateError", function() {
                cursor.delete();
            });

            t.done();
        });
    }
