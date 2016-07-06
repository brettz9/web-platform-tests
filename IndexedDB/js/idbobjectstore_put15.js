require('../node-indexeddbshim-test');
document.title = 'IDBObjectStore.put() - If the transaction this IDBObjectStore belongs to has its mode set to readonly, throw ReadOnlyError';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
        t = async_test();

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function (event) {
        db = event.target.result;
        db.createObjectStore("store", {keyPath:"pKey"});
    }

    open_rq.onsuccess = function (event) {
        var txn = db.transaction("store");
        var ostore = txn.objectStore("store");
        t.step(function(){
            assert_throws("ReadOnlyError", function(){
                ostore.put({pKey: "primaryKey_0"});
            });
        });
        t.done();
    }
