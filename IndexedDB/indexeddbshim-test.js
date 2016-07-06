GLOBAL.window = GLOBAL;
const idb = require('indexeddbshim')();
// const idb = require('.node_modules/indexeddbshim/dist/indexeddbshim-UnicodeIdentifiers-node');

// shimIndexedDB.__debug(true);
window.DOMException = indexedDB.modules.DOMException;
window.Event = indexedDB.modules.ShimEvent;

const fs = require('fs');
const path = require('path');

const fileArg = process.argv[2];
const dirPath = 'js';

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
