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

function jascii(stream) {
  stream.write('\033[2J');
  stream.write('\033[200B');
  stream.write('\033[2H');

  (function loop(index) {
    getFrame(index, (err, frame) => {
      if (frame) {
        stream.write('\033[2H');
        stream.write(frame);
        setTimeout(loop, 66, index + 1);
      } else {
        loop(1);
      }
    });
  })(1);
}
