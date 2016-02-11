const fs = require('fs');
const ImageToAscii = require('image-to-ascii');

const inputPath = 'input_frames';
const outputPath = 'output_frames';

(function asciiLoop(index) {
  const filename = `${index}.png`;
  const imagePath = `${inputPath}/${filename}`;
  const options = {
    path: imagePath,
    pxWidth: 1,
    size: {
      width: 80,
      height: 30
    }
  };

  fs.stat(imagePath, (err, stat) => {
    if (stat) {
      ImageToAscii(options, (err, data) => {
        if (err) throw err;
        const asciiFilename = filename.replace('png', 'txt');
        fs.writeFile(`${outputPath}/${asciiFilename}`, data, (err) => {
          if (err) throw err;
          asciiLoop(index + 1);
        });
      });
    }
  });
})(1);
