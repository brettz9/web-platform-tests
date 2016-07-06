
    var db, count = 0,
      t = async_test();

    t.step(function() {
        var worker = new Worker("idbworker.js");
        worker.onmessage = t.step_func(function (e) {
            switch(count) {
                case 0:
                    assert_equals(e.data, true, 'worker has idb object')
                    break

                case 1:
                    assert_equals(e.data, "test", "get(1) in worker")
                    t.done()
            }

            count++
        });

        worker.postMessage(1);
    })

