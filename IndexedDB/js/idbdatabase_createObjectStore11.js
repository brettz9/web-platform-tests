document.title = 'IDBDatabase.createObjectStore() - attempting to create an existing object store with a different keyPath throw ConstraintError ';

var t = async_test(),
    open_rq = createdb(t);

open_rq.onupgradeneeded = function (e) {
    var db = e.target.result;
    db.createObjectStore("store");
    assert_throws("ConstraintError", function(){
        db.createObjectStore("store", {
            keyPath: "key1",
        });
    });
    t.done();
}
