

            // TypeError: bound requires more than 0 arguments
            test( function() {
                assert_throws(new TypeError(), function() {
                    IDBKeyRange.bound();
                });
            }, "IDBKeyRange.bound() - bound requires more than 0 arguments.");

            // Null parameters
            test( function() {
                assert_throws("DataError", function() {
                    IDBKeyRange.bound(null, null);
                });
            }, "IDBKeyRange.bound(null, null) - null parameters are incorrect.");

            // // Null parameter
            test( function() {
                assert_throws("DataError", function() {
                    IDBKeyRange.bound(1, null);
                });
                assert_throws("DataError", function() {
                    IDBKeyRange.bound(null, 1);
                });
            }, "IDBKeyRange.bound(1, null / null, 1) - null parameter is incorrect.");

            // bound incorrect
            test( function() {
                var lowerBad = Math.floor(Math.random()*31) + 5;
                var upper = lowerBad - 1;
                assert_throws("DataError", function() {
                    IDBKeyRange.bound(lowerBad, upper);
                });
                assert_throws("DataError", function() {
                    IDBKeyRange.bound('b', 'a');
                });
            }, "IDBKeyRange.bound(lower, upper / lower > upper) -  'lower' is greater than 'upper'."
            );

            test( function() {
                assert_throws("DataError", function() {
                    IDBKeyRange.bound('a', 1);
                });
                assert_throws("DataError", function() {
                    IDBKeyRange.bound(new Date(), 1);
                });
                assert_throws("DataError", function() {
                    IDBKeyRange.bound([1, 2], 1);
                });
            }, "IDBKeyRange.bound(DOMString/Date/Array, 1) - A DOMString, Date and Array are greater than a float.");


            // ReferenceError: the variable is not defined
            test( function() {
                var goodVariable = 1;
                assert_throws(new ReferenceError(), function() {
                    IDBKeyRange.bound(noExistingVariable, 1);
                });
                assert_throws(new ReferenceError(), function() {
                    IDBKeyRange.bound(goodVariable, noExistingVariable);
                });
            }, "IDBKeyRange.bound(noExistingVariable, 1 / goodVariable, noExistingVariable) - noExistingVariable is not defined.");

            // Valid type key error
            test( function() {
                assert_throws("DataError", function() {
                    IDBKeyRange.bound(true, 1);
                });
            }, "IDBKeyRange.bound(true, 1) - boolean is not a valid key type.");


        