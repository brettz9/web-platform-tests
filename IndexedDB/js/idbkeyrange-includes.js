

  test(function() {
    var closedRange = IDBKeyRange.bound(5, 20);
    assert_true(!!closedRange.includes, "IDBKeyRange has a .includes");
    assert_true(closedRange.includes(7), "in range");
    assert_false(closedRange.includes(1), "below range");
    assert_false(closedRange.includes(42), "above range");
    assert_true(closedRange.includes(5) && closedRange.includes(20),
                 "boundary points");
    assert_throws("DataError", function() { closedRange.includes({}) },
                  "invalid key");
  }, "IDBKeyRange.includes() with a closed range");

  test(function() {
    var openRange = IDBKeyRange.bound(5, 20, true, true);
    assert_false(openRange.includes(5) || openRange.includes(20),
                 "boundary points");
  }, "IDBKeyRange.includes() with an open range");

  test(function() {
    var range = IDBKeyRange.only(42);
    assert_true(range.includes(42), "in range");
    assert_false(range.includes(1), "below range");
    assert_false(range.includes(9000), "above range");
  }, "IDBKeyRange.includes() with an only range");

  test(function() {
    var range = IDBKeyRange.lowerBound(5);
    assert_false(range.includes(4), 'value before closed lower bound');
    assert_true(range.includes(5), 'value at closed lower bound');
    assert_true(range.includes(6), 'value after closed lower bound');
  }, "IDBKeyRange.includes() with an closed lower-bounded range");

  test(function() {
    var range = IDBKeyRange.lowerBound(5, true);
    assert_false(range.includes(4), 'value before open lower bound');
    assert_false(range.includes(5), 'value at open lower bound');
    assert_true(range.includes(6), 'value after open lower bound');
  }, "IDBKeyRange.includes() with an open lower-bounded range");

  test(function() {
    var range = IDBKeyRange.upperBound(5);
    assert_true(range.includes(4), 'value before closed upper bound');
    assert_true(range.includes(5), 'value at closed upper bound');
    assert_false(range.includes(6), 'value after closed upper bound');
  }, "IDBKeyRange.includes() with an closed upper-bounded range");

  test(function() {
    var range = IDBKeyRange.upperBound(5, true);
    assert_true(range.includes(4), 'value before open upper bound');
    assert_false(range.includes(5), 'value at open upper bound');
    assert_false(range.includes(6), 'value after open upper bound');
  }, "IDBKeyRange.includes() with an open upper-bounded range");

