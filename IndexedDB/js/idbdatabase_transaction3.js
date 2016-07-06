require('../node-indexeddbshim-test');
document.title = 'IDBDatabase.transaction() - attempt to open a transaction from closed database connection ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
      t = async_test(),
      open_rq = createdb(t);

    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        db.createObjectStore('test');
    };

    open_rq.onsuccess = function(e) {
        db.close();

        assert_throws('InvalidStateError',
            function() { db.transaction('test'); });

        t.done();
    };
