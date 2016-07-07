document.title = 'IDBDatabase.createObjectStore() - attempt to create an object store outside of a version change transaction ';


var t = async_test(),
    open_rq = createdb(t)

open_rq.onupgradeneeded = function() {}
open_rq.onsuccess = function (e) {
    var db = e.target.result
    assert_throws(
        'InvalidStateError',
        function() { db.createObjectStore('fails') })
    t.done();
}

