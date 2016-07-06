require('../node-indexeddbshim-test');
document.title = 'Attempting to use deleted IDBObjectStore';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      add_success = false,
      t = async_test(document.title, {timeout: 10000})

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;

        var objStore = db.createObjectStore("store", { autoIncrement: true });
        assert_equals(db.objectStoreNames[0], "store", "objectStoreNames");

        var rq_add = objStore.add(1);
        rq_add.onsuccess = function() { add_success = true; };
        rq_add.onerror = fail(t, 'rq_add.error');

        objStore.createIndex("idx", "a");
        db.deleteObjectStore("store");
        assert_equals(db.objectStoreNames.length, 0, "objectStoreNames.length after delete");

        assert_throws(null, function() { objStore.add(2); });
        assert_throws(null, function() { objStore.put(3); });
        assert_throws(null, function() { objStore.get(1); });
        assert_throws(null, function() { objStore.clear(); });
        assert_throws(null, function() { objStore.count(); });
        assert_throws(null, function() { objStore.delete(1); });
        assert_throws(null, function() { objStore.openCursor(); });
        assert_throws(null, function() { objStore.index("idx"); });
        assert_throws(null, function() { objStore.deleteIndex("idx"); });
        assert_throws(null, function() { objStore.createIndex("idx2", "a"); });
    }

    open_rq.onsuccess = function() {
        assert_true(add_success, "First add was successful");
        t.done();
    }
