# torrent-name-parser

Parse a torrent name to get accurate informations about quality, TV Show, etc.

## Installation

Be warned that the NPM module is named `torrent-name-parse`, because all other names were already taken.

```
npm install torrent-name-parse
```

## Usage

```
const TorrentNameParser = require('torrent-name-parse');

const parser = new TorrentNameParser();

const torrentData = parser.parse('DEXTER.S07E01.ARE.YOU.1080P.HDTV.proper.X264-QCF');
```

`torrentData` will now contains :

```
{
  resolution: '1080p',
  revision: { version: 2, real: null },
  language: 'English',
  year: null,
  quality: 'HDTV-1080p',
  tvshow: { season: 7, episode: 1 }
}
```

## Licence

The MIT License (MIT)

Copyright (c) 2016 Leeroy Brun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
