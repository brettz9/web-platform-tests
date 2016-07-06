require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
        ostore,
        t = async_test();

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function (event) {
        db = event.target.result;
        ostore = db.createObjectStore("store");
        db.deleteObjectStore("store");
    }

    open_rq.onsuccess = function (event) {
        t.step(function(){
            assert_throws("InvalidStateError", function(){
                ostore.createIndex("index", "indexedProperty");
            });
        });
        t.done();
    }
