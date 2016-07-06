require('../node-indexeddbshim-test');
document.title = 'Recursive value';
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

function recursive_value(desc, value) {
    var db, t = async_test(document.title + " - " + desc);

    createdb(t).onupgradeneeded = function(e) {
        db = e.target.result
        db.createObjectStore("store")
          .add(value, 1);

        e.target.onsuccess = t.step_func(function(e) {
            db.transaction('store')
              .objectStore('store')
              .get(1)
              .onsuccess = t.step_func(function(e)
            {

                try
                {
                    var fresh_value = JSON.stringify(value);
                    assert_unreached("Testcase is written wrongly, must supply something recursive (that JSON won't stringify).");
                }
                catch (e)
                {
                    if (e.name == 'TypeError')
                    {
                        try
                        {
                            JSON.stringify(e.target.result);
                            assert_unreached("Expected a non-JSON-serializable value back, didn't get that.");
                        }
                        catch (e)
                        {
                            t.done();
                            return;
                        }
                    }
                    else
                        throw e;
                }
            });
        });
    };
}

var recursive = [];
recursive.push(recursive);
recursive_value('array directly contains self', recursive);

var recursive2 = [];
recursive2.push([recursive2]);
recursive_value('array indirectly contains self', recursive2);

var recursive3 = [recursive];
recursive_value('array member contains self', recursive3);

