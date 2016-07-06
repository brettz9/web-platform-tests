
"use strict";
setup(function() {
  var idlArray = new IdlArray();

  var request = new XMLHttpRequest();
  request.open("GET", "interfaces.idl");
  request.send();
  request.onload = function() {
    var idls = request.responseText;

    idlArray.add_untested_idls("[PrimaryGlobal] interface Window { };");
    idlArray.add_untested_idls("interface Event { };");
    idlArray.add_untested_idls("interface EventTarget { };");

    // From Indexed DB:
    idlArray.add_idls(idls);
    idlArray.add_idls("Window implements IDBEnvironment;");

    idlArray.add_objects({
      IDBCursor: [],
      IDBCursorWithValue: [],
      IDBDatabase: [],
      IDBEnvironment: [],
      IDBFactory: ["window.indexedDB"],
      IDBIndex: [],
      IDBKeyRange: ["IDBKeyRange.only(0)"],
      IDBObjectStore: [],
      IDBOpenDBRequest: [],
      IDBRequest: [],
      IDBTransaction: [],
      IDBVersionChangeEvent: ["new IDBVersionChangeEvent('foo')"],
    });

    idlArray.test();
    done();
  };
}, {explicit_done: true});
