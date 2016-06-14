import XRegExp from 'xregexp';

/*jshint multistr: true */

// Inspired from https://github.com/Sonarr/Sonarr/blob/develop/src/NzbDrone.Core/Parser/QualityParser.cs
module.exports = {
  // Removed \b at start and end, to match things like Bluray720p
  source: XRegExp(String.raw`(?:
    (?<bluray>BluRay|Blu-Ray|HDDVD|\bBD(?:720p|1080p)*\b)|
    (?<webdl>WEB[-_. ]DL|WEBDL|WebRip|iTunesHD|WebHD|[. ]WEB[. ](?:[xh]26[45]|DD5[. ]1)|\d+0p\.WEB\.)|
    (?<hdtv>HDTV)|
    (?<bdrip>BDRip)|
    (?<brrip>BRRip)|
    \b(?<dvd>DVD|DVDRip|NTSC|PAL|xvidvd)\b|
    (?<dsr>WS[-_. ]DSR|DSR)|
    (?<pdtv>PDTV)|
    (?<sdtv>SDTV)|
    (?<tvrip>TVRip)
  )`, 'ixn'),
  rawHD: XRegExp(String.raw`\b(?<rawhd>RawHD|1080i[-_. ]HDTV|Raw[-_. ]HD|MPEG[-_. ]?2)\b`, 'gi'),
  proper: XRegExp(String.raw`\b(?<proper>proper|repack|rerip)\b`, 'gi'),
  //version: XRegExp(String.raw`\dv(?<version>\d)\b|\[v(?<version>\d)\]`, 'gi'),
  real: XRegExp(String.raw`\b(?<real>(?:REAL[-_. ])+(?:PROPER|REPACK|RERIP)|(?:PROPER|REPACK|RERIP)(?:[-_. ]REAL)+)\b`, 'gi'),
  // Removed \b at start and end, to match things like Bluray720p
  resolution: XRegExp(String.raw`(?:(?<_480p>480p|640x480|848x480)|(?<_576p>576p)|(?<_720p>720p|1280x720)|(?<_1080p>1080p|1920x1080)|(?<_2160p>2160p))`, 'gi'),
  codec: XRegExp(String.raw`\b(?:(?<x264>x264)|(?<h264>h264)|(?<xvidhd>X[-]*vidHD)|(?<xvid>X[-]*vid)|(?<divx>divx))\b`, 'gi'),
  otherSource: XRegExp(String.raw`(?<hdtv>HD[-_. ]TV)|(?<sdtv>SD[-_. ]TV)`, 'gi'),
  highDefPdtv: XRegExp(String.raw`hr[-_. ]ws`, 'gi'),
  language: XRegExp(String.raw`(?:\W|_)
    (?<italian>\b(?:ita|italian)\b)|
    (?<vo>(?:\W|_)(?:VOST[A-Z]{0,2})(?:\W|_))|
    (?<german>german\b|videomann)|
    (?<flemish>flemish)|
    (?<greek>greek)|
    (?<french>(?:\W|_)(?:FR)(?:\W|_))|
    (?<russian>\brus\b)|
    (?<dutch>nl\W?subs?)|
    (?<hungarian>\b(?:HUNDUB|HUN)
  \b)`, 'gix')
};
