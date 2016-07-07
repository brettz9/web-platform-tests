document.title = 'IDBDatabase.createObjectStore() - attempt to create an object store with an invalid key path ';


var t = async_test(),
    open_rq = createdb(t)

open_rq.onupgradeneeded = function(e) {
    var db = e.target.result

    assert_throws('SyntaxError', function() {
            db.createObjectStore("invalidkeypath", { keyPath: "Invalid Keypath" })
        })

    assert_throws('SyntaxError', function() {
            db.createObjectStore("invalidkeypath", { autoIncrement: true,
                                                     keyPath: "Invalid Keypath" })
        })

    t.done()
}

