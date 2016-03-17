const http = require('http');
const jascii = require('./ascii');

http.createServer((request, response) => {
  response.setHeader('Transfer-Encoding', 'chunked');
  jascii(response);
}).listen(3000, 'localhost');
