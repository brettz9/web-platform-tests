require('../node-indexeddbshim-test');
require('../../resources/testharness.js');
require('../../resources/testharnessreport.js');
require('../support.js');

    createdb(async_test(document.title, {timeout: 10000})).onupgradeneeded = function(e) {
        var store = e.target.result.createObjectStore("store");

        assert_throws('InvalidAccessError', function() {
            store.createIndex('actors', ['name'], { multiEntry: true })
        });

        this.done();
    };
