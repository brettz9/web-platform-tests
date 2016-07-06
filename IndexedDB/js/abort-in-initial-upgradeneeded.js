require('../node-indexeddbshim-test');
document.title = 'Test that an abort in the initial upgradeneeded sets version back to 0';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');


var db, open_rq = createdb(async_test(), undefined, 2);

open_rq.onupgradeneeded = function(e) {
    db = e.target.result;
    assert_equals(db.version, 2);
    transaction = e.target.transaction;
    transaction.oncomplete = fail(this, "unexpected transaction.complete");
    transaction.onabort = function(e) {
        assert_equals(e.target.db.version, 0);
    }
    db.onabort = function() {}

    transaction.abort();
}

open_rq.onerror = function(e) {
    assert_equals(open_rq, e.target);
    assert_equals(e.target.result, undefined);
    assert_equals(e.target.error.name, "AbortError");
    assert_equals(db.version, 0);
    assert_equals(open_rq.transaction, null);
    this.done();
}
