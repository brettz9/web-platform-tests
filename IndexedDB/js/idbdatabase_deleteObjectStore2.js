require('../node-indexeddbshim-test');
document.title = 'IDBDatabase.deleteObjectStore() - attempt to remove an object store outside of a version change transaction ';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');


var t = async_test(),
    open_rq = createdb(t);

open_rq.onupgradeneeded = function(e)
{
    var db = e.target.result,
        objStore = db.createObjectStore("delete_outside");

    e.target.transaction.oncomplete = t.step_func(function (e)
    {
        assert_throws('InvalidStateError',
            function() { db.deleteObjectStore("delete_outside"); });
        t.done();
    });
}

