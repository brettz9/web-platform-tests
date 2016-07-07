document.title = 'IDBDatabase.createIndex() - If an index with the name name already exists in this object store, the implementation must throw a DOMException of type ConstraintError ';

var t = async_test(),
    open_rq = createdb(t);

open_rq.onupgradeneeded = function (e) {
    var db = e.target.result;
    var ostore = db.createObjectStore("store");
    ostore.createIndex("a", "a");
    assert_throws("ConstraintError", function(){
        ostore.createIndex("a", "a");
    });
    t.done();
}
