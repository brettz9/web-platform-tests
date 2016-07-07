document.title = 'IDBIndex.multiEntry: array keyPath with multiEntry';

    createdb(async_test(document.title, {timeout: 10000})).onupgradeneeded = function(e) {
        var store = e.target.result.createObjectStore("store");

        assert_throws('InvalidAccessError', function() {
            store.createIndex('actors', ['name'], { multiEntry: true })
        });

        this.done();
    };
