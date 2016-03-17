const fs = require('fs');

const scenes = [
  'tree_frames',
  'snake_frames'
];

function getFrame(sceneIndex, index, cb) {
  const folder = scenes[sceneIndex];
  fs.readFile(`${__dirname}/${folder}/${index}.txt`, 'utf8', (err, data) => {
    if (data) {
      cb(null, data);
    } else {
      cb(err);
    }
  });
}

var globalSceneIndex = 0;

function jascii(stream) {
  stream.write('\033[2J');
  stream.write('\033[200B');
  stream.write('\033[2H');

  globalSceneIndex++;

  if (globalSceneIndex == scenes.length) {
    globalSceneIndex = 0;
  }

  (function loop(sceneIndex, index) {
    getFrame(sceneIndex, index, (err, frame) => {
      if (frame) {
        stream.write('\033[2H');
        stream.write(frame);
        setTimeout(loop, 66, sceneIndex, index + 1);
      } else {
        loop(sceneIndex, 1);
      }
    });
  })(globalSceneIndex, 1);
}

module.exports = jascii;
