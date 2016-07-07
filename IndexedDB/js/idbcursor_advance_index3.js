document.title = 'IDBCursor.advance() - index - attempt to advance backwards';


    var db,
      t = async_test(document.title, {timeout: 10000}),
      records = [ { pKey: "primaryKey_0", iKey: "indexKey_0" },
                  { pKey: "primaryKey_1", iKey: "indexKey_1" } ];

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objStore = db.createObjectStore("test", { keyPath:"pKey" });

        objStore.createIndex("index", "iKey");

        for (var i = 0; i < records.length; i++)
            objStore.add(records[i]);
    };

    open_rq.onsuccess = function(e) {
        var cursor_rq = db.transaction("test")
                          .objectStore("test")
                          .index("index")
                          .openCursor(undefined, "next");

        cursor_rq.onsuccess = t.step_func(function(e) {
            var cursor = e.target.result;

            assert_true(cursor != null, "cursor exist");
            assert_throws(new TypeError(),
                function() { cursor.advance(-1); });

            t.done();
        });
    };

