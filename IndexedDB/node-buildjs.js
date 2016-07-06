const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

const dirPath = process.argv[2] || './';
fs.readdir(dirPath, function(err, items) {
  const htmlExt = /\.html?$/;
  const htmlFiles = items.filter((item) => item.match(htmlExt));

  // Iterate IndexedDB files
  htmlFiles.forEach((htmlFile) => {
    const jsFile = htmlFile.replace(htmlExt, '.js');
    const outputFile = path.join('js', jsFile);

    fs.readFile(htmlFile, 'utf8', function (err, data) {
      if (err) {return console.log(err);}

      // Extract JavaScript content and save to file
      $ = cheerio.load(data);
      fs.writeFile(outputFile, $('script').text(), function(err) {
          if (err) {return console.log(err);}
          console.log("The file " + outputFile + " was saved!");
      });
    });
  });
});
