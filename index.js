const http = require('http');
const url = require('url');
const caca = require('./caca');
const ascii = require('./ascii');

http.createServer((request, response) => {
  response.setHeader('Transfer-Encoding', 'chunked');
  if (request.url.indexOf('caca') > -1) {
    const params = url.parse(request.url, true);
    const query = params.query;
    if (query.h && query.w) {
      caca(query.h - 3, query.w, response);
    } else {
      response.write('curl "crap.tech/caca?w=$(tput cols)&h=$(tput lines)"');
      response.end();
    }
  } else {
    ascii(response);
  }
}).listen(3000, 'localhost');
