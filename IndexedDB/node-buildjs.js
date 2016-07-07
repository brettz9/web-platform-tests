Array.prototype.includes = function(item) {
    return this.indexOf(item) > -1;
};

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Known scripts
const testHarnessScripts = ['/resources/testharness.js', '/resources/testharnessreport.js'];
const supportAndTestHarnessScripts = testHarnessScripts.concat('support.js');
const webIDLScripts = supportAndTestHarnessScripts.concat('/resources/WebIDLParser.js', '/resources/idlharness.js');

const dirPath = process.argv[2] || './';
fs.readdir(dirPath, function(err, items) {
  const htmlExt = /\.html?$/;
  const htmlFiles = items.filter((item) => item.match(htmlExt));
  var ct = 0;

  // Iterate IndexedDB files
  htmlFiles.forEach((htmlFile, i) => {
    const jsFile = htmlFile.replace(htmlExt, '.js');
    const outputFile = path.join('js', jsFile);

    fs.readFile(htmlFile, 'utf8', function (err, data) {
      if (err) {return console.log(err);}

      // Extract JavaScript content and save to file
      $ = cheerio.load(data);

      // List files without standard 3 items
      var scriptCount = $('script[src]').length;

      // Confirm there are no unexpected elements which should be handled in the test
      // <(?!/?(script(>| src| type="text/javascript")|div( id="?log"?)?>|link|meta|!|title>|html|http|DOM|head>|body>| |=))
      $('*').each(function (i, elem) {
        if (!['html', 'head', 'body', 'meta', 'title', 'link', 'script', 'div', 'h1'].includes(elem.name)) {
          console.log('Unexpected element: ' + elem.name);
        }
        const atts = Object.keys(elem.attribs);
        if (atts.some((att) => {
            return !['src', 'type', 'id', 'rel', 'charset', 'title', 'href', 'name', 'content'].includes(att);
          })) {
          console.log('Unrecognized attributes: ' + atts + ' on element: ' + elem.name);
        }
      });

      // Build script content
      var scriptContent = '';
      // var scriptContent = "require('../node-indexeddbshim-test');\n";

      scriptContent += "document.title = '" + $('title').text().replace(/'/g, "\\'") + "';\n";
      $('script[src]').each(function (script, item) {
        const src = $(this).attr('src');
        if (scriptCount === 3 && !supportAndTestHarnessScripts.includes(src)) {
          console.log('Found non-typical script src: ' + src + ' in: ' + htmlFile);
        }
        else if (scriptCount === 2 && !testHarnessScripts.includes(src)) {
          console.log('Found non-typical script src (out of 2): ' + src + ' in: ' + htmlFile)
        }
        else if ((scriptCount < 2 || scriptCount > 3) && !webIDLScripts.includes(src)) {
          console.log('Found non-typical script src: ' + src + ' in: ' + htmlFile);
        }
        else {
          // scriptContent += "require('" + src.replace(/^\//, '../../').replace(/^support/, '../support') + "');\n";
        }
      });
      scriptContent += $('script').text();

      fs.writeFile(outputFile, scriptContent, function(err) {
        ct++;
        if (err) {return console.log(err);}
        // console.log("The file " + outputFile + " was saved!");
        if (ct === htmlFiles.length - 1) {
          console.log('All files have been saved!');
        }
      });
    });
  });
});
