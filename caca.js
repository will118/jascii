const fs = require('fs');
const spawn = require('child_process').spawn;

const INPUT_FRAME_DIR = 'snake_png_frames';
const OUTPUT_ROOT_DIR = 'processed_frames';
const DELAY_BETWEEN_FRAMES = 66;

function run(height, width, response) {
  console.log({height, width});
  const folderName = `${height}x${width}`;
  const processedFrameDir = `${OUTPUT_ROOT_DIR}/${folderName}`;
  fs.stat(processedFrameDir, (err, stat) => {
    if (stat) {
      console.log('Already have frames');
      playFrames(processedFrameDir, response);
    } else {
      console.log('Generating frames');
      processFrames(height, width, INPUT_FRAME_DIR, processedFrameDir, response);
    }
  });
}

function playFrames(processedFrameDir, response) {
  response.write('\033[2J');
  response.write('\033[200B');
  response.write('\033[2H');

  fs.readdir(processedFrameDir, (err, allFiles) => {
    if (err) throw err;
    const total = allFiles.length;
    (function loop(index, cache) {
      const cached = cache[index];
      const nextIndex = index + 1 == total ? 1 : index + 1;
      if (cached) {
          response.write('\033[2H');
          response.write(cached);
          setTimeout(loop, DELAY_BETWEEN_FRAMES, nextIndex, cache);
      } else {
        fs.readFile(`${processedFrameDir}/${index}`, 'utf8', (err, data) => {
          if (data) {
            response.write('\033[2H');
            response.write(data);
            setTimeout(loop, DELAY_BETWEEN_FRAMES, nextIndex, cache);
          } else {
            throw err;
          }
        });
      }
    })(1, {});
  });
}

function processFrames(height, width, inputFrameDir, processedFrameDir, response) {
  fs.mkdir(processedFrameDir, err => {
    if (err) throw err;
    fs.readdir(inputFrameDir, (err, allFiles) => {
      if (err) throw err;
      const total = allFiles.length;
      (function loop(files) {
        const file = files.shift();
        if (file) {
          const img2txt = spawn(
            'img2txt',
            [
              `--height=${height}`,
              `--width=${width}`,
              '--brightness=10',
              '-f',
              'utf8',
              `${inputFrameDir}/${file}`
            ]
          );
          const fileName = file.match(/(.+)\./)[1];
          const outFile = fs.createWriteStream(`${processedFrameDir}/${fileName}`);
          img2txt.stdout.on('data', data => {
            outFile.write(data);
          });
          img2txt.on('close', code => {
            outFile.end();
            loop(files);
          });
        } else {
          playFrames(processedFrameDir, response);
        }
      })(allFiles);
    });
  });
}

module.exports = run;
