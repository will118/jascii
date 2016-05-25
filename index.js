const http = require('http');
const url = require('url');
const caca = require('./caca');
const fs = require('fs');

const weedScript = fs.readFileSync('player.sh', 'utf8');

http.createServer((request, response) => {
  response.setHeader('Transfer-Encoding', 'chunked');
  if (request.url.indexOf('caca') > -1) {
    const params = url.parse(request.url, true);
    const query = params.query;
    if (parseInt(query.h) > 500 || parseInt(query.w) > 750) {
      response.write('Nice try\n');
      response.end();
    } else if (query.h && query.w) {
      caca(query.h - 2, query.w, query.override, query.compress, response);
    } else {
      response.write('Eh');
      response.end();
    }
  } else if (request.url.indexOf('weed') > -1) {
    response.write(weedScript);
    response.end();
  } else if (request.url.indexOf('cursor') > -1) {
    response.write('Here you go\n');
    response.write('\033[?25h');
    response.end();
  } else {
    response.write('curl "crap.tech/caca?w=$(tput cols)&h=$(tput lines)"');
    response.end();
  }
}).listen(4000, 'localhost');
