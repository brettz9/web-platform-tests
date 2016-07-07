document.title = 'IDBObjectStore.add() - Attempt to add a record where the record\'s key does not meet the constraints of a valid key ';

    var db,
      t = async_test(),
      record = { key: { value: 1 }, property: "data" };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;

        var rq,
          objStore = db.createObjectStore("store", { keyPath: "key" });

        assert_throws("DataError",
            function() { rq = objStore.add(record); });

        assert_equals(rq, undefined);
        t.done();
    };
