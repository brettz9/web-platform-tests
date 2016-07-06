require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    var db, events = [],
        open_rq = createdb(async_test())

    open_rq.onupgradeneeded = function(e) {
        db = e.target.result

        db.createObjectStore("store")
            .add("versionchange1", 1)
            .addEventListener("success", log("versionchange_add.success"))

        assert_throws('InvalidStateError', function() { db.transaction("store") })

        e.target.transaction
            .objectStore("store")
            .count(2)
            .addEventListener("success", log("versionchange_count.success"))

        assert_throws('InvalidStateError', function() { db.transaction("store", "readwrite") })

        open_rq.transaction
            .objectStore("store")
            .add("versionchange2", 2)
            .addEventListener("success", log("versionchange_add2.success"))

        open_rq.transaction.oncomplete = function(e) {
            log("versionchange_txn.complete")(e)

            db.transaction("store")
                .objectStore("store")
                .count()
                .addEventListener("success", log("complete_count.success"))
        }
    }

    open_rq.onsuccess = function(e) {
        log("open_rq.success")(e)

        var txn = db.transaction("store", "readwrite")
        txn.objectStore("store")
            .put("woo", 1)
            .addEventListener("success", log("complete2_get.success"))

        txn.oncomplete = this.step_func(function(e) {
            assert_array_equals(events, [
                                  "versionchange_add.success: 1",
                                  "versionchange_count.success: 0",
                                  "versionchange_add2.success: 2",
                                  "versionchange_txn.complete",

                                  "open_rq.success: [object IDBDatabase]",

                                  "complete_count.success: 2",
                                  "complete2_get.success: 1",
                                ],
                       "events")
            this.done()
        })
    }


    function log(msg) {
        return function(e) {
            if(e && e.target && e.target.error)
                events.push(msg + ": " + e.target.error.name)
            else if(e && e.target && e.target.result !== undefined)
                events.push(msg + ": " + e.target.result)
            else
                events.push(msg)
        };
    }
