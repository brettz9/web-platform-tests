require('../node-indexeddbshim-test');
document.title = 'IDBDatabase.createIndex() - If keyPath is not a valid key path, the implementation must throw a DOMException of type SyntaxError ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

var t = async_test(),
    open_rq = createdb(t);

open_rq.onupgradeneeded = function (e) {
    var db = e.target.result;
    var ostore = db.createObjectStore("store");
    assert_throws("SyntaxError", function(){
        ostore.createIndex("ab", ".");
    });
    t.done();
}
