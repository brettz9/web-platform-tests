document.title = 'IDBDatabase.transaction() - If storeNames is an empty list, the implementation must throw a DOMException of type InvalidAccessError';

var db,
    t = async_test(),
    open_rq = createdb(t);

open_rq.onupgradeneeded = function() {};
open_rq.onsuccess = function(e) {
    db = e.target.result;
    assert_throws('InvalidAccessError', function() { db.transaction([]); });
    t.done();
};
