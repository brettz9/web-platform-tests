document.title = 'IDBCursor asyncness';


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


        async_test(document.title + " - advance").step(function(e) {
            var count = 0;
            var rq = db.transaction("test").objectStore("test").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                if (!e.target.result) {
                    assert_equals(count, 2, 'count');
                    this.done();
                    return;
                }
                var cursor = e.target.result;

                switch(count) {
                    case 0:
                        assert_equals(cursor.value, "data")
                        assert_equals(cursor.key, 1)
                        cursor.advance(1)
                        assert_equals(cursor.value, "data")
                        assert_equals(cursor.key, 1)
                        break

                    case 1:
                        assert_equals(cursor.value, "data2")
                        assert_equals(cursor.key, 2)
                        cursor.advance(1)
                        assert_equals(cursor.value, "data2")
                        assert_equals(cursor.key, 2)
                        break

                    default:
                        assert_unreached("Unexpected count: " + count)
                }

                count++;
            });
            rq.onerror = fail(this, "unexpected error")
        });


        async_test(document.title + " - continue").step(function(e) {
            var count = 0;
            var rq = db.transaction("test").objectStore("test").index("index").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                if (!e.target.result) {
                    assert_equals(count, 2, 'count');
                    this.done();
                    return;
                }
                var cursor = e.target.result;

                switch(count) {
                    case 0:
                        assert_equals(cursor.value, "data")
                        assert_equals(cursor.key,   "data")
                        assert_equals(cursor.primaryKey, 1)
                        cursor.continue("data2")
                        assert_equals(cursor.value, "data")
                        assert_equals(cursor.key,   "data")
                        assert_equals(cursor.primaryKey, 1)
                        break

                    case 1:
                        assert_equals(cursor.value, "data2")
                        assert_equals(cursor.key,   "data2")
                        assert_equals(cursor.primaryKey, 2)
                        cursor.continue()
                        assert_equals(cursor.value, "data2")
                        assert_equals(cursor.key,   "data2")
                        assert_equals(cursor.primaryKey, 2)
                        break

                    default:
                        assert_unreached("Unexpected count: " + count)
                }

                count++;
            });
            rq.onerror = fail(this, "unexpected error")
        });


        async_test(document.title + " - fresh advance still async").step(function(e) {
            var count = 0;
            var rq = db.transaction("test").objectStore("test").index("index").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                if (!e.target.result) {
                    assert_equals(count, 2, 'count');
                    this.done();
                    return;
                }
                var cursor = e.target.result;
                cursor.advance(1)

                switch(count) {
                    case 0:
                        assert_equals(cursor.value, "data")
                        assert_equals(cursor.key,   "data")
                        assert_equals(cursor.primaryKey, 1)
                        break

                    case 1:
                        assert_equals(cursor.value, "data2")
                        assert_equals(cursor.key,   "data2")
                        assert_equals(cursor.primaryKey, 2)
                        break

                    default:
                        assert_unreached("Unexpected count: " + count)
                }

                count++;
            });
            rq.onerror = fail(this, "unexpected error")
        });


        async_test(document.title + " - fresh continue still async").step(function(e) {
            var count = 0;
            var rq = db.transaction("test").objectStore("test").openCursor();

            rq.onsuccess = this.step_func(function(e) {
                if (!e.target.result) {
                    assert_equals(count, 2, 'count');
                    this.done();
                    return;
                }
                var cursor = e.target.result;
                cursor.continue()

                switch(count) {
                    case 0:
                        assert_equals(cursor.value, "data")
                        assert_equals(cursor.key, 1)
                        break

                    case 1:
                        assert_equals(cursor.value, "data2")
                        assert_equals(cursor.key, 2)
                        break

                    default:
                        assert_unreached("Unexpected count: " + count)
                }

                count++;
            });
            rq.onerror = fail(this, "unexpected error")
        });

        // Stop blocking the testing system from hereon
        done();
    }

