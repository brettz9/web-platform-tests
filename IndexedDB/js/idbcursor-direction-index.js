
    var records = [ "Alice", "Bob", "Bob", "Greg" ];
    var directions = ["next", "prev", "nextunique", "prevunique"];
    var tests = {};

    directions.forEach(function(dir) {
        tests[dir] = async_test(document.title + ' - ' + dir);
    });

    var open_rq = indexedDB.open("testdb-" + new Date().getTime() + Math.random());

    open_rq.onupgradeneeded = function(e) {
        var objStore = e.target.result.createObjectStore("test");
        objStore.createIndex("idx", "name");

        for (var i = 0; i < records.length; i++)
            objStore.add({ name: records[i] }, i);
    };

    open_rq.onsuccess = function(e) {
        var db = e.target.result;
        db.onerror = fail_helper("db.onerror");


        // The tests
        testdir('next',       ['Alice:0', 'Bob:1', 'Bob:2', 'Greg:3']);
        testdir('prev',       ['Greg:3',  'Bob:2', 'Bob:1', 'Alice:0']);
        testdir('nextunique', ['Alice:0', 'Bob:1', 'Greg:3']);
        testdir('prevunique', ['Greg:3',  'Bob:1', 'Alice:0']);


        // Test function
        function testdir(dir, expect) {
            var count = 0;
            var t = tests[dir];
            var rq = db.transaction("test").objectStore("test").index("idx").openCursor(undefined, dir);
            rq.onsuccess = t.step_func(function(e) {
                var cursor = e.target.result;
                if (!cursor) {
                    assert_equals(count, expect.length, "cursor runs");
                    t.done();
                }
                assert_equals(cursor.value.name + ":" + cursor.primaryKey, expect[count], "cursor.value");
                count++;
                cursor.continue();
            });
            rq.onerror = t.step_func(function(e) {
                e.preventDefault();
                e.stopPropagation();
                assert_unreached("rq.onerror - " + e.message);
            });
        }
    };

    // Fail handling
    function fail_helper(name) {
        return function() {
            directions.forEach(function(dir) {
                tests[dir].step(function() { assert_unreached(name); });
            });
        };
    }
    open_rq.onblocked = fail_helper('open_rq.onblocked');
    open_rq.onerror = fail_helper('open_rq.onerror');
