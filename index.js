const http = require('http');
const url = require('url');
const caca = require('./caca');
const matrix = require('./matrix');

// const DOMAIN = 'crap.tech';
const DOMAIN = 'localhost:4000';

function handleQuery(response, request, resource, cb) {
  const howTo = `curl "${DOMAIN}/${resource}?w=$(tput cols)&h=$(tput lines)"`;
  const params = url.parse(request.url, true);
  const query = params.query;
  if (parseInt(query.h) > 500 || parseInt(query.w) > 750) {
    response.write('Nice try\n');
    response.end();
  } else if (query.h && query.w) {
    cb(query.h, query.w);
  } else {
    response.write(howTo);
    response.end();
  }
}

http.createServer((request, response) => {
  response.setHeader('Transfer-Encoding', 'chunked');
  if (request.url.includes('gif')) {
    handleQuery(response, request, 'gif', (h, w) => {
      caca(h - 2, w, response);
    });
  } else if (request.url.includes('matrix')) {
    handleQuery(response, request, 'matrix', (h, w) => {
      console.log('Running matrix:', {h, w});
      matrix(h, w, response);
    });
  } else if (request.url.includes('cursor')) {
    response.write('Here you go\n');
    response.write('\033[?25h');
    response.end();
  } else {
    response.write(`curl "${DOMAIN}/gif?w=$(tput cols)&h=$(tput lines)"`);
    response.end();
  }
}).listen(4000, 'localhost');
