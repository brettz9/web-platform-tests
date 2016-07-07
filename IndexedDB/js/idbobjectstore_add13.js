document.title = 'IDBObjectStore.add() - Attempt to add a record where the out of line key provided does not meet the constraints of a valid key ';

    var db,
      t = async_test(),
      record = { property: "data" };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;

        var rq,
          objStore = db.createObjectStore("store");

        assert_throws("DataError",
            function() { rq = objStore.add(record, { value: 1 }); });

        assert_equals(rq, undefined);
        t.done();
    };
