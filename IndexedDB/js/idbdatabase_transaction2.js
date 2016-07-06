require('../node-indexeddbshim-test');
document.title = 'IDBDatabase.transaction() - opening a transaction defaults to a read-only mode ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');


var db,
  t = async_test(),
  open_rq = createdb(t);

open_rq.onupgradeneeded = function(e) {
    db = e.target.result;
    db.createObjectStore('readonly');
};
open_rq.onsuccess = function(e) {
    var txn = db.transaction('readonly');
    assert_equals(txn.mode, "readonly", 'txn.mode');

    t.done();
};

