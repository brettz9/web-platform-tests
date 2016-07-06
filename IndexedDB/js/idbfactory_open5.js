require('../node-indexeddbshim-test');
document.title = 'IDBFactory.open() - new database is empty';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var open_rq = createdb(async_test(), 'database_name');

    open_rq.onupgradeneeded = function() {};
    open_rq.onsuccess = function(e) {
        assert_equals(e.target.result.objectStoreNames.length, 0, "objectStoreNames.length");
        this.done();
    };
