require('../node-indexeddbshim-test');
document.title = 'When db.close is called in upgradeneeded, the db is cleaned up on refresh';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');


var open_rq = createdb(async_test())
var sawTransactionComplete = false

open_rq.onupgradeneeded = function(e) {
    db = e.target.result
    assert_equals(db.version, 1)

    db.createObjectStore('os')
    db.close()

    e.target.transaction.oncomplete = function() { sawTransactionComplete = true }
}

open_rq.onerror = function(e) {
    assert_true(sawTransactionComplete, "saw transaction.complete")

    assert_equals(e.target.error.name, 'AbortError')
    assert_equals(e.result, undefined)

    assert_true(!!db)
    assert_equals(db.version, 1)
    assert_equals(db.objectStoreNames.length, 1)
    assert_throws("InvalidStateError", function() { db.transaction('os') })

    this.done()
}

