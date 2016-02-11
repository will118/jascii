##HOW TO

First we explode gif to pngs (`brew install imagemagick`):
```
convert snake.gif -coalesce input_frames/%d.png
```

Then convert the pngs to ascii (you might want to mess with dimensions):
```
node process_png_frames.js
```

Then copy the contents of `output_frames` to a folder (say `foo`):
```
mkdir foo
mv output_frames/* foo
```

Then add `foo` to the array at the top of `index.js`.

The server cycles through scenes with each request.
