require('../node-indexeddbshim-test');
document.title = 'IDBObjectStore.clear() - If the transaction this IDBObjectStore belongs to has its mode set to readonly, throw ReadOnlyError ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db,
        t = async_test(),
        records = [{ pKey: "primaryKey_0"},
                   { pKey: "primaryKey_1"}];

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function (event) {
        db = event.target.result;
        var objStore = db.createObjectStore("store", {keyPath:"pKey"});
        for (var i = 0; i < records.length; i++) {
            objStore.add(records[i]);
        }
    }

    open_rq.onsuccess = function (event) {
        var txn = db.transaction("store");
        var ostore = txn.objectStore("store");
        t.step(function(){
            assert_throws("ReadOnlyError", function(){
                ostore.clear();
            });
        });
        t.done();
    }
