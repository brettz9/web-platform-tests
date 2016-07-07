document.title = 'IDBObjectStore.openCursor() - invalid';


    var db, open;

    setup(function() {
        open = indexedDB.open('testdb-' + new Date().getTime());
        open.onupgradeneeded = function(e) {
            db = e.target.result;
            var objStore = db.createObjectStore("test");
            objStore.createIndex("index", "");

            objStore.add("data",  1);
            objStore.add("data2", 2);
        };
    },
    { explicit_done: true });


    open.onsuccess = function() {

        async_test(document.title + " - pass something other than number").step(function(e) {
            var idx = db.transaction("test").objectStore("test").index("index");

            assert_throws("DataError",
                function() { idx.openCursor({ lower: "a" }); });

            assert_throws("DataError",
                function() { idx.openCursor({ lower: "a", lowerOpen: false }); });

            assert_throws("DataError",
                function() { idx.openCursor({ lower: "a", lowerOpen: false, upper: null, upperOpen: false }); });

            this.done();
        });


        // Stop blocking the testing system from hereon
        done();
    }

