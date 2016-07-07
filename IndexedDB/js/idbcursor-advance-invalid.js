document.title = 'IDBCursor.advance() - invalid';


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

        async_test(document.title + " - attempt to call advance twice").step(function(e) {
            var count = 0;
            var rq = db.transaction("test").objectStore("test").index("index").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                if (!e.target.result) {
                    assert_equals(count, 2, 'count');
                    this.done();
                    return;
                }
                var cursor = e.target.result;

                cursor.advance(1);

                // Second try
                assert_throws('InvalidStateError',
                    function() { cursor.advance(1); }, 'second advance');

                assert_throws('InvalidStateError',
                    function() { cursor.advance(3); }, 'third advance');

                count++;
            });
            rq.onerror = fail(this, "unexpected error")
        });


        async_test(document.title + " - pass something other than number").step(function(e) {
            var rq = db.transaction("test").objectStore("test").index("index").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                var cursor = e.target.result;

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(document); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance({}); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance([]); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(""); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance("1 2"); });

                this.done();
            });
            rq.onerror = fail(this, "unexpected error")
        });


        async_test(document.title + " - pass null/undefined").step(function(e) {
            var rq = db.transaction("test").objectStore("test").index("index").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                var cursor = e.target.result;

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(null); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(undefined); });

                var myvar = null;
                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(myvar); });

                this.done();
            });
            rq.onerror = fail(this, "unexpected error")
        });


        async_test(document.title + " - missing argument").step(function(e) {
            var rq = db.transaction("test").objectStore("test").index("index").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                var cursor = e.target.result;

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(); });

                this.done();
            });
            rq.onerror = fail(this, "unexpected error")
        });


        async_test(document.title + " - pass negative numbers").step(function(e) {
            var rq = db.transaction("test").objectStore("test").index("index").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                var cursor = e.target.result;

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(-1); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(NaN); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(0); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(-0); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(Infinity); });

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(-Infinity); });

                var myvar = -999999;
                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(myvar); });

                this.done();
            });
            rq.onerror = fail(this, "unexpected error")
        });


        async_test(document.title + " - got value not set on exception").step(function(e) {
            var count = 0;
            var rq = db.transaction("test").objectStore("test").index("index").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                var cursor = e.target.result;
                if (!cursor)
                {
                    assert_equals(count, 2, "count runs");
                    this.done();
                    return;
                }

                assert_throws({ name: "TypeError" },
                    function() { cursor.advance(0); });

                cursor.advance(1);
                count++;
            });
            rq.onerror = fail(this, "unexpected error")
        });


        // Stop blocking the testing system from hereon
        done();
    }

