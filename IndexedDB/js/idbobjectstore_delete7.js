require('../node-indexeddbshim-test');
document.title = 'IDBObjectStore.delete() - If the object store has been deleted, the implementation must throw a DOMException of type InvalidStateError';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
        ostore,
        t = async_test(),
        records = [{ pKey: "primaryKey_0"},
                   { pKey: "primaryKey_1"}];

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function (event) {
        db = event.target.result;
        ostore = db.createObjectStore("store", {keyPath:"pKey"});
        db.deleteObjectStore("store");
        assert_throws("InvalidStateError", function(){
            ostore.delete("primaryKey_0");
        });
        t.done();
    }
