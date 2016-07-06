require('../node-indexeddbshim-test');
document.title = 'IDBObjectStore.delete() - key doesn\'t match any records ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      t = async_test();

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;

        var delete_rq = db.createObjectStore("test")
                          .delete(1);

        delete_rq.onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result, undefined);
            t.done();
        });
    };
