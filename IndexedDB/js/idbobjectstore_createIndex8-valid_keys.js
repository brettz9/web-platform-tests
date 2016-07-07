document.title = 'IDBObjectStore.createIndex() - index can be valid keys';

    var db,
      t = async_test(document.title, {timeout:19000}),
      now = new Date(),
      mar18 = new Date(1111111111111),
      ar = ["Yay", 2, -Infinity],
      num = 1337

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var txn = e.target.transaction,
          objStore = db.createObjectStore("store", { keyPath: 'key' });

        objStore.add({ key: "now",    i: now   });
        objStore.add({ key: "mar18",  i: mar18 });
        objStore.add({ key: "array",  i: ar    });
        objStore.add({ key: "number", i: num   });

        var idx = objStore.createIndex("index", "i")

        idx.get(now).onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result.key, 'now', 'key');
            assert_equals(e.target.result.i.getTime(), now.getTime(), 'getTime');
        });
        idx.get(mar18).onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result.key, 'mar18', 'key');
            assert_equals(e.target.result.i.getTime(), mar18.getTime(), 'getTime');
        });
        idx.get(ar).onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result.key, 'array', 'key');
            assert_array_equals(e.target.result.i, ar, 'array is the same');
        });
        idx.get(num).onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result.key, 'number', 'key');
            assert_equals(e.target.result.i, num, 'number is the same');
        });
    }

    open_rq.onsuccess = function() {
        t.done();
    }
