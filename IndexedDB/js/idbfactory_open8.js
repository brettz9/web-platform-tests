require('../node-indexeddbshim-test');
document.title = 'IDBFactory.open() - error in version change transaction aborts open';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var open_rq = createdb(async_test(), undefined, 13);
    var did_upgrade = false;
    var did_db_abort = false;

    open_rq.onupgradeneeded = function(e) {
        did_upgrade = true;
        e.target.result.onabort = function() {
            did_db_abort = true;
        }
        e.target.transaction.abort();
    };
    open_rq.onerror = function(e) {
        assert_true(did_upgrade);
        assert_equals(e.target.error.name, 'AbortError', 'target.error');
        this.done()
    };
