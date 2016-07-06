Array.prototype.includes = function(item) {
    return this.indexOf(item) > -1;
};

const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

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
      if ($('script[src]').length !== 3) {
        console.log('Non-typical file for script src count ' + $('script[src]').length +  ': ' + htmlFile);
      }

      $('script[src]').each(function (script, item) {
        const src = $(this).attr('src');
        if (!['support.js', '/resources/testharness.js',
          '/resources/testharnessreport.js'].includes(src)) {
          console.log('Found non-typical script src: ' + src + ' in: ' + htmlFile);
        }
      });
      fs.writeFile(outputFile, $('script').text(), function(err) {
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
