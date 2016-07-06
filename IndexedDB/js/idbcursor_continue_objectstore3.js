require('../node-indexeddbshim-test');
document.title = 'IDBCursor.continue() - object store - attempt to iterate to the previous record when the direction is set for the next record';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      t = async_test(),
      records = [ { pKey: "primaryKey_0" },
                  { pKey: "primaryKey_1" } ];

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objStore = db.createObjectStore("test", {keyPath:"pKey"});

        for (var i = 0; i < records.length; i++)
            objStore.add(records[i]);
    };

    open_rq.onsuccess = function(e) {
        var cursor_rq = db.transaction("test")
                          .objectStore("test")
                          .openCursor(undefined, "next");

        cursor_rq.onsuccess = t.step_func(function(e) {
            var cursor = e.target.result;

            assert_true(cursor instanceof IDBCursor, "cursor exist");
            assert_throws("DataError",
                function() { cursor.continue(records[0].pKey); });

            t.done();
        });
    };
