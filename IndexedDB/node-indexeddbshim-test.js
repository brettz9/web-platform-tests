var goodBad = require('./node-good-bad-files');
var goodFiles = goodBad.goodFiles;
var badFiles = goodBad.badFiles;

var jsdom = require('jsdom').jsdom;
var doc = jsdom('<div id="log"></div>', {});

/*
// Not needed currently, as we're running in Node
var jsdom = require('jsdom');
var virtualConsole = jsdom.createVirtualConsole();
virtualConsole.on('log', function (message) {
  console.log("console.log called ->", message);
});
var doc = jsdom.jsdom('<div id="log"></div>', {
  virtualConsole: virtualConsole
});
*/

var window = doc.defaultView;
GLOBAL.window = GLOBAL;
GLOBAL.self = window;

require('./node_modules/indexeddbshim/dist/indexeddbshim-node')(window);
// const idb = require('./node_modules/indexeddbshim/dist/indexeddbshim-UnicodeIdentifiers-node');

[
  'addEventListener', 'document', 'location', // Needed by testing framework itself
  'indexedDB', 'IDBFactory', 'IDBDatabase', 'IDBObjectStore', 'IDBIndex',
  'IDBTransaction', 'IDBCursor', 'IDBCursorWithValue', 'IDBKeyRange',
  'IDBRequest', 'IDBOpenDBRequest', 'IDBVersionChangeEvent'
].forEach(function (prop) {
  GLOBAL[prop] = window[prop];
});

// shimIndexedDB.__debug(true);
window.DOMException = window.indexedDB.modules.DOMException;
window.Event = window.indexedDB.modules.ShimEvent;

const fs = require('fs');
const path = require('path');

const fileArg = process.argv[2];
const dirPath = 'js';

var colors = require('colors/safe');
var theme = {
  pass: 'green',
  fail: 'red',
  timeout: 'red',
  notrun: 'red'
};
colors.setTheme(theme);

function write (status_text, status) {
  var color = colors[Object.keys(theme)[status]];
  var msg = color(status_text[status]);
  (process && process.stdout && process.stdout.isTTY) ? process.stdout.write(msg) : console.log(msg);
}

// Todo: Conditionally add script resources for interfaces test
readFiles(['../resources/testharness.js', '../resources/testharnessreport.js', './support.js'], function (harnessContent) {
  function readAndEvaluate (fileName) {
    fs.readFile(fileName, 'utf8', function (err, content) {
      if (err) {return console.log(err);}
      // Todo: Sandbox!!!
      eval(harnessContent.
        // Todo: Figure out a way around this?
        replace(/return window/, 'return GLOBAL').
        //
        replace(/(html \+= "<\/tbody><\/table>";)/, '$1\ntests.forEach((test) => {\n' +
              'write(status_text, test.status);\n' +
              'console.log(" (' + fileName.replace(/"/g, '\\"').replace(/\\/g, '\\\\') + '): " + test.name);\n' +
              'if (assertions) console.log(get_assertion(test));\n' +
              'if (test.message && test.stack) console.log((test.message || " ") + test.stack);\n' +
            '});\n').
        // We need to do the following two as long as addEventListener is not supported
        replace(/(function auto_fail)/, "rq_open.addEventListener = function (ev, cb) {ev['on' + ev] = cb;};\n$1").
        replace(/(auto_fail\(")/g, '// $1') +
        '\n' + content);
    });
  }
  function readAndEvaluateFiles (err, jsFiles) {
    jsFiles.some((jsFile) => {
      // console.log("'" + jsFile + "',"); return;
      // const fileName = path.join(dirPath, jsFile);
      const fileName = dirPath + '/' + jsFile;
      readAndEvaluate(fileName);
      // return true;
    });
  }
  if (fileArg === 'good') {
    readAndEvaluateFiles(null, goodFiles);
  } else if (fileArg === 'bad') {
    readAndEvaluateFiles(null, badFiles);
  } else if (fileArg && fileArg !== 'all') {
    readAndEvaluate(fileArg);
  } else {
    fs.readdir(dirPath, readAndEvaluateFiles);
  }
});

/*
// We could get better modularity in just requiring the files,
//   but this has its own problems to solve with globals
if (fileArg) {
  require(fileArg);
}
else {
  fs.readdir(dirPath, function(err, jsFiles) {
    jsFiles.forEach((jsFile) => {
      require('./' + dirPath + '/' + jsFile);
    });
  });
}
*/

function readFiles (arr, cb, i, str) {
  i = i || 0;
  str = str || '';
  if (!arr[i]) {
    return cb(str);
  }
  fs.readFile(arr[i], 'utf8', function (err, data) {
    if (err) {return console.log(err);}
    str += data;
    readFiles(arr, cb, i + 1, str);
  });
}
