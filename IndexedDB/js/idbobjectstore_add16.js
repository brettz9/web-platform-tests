document.title = 'IDBObjectStore.add() - If the object store has been deleted, the implementation must throw a DOMException of type InvalidStateError ';

    var db,
        ostore,
        t = async_test();

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function (event) {
        db = event.target.result;
        ostore = db.createObjectStore("store", {keyPath:"pKey"});
        db.deleteObjectStore("store");
        assert_throws("InvalidStateError", function(){
            ostore.add({ pKey: "primaryKey_0"});
        });
        t.done();
    }
