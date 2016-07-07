document.title = 'IDBCursor.primaryKey';


    function cursor_primarykey(key)
    {
        var db,
          t = async_test(document.title + " - " + key);

        var open_rq = createdb(t);
        open_rq.onupgradeneeded = function(e) {
            db = e.target.result;
            var objStore = db.createObjectStore("test");
            objStore.createIndex("index", "");

            objStore.add("data", key);
        };

        open_rq.onsuccess = t.step_func(function(e) {
            var cursor_rq = db.transaction("test")
                              .objectStore("test")
                              .index("index")
                              .openCursor();

            cursor_rq.onsuccess = t.step_func(function(e) {
                var cursor = e.target.result;

                assert_equals(cursor.value, "data", "prequisite cursor.value");
                assert_equals(cursor.key, "data", "prequisite cursor.key");

                assert_key_equals(cursor.primaryKey, key, 'primaryKey');
                assert_readonly(cursor, 'primaryKey');

                if (key instanceof Array) {
                    cursor.primaryKey.push("new");
                    key.push("new");

                    assert_key_equals(cursor.primaryKey, key, 'primaryKey after array push');

                    // But we can not change key (like readonly, just a bit different)
                    cursor.key = 10;
                    assert_key_equals(cursor.primaryKey, key, 'key after assignment');
                }

                t.done();
            });
        });
    }

    cursor_primarykey(1);
    cursor_primarykey("key");
    cursor_primarykey(["my", "key"]);

