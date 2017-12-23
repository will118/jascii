const fs = require('fs');
const spawn = require('child_process').spawn;
const helpers = require('./helpers');

const INPUT_FRAME_DIRS = [
  {
    name: 'running',
    folder: 'running_frames',
    widthPercentage: 80,
    gamma: 0.31
  },
  {
    name: 'snake',
    folder: 'snake_frames',
    gamma: 0.15
  },
  {
    name: 'thinking',
    folder: 'thinking_frames',
    widthPercentage: 70,
    gamma: 0.15
  }
];

var globalSceneIndex = 0;

const OUTPUT_ROOT_DIR = 'processed_frames';
const DELAY_BETWEEN_FRAMES = 66;

function run(height, width, response) {
  console.log({height, width});

  globalSceneIndex++;

  if (globalSceneIndex == INPUT_FRAME_DIRS.length) {
    globalSceneIndex = 0;
  }

  input = INPUT_FRAME_DIRS[globalSceneIndex];

  // fix the sizes here.
  const wPercent = input.widthPercentage;
  width = wPercent ? (wPercent / 100) * width : width;

  const processedFrameDir = `${OUTPUT_ROOT_DIR}/${input.name}-${height}x${width}`;

  fs.stat(processedFrameDir, (err, stat) => {
    helpers.setupTerminal(response);
    if (stat) {
      console.log('Already have frames');
      playFrames(processedFrameDir, response);
    } else {
      console.log('Generating frames');
      processFrames(height, width, input, processedFrameDir, response);
    }
  });
}

function playFrames(processedFrameDir, response) {
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
            cache[index] = data;
            setTimeout(loop, DELAY_BETWEEN_FRAMES, nextIndex, cache);
          } else {
            throw err;
          }
        });
      }
    })(1, {});
  });
}

function processFrames(height, width, input, processedFrameDir, response) {
  fs.mkdir(processedFrameDir, err => {
    if (err) throw err;
    fs.readdir(input.folder, (err, allFiles) => {
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
              '--brightness=10.0',
              '--contrast=1.0',
              `--gamma=${input.gamma}`,
              '--dither=fstein',
              '--format=ansi',
              `${input.folder}/${file}`
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
      })(allFiles.filter(file => file != '.DS_Store')); // mac so kool
    });
  });
}

module.exports = run;
