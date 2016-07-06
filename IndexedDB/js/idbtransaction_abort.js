require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db, aborted,
      t = async_test(document.title, {timeout: 10000}),
      record = { indexedProperty: "bar" };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var txn = e.target.transaction,
          objStore = db.createObjectStore("store");

        objStore.add(record, 1);
        objStore.add(record, 2);
        var index = objStore.createIndex("index", "indexedProperty", { unique: true });

        assert_true(index instanceof IDBIndex, "IDBIndex");

        e.target.transaction.onabort = t.step_func(function(e) {
            aborted = true;
            assert_equals(e.type, "abort", "event type");
        });

        db.onabort = function(e) {
            assert_true(aborted, "transaction.abort event has fired");
            t.done();
        };

        e.target.transaction.oncomplete = fail(t, "got complete, expected abort");
    };

