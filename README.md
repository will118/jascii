##Depends on `img2txt` (caca).

# Source GIFs

http://kidmograph.tumblr.com/

I didn't make any of them.

##How to make ascii from gif

Explode gif to pngs (`imagemagick`):
```
convert source_gifs/blah.gif -coalesce blah_frames/%d.png
```

Then add an object to `caca.js` with the info:
```
  {
    name: 'blah',
    folder: 'blah_frames',
    widthPercentage: 80,
    gamma: 0.31
  }
```

The server cycles through scenes with each request.
