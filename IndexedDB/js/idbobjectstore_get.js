
    var db,
      t = async_test(),
      record = { key: 3.14159265, property: "data" };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        db.createObjectStore("store", { keyPath: "key" })
          .add(record);
    }

    open_rq.onsuccess = function(e) {
        var rq = db.transaction("store")
                   .objectStore("store")
                   .get(record.key);

        rq.onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result.key, record.key);
            assert_equals(e.target.result.property, record.property);
            t.done();
        });
    }

