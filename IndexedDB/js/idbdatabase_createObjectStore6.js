require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');


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

