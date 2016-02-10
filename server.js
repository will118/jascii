const http = require('http');
const fs = require('fs');
const exec = require('child_process').exec;

function getFrame(index, cb) {
  fs.readFile(`output_frames/${index}.txt`, 'utf8', (err, data) => {
    if (data) {
      cb(null, data);
    } else {
      cb(err);
    }
  });
}

function toiletInvoke(msg, cb) {
  var cmd = 'toilet -S -w 70 -f mono12 -F metal ' + msg;
  exec(cmd, function(error, stdout, stderr) { cb(stdout); });
}

const server = http.createServer(function(request, response) {
  response.setHeader('Transfer-Encoding', 'chunked');
  response.write('\033[2J');
  response.write('\033[200B');
  response.write('\033[2H');

  toiletInvoke('CRAPTECH', crapTech => {
    (function loop(index) {
      getFrame(index, (err, frame) => {
        if (frame) {
          response.write('\033[2H');
          response.write(crapTech);
          response.write(frame);
          setTimeout(loop, 66, index + 1);
        } else {
          loop(1);
        }
      });
    })(1);
  });

}).listen(1337);

console.log('server running');
