require('../node-indexeddbshim-test');
document.title = 'IDBCursor.continue() - object store - iterate to the next record';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      count = 0,
      t = async_test(),
      records = [ { pKey: "primaryKey_0" },
                  { pKey: "primaryKey_1" } ];

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objStore = db.createObjectStore("test", {autoIncrement:true, keyPath:"pKey"});

        for (var i = 0; i < records.length; i++)
            objStore.add(records[i]);
    };

    open_rq.onsuccess = function(e) {
        var store = db.transaction("test")
                      .objectStore("test");

        cursor_rq = store.openCursor();
        cursor_rq.onsuccess = t.step_func(function(e) {
            var cursor = e.target.result;
            if (!cursor) {
                assert_equals(count, records.length, "cursor run count");
                t.done();
            }

            var record = cursor.value;
            assert_equals(record.pKey, records[count].pKey, "primary key");
            assert_equals(record.iKey, records[count].iKey, "index key");

            cursor.continue();
            count++;
        });
    };
