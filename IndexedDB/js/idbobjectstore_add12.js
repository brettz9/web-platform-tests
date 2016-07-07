document.title = 'IDBObjectStore.add() - Attempt to add a record where the record\'s in-line key is not defined ';

    var db,
      t = async_test(),
      record = { property: "data" };

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
