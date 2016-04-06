const fs = require('fs');
const spawn = require('child_process').spawn;

const ffmpegArgs = [
  '-i', 'Deep.Space.Homer.mp4',
  '-vf', 'fps=15',
  '-threads', '1',
  `frames/%d.png`
];

spawn('ffmpeg', ffmpegArgs);
