require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var open_rq = createdb(async_test(), 'database_name');

    open_rq.onupgradeneeded = function(e) {
        assert_equals(e.target.result.version, 1, "db.version");
    };
    open_rq.onsuccess = function(e) {
        assert_equals(e.target.result.version, 1, "db.version");
        this.done();
    };
