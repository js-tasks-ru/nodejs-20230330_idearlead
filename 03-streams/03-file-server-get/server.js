const urlModule = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs')

const server = new http.Server();


server.on('request', (req, res) => {

  const pathname = req.url.slice(1);

  console.log('url', pathname);
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Too much directories');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);
  console.log('url1', filepath)

  switch (req.method) {
    case 'GET':
      fs.stat(filepath, (err, stats) => {

        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
          } else {
            res.statusCode = 500;
            res.end('Internal server error');
          }
        } else {
          if (stats.isDirectory()) {
            res.statusCode = 400;
            res.end('Invalid file path: directory specified instead of file');
          } else {
            const myFile = fs.createReadStream(filepath)
            myFile.pipe(res);
          }
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
