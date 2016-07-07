document.title = 'IDBObjectStore.add() - Attempt to call \'add\' without an key parameter when the object store uses out-of-line keys ';

    var db,
      t = async_test(),
      record = { property: "data" };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;

        var rq,
          objStore = db.createObjectStore("store");

        assert_throws("DataError",
            function() { rq = objStore.add(record); });

        assert_equals(rq, undefined);
        t.done();
    };
