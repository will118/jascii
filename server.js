const http = require('http');
const fs = require('fs');

function getFrame(index, cb) {
  fs.readFile(`output_frames/${index}.txt`, 'utf8', (err, data) => {
    if (data) {
      cb(null, data);
    } else {
      cb(err);
    }
  });
}

const server = http.createServer(function(request, response) {
  response.setHeader('Transfer-Encoding', 'chunked');
  response.write('\033[2J');
  response.write('\033[200B');
  response.write('\033[2H');

  (function loop(index) {
    getFrame(index, (err, frame) => {
      if (frame) {
        response.write('\033[2H');
        response.write(frame);
        setTimeout(loop, 66, index + 1);
      } else {
        loop(1);
      }
    });
  })(1);

}).listen(1337);

console.log('server running');
