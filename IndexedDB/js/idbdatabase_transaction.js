require('../node-indexeddbshim-test');
document.title = 'IDBDatabase.transaction() - attempt to open a transaction with invalid scope';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');


var db,
  t = async_test(),
  open_rq = createdb(t);

open_rq.onupgradeneeded = function() {};
open_rq.onsuccess = function(e) {
    db = e.target.result;

    assert_throws('NotFoundError', function() { db.transaction('non-existing'); });
    t.done();
};

