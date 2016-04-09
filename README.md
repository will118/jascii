# Source

http://kidmograph.tumblr.com/

I didn't make any of the source GIFs.

##How to make ascii from gif

Explode gif to pngs (`brew install imagemagick`):
```
convert blah.gif -coalesce blah_frames/%d.png
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

When I'm testing I usually just comment all the other ones, also remember to
delete `processed_frames/*` because it caches.

It depends on `img2txt` (caca).
