require('../node-indexeddbshim-test');
document.title = 'IDBFactory.open() - open database with a lower version than current';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var open_rq = createdb(async_test(), undefined, 13);
    var did_upgrade = false;

    open_rq.onupgradeneeded = function() {};
    open_rq.onsuccess = function(e) {
        var db = e.target.result;
        db.close();

        var open_rq2 = window.indexedDB.open(db.name, 14);
        open_rq2.onupgradeneeded = function() {};
        open_rq2.onsuccess = this.step_func(open_previous_db);
        open_rq2.onerror = fail(this, 'Unexpected error')
    }

    function open_previous_db(e) {
        var open_rq3 = window.indexedDB.open(e.target.result.name, 13);
        open_rq3.onerror = this.step_func(function(e) {
            assert_equals(e.target.error.name, 'VersionError', 'e.target.error.name')
            this.done();
        });
        open_rq3.onupgradeneeded = fail(this, 'Unexpected upgradeneeded')
        open_rq3.onsuccess = fail(this, 'Unexpected success')
    }
