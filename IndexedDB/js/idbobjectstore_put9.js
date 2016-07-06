require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var t = async_test(),
      record = { key: 1, property: "data" };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        var rq,
          db = e.target.result,
          objStore = db.createObjectStore("store", { keyPath: "key" });

        assert_throws("DataError",
            function() { rq = objStore.put(record, 1); });

        assert_equals(rq, undefined);
        t.done();
    };
