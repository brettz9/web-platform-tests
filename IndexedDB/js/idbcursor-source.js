
    setup({ explicit_done: true });

    var db;
    var open_rq = indexedDB.open('testdb-' + new Date().getTime());
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objStore = db.createObjectStore("my_objectstore");
        objStore.createIndex("my_index", "");

        objStore.add("data",  1);
        objStore.add("data2", 2);
    };

    function cursor_source(name, stringified_object, cursor_rq) {
        var cursor;

        cursor_rq.onsuccess = this.step_func(function(e) {
            if (!e.target.result) {
                return;
            }
            cursor = e.target.result;
            assert_readonly(cursor, 'source');

            // Direct try
            assert_true(cursor.source instanceof Object, "source isobject");
            assert_equals(cursor.source + "", stringified_object, "source");
            assert_equals(cursor.source.name, name, "name");

            cursor.continue();
        });

        cursor_rq.transaction.oncomplete = this.step_func(function(e) {
            this.done();
         });

        cursor_rq.transaction.onerror = this.step_func(function(e) {
            assert_unreached("Transaction got error. " + (e.target.error ? e.target.error.name : "unknown"));
        });
    }

    open_rq.onsuccess = function() {
        async_test(document.title + ' - IDBObjectStore').step(function() {
            cursor_source.call(this, "my_objectstore", "[object IDBObjectStore]", db.transaction("my_objectstore")
                                                       .objectStore("my_objectstore")
                                                       .openCursor());
        });

        async_test(document.title + ' - IDBIndex').step(function() {
            cursor_source.call(this, "my_index", "[object IDBIndex]", db.transaction("my_objectstore")
                                                 .objectStore("my_objectstore")
                                                 .index("my_index")
                                                 .openCursor());
        });

        done();
    };

