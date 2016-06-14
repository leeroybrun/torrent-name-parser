/*jshint multistr: true */

import makeDebug from 'debug';
import XRegExp from 'xregexp';

const debug = makeDebug('torrents-search:name-parser');

const Quality = {
  Unknown:      { name: null, weight: 1 },
  SDTV:         { name: 'SDTV', weight: 2 },
  DVD:          { name: 'DVD', weight: 3 },
  WEBDL1080p:   { name: 'WEBDL-1080p', weight: 4 },
  HDTV720p:     { name: 'HDTV-720p', weight: 5 },
  WEBDL720p:    { name: 'WEBDL-720p', weight: 6 },
  Bluray720p:   { name: 'Bluray-720p', weight: 7 },
  Bluray1080p:  { name: 'Bluray-1080p', weight: 8 },
  WEBDL480p:    { name: 'WEBDL-480p', weight: 9 },
  HDTV1080p:    { name: 'HDTV-1080p', weight: 10 },
  RawHD:        { name: 'Raw-HD', weight: 11 },
  HDTV2160p:    { name: 'HDTV-2160p', weight: 12 },
  WEBDL2160p:   { name: 'WEBDL-2160p', weight: 13 },
  Bluray2160p:  { name: 'DVD', weight: 14 }
};

const Resolution = {
  _480p: '480p',
  _576p: '576p',
  _720p: '720p',
  _1080p: '1080p',
  _2160p: '2160p',
  Unknown: null
};

const Language = {
  Unknown: null,
  English: 'English',
  French: 'French',
  Spanish: 'Spanish',
  German: 'German',
  Italian: 'Italian',
  Danish: 'Danish',
  Dutch: 'Dutch',
  Japanese: 'Japanese',
  Cantonese: 'Cantonese',
  Mandarin: 'Mandarin',
  Russian: 'Russian',
  Polish: 'Polish',
  Vietnamese: 'Vietnamese',
  Swedish: 'Swedish',
  Norwegian: 'Norwegian',
  Finnish: 'Finnish',
  Turkish: 'Turkish',
  Portuguese: 'Portuguese',
  Flemish: 'Flemish',
  Greek: 'Greek',
  Korean: 'Korean',
  Hungarian: 'Hungarian'
};

// Inspired from https://github.com/Sonarr/Sonarr/blob/develop/src/NzbDrone.Core/Parser/QualityParser.cs
const REGEX = {
  source: XRegExp('\b(?:\
    (?<bluray>BluRay|Blu-Ray|HDDVD|BD)|\
    (?<webdl>WEB[-_. ]DL|WEBDL|WebRip|iTunesHD|WebHD|[. ]WEB[. ](?:[xh]26[45]|DD5[. ]1)|\d+0p\.WEB\.)|\
    (?<hdtv>HDTV)|\
    (?<bdrip>BDRip)|\
    (?<brrip>BRRip)|\
    (?<dvd>DVD|DVDRip|NTSC|PAL|xvidvd)|\
    (?<dsr>WS[-_. ]DSR|DSR)|\
    (?<pdtv>PDTV)|\
    (?<sdtv>SDTV)|\
    (?<tvrip>TVRip)\
  )\b', 'gix'),
  rawHD: XRegExp('\b(?<rawhd>RawHD|1080i[-_. ]HDTV|Raw[-_. ]HD|MPEG[-_. ]?2)\b', 'gi'),
  proper: XRegExp('\b(?<proper>proper|repack|rerip)\b', 'gi'),
  version: XRegExp('\dv(?<version>\d)\b|\[v(?<version>\d)\]', 'gi'),
  real: XRegExp('\b(?<real>(?:REAL[-_. ])+(?:PROPER|REPACK|RERIP)|(?:PROPER|REPACK|RERIP)(?:[-_. ]REAL)+)\b', 'gi'),
  resolution: XRegExp(String.raw`\b(?:(?<_480p>480p|640x480|848x480)|(?<_576p>576p)|(?<_720p>720p|1280x720)|(?<_1080p>1080p|1920x1080)|(?<_2160p>2160p))\b`, 'gi'),
  codec: XRegExp('\b(?:(?<x264>x264)|(?<h264>h264)|(?<xvidhd>XvidHD)|(?<xvid>Xvid)|(?<divx>divx))\b', 'gi'),
  otherSource: XRegExp('(?<hdtv>HD[-_. ]TV)|(?<sdtv>SD[-_. ]TV)', 'gi'),
  highDefPdtv: XRegExp('hr[-_. ]ws', 'gi'),
  language: XRegExp('(?:\W|_)\
    (?<italian>\b(?:ita|italian)\b)|\
    (?<german>german\b|videomann)|\
    (?<flemish>flemish)|\
    (?<greek>greek)|\
    (?<french>(?:\W|_)(?:FR|VOSTFR)(?:\W|_))|\
    (?<russian>\brus\b)|\
    (?<dutch>nl\W?subs?)|\
    (?<hungarian>\b(?:HUNDUB|HUN)\
  \b)', 'gix')
};

class TorrentNameParser {
  constructor() {

  }

  parse(name) {
    debug(`Trying to parse torrent name : ${name}.`);

    name = name.trim();
    const normalizedName = name.replace(/_/g, ' ');

    const infos = {
      resolution: this.parseResolution(normalizedName),
      revision: this.parseRevision(normalizedName),
      language: this.parseLanguage(name)
      // Continue with this :
      // https://github.com/Sonarr/Sonarr/blob/develop/src/NzbDrone.Core/Parser/Parser.cs
      // https://github.com/Sonarr/Sonarr/blob/develop/src/NzbDrone.Core/Parser/ParsingService.cs
      //
      // And this : https://github.com/clems6ever/torrent-name-parser/blob/master/parts/common.js
    };


    infos.quality = this.parseQuality(name, normalizedName, infos.resolution).name;

    return infos;
  }

  parseLanguage(name) {
    /*jshint curly: false */
    const lowerName = name.toLowerCase();

    if (lowerName.indexOf('english') !== -1)
      return Language.English;

    if (lowerName.indexOf('french') !== -1)
      return Language.French;

    if (lowerName.indexOf('spanish') !== -1)
      return Language.Spanish;

    if (lowerName.indexOf('danish') !== -1)
      return Language.Danish;

    if (lowerName.indexOf('dutch') !== -1)
      return Language.Dutch;

    if (lowerName.indexOf('japanese') !== -1)
      return Language.Japanese;

    if (lowerName.indexOf('cantonese') !== -1)
      return Language.Cantonese;

    if (lowerName.indexOf('mandarin') !== -1)
      return Language.Mandarin;

    if (lowerName.indexOf('korean') !== -1)
      return Language.Korean;

    if (lowerName.indexOf('russian') !== -1)
      return Language.Russian;

    if (lowerName.indexOf('polish') !== -1)
      return Language.Polish;

    if (lowerName.indexOf('vietnamese') !== -1)
      return Language.Vietnamese;

    if (lowerName.indexOf('swedish') !== -1)
      return Language.Swedish;

    if (lowerName.indexOf('norwegian') !== -1)
      return Language.Norwegian;

    if (lowerName.indexOf('nordic') !== -1)
      return Language.Norwegian;

    if (lowerName.indexOf('finnish') !== -1)
      return Language.Finnish;

    if (lowerName.indexOf('turkish') !== -1)
      return Language.Turkish;

    if (lowerName.indexOf('portuguese') !== -1)
      return Language.Portuguese;

    if (lowerName.indexOf('hungarian') !== -1)
      return Language.Hungarian;

    var match = XRegExp.exec(name, REGEX.language);

    if(match === null) return Language.Unknown;
    if (match.italian) return Language.Italian;
    if (match.german) return Language.German;
    if (match.flemish) return Language.Flemish;
    if (match.greek) return Language.Greek;
    if (match.french) return Language.French;
    if (match.russian) return Language.Russian;
    if (match.dutch) return Language.Dutch;
    if (match.hungarian) return Language.Hungarian;

    return Language.English;
  }

  parseQuality(name, normalizedName, resolution) {
    if(REGEX.rawHD.test(normalizedName)) {
      return Quality.RawHD;
    }

    const sourceMatch = XRegExp.exec(normalizedName, REGEX.source);
    const codecMatch = XRegExp.exec(normalizedName, REGEX.codec);

    if(sourceMatch !== null) {
      if (sourceMatch.bluray) {
        if (codecMatch.xvid || codecMatch.divx) {
          return Quality.DVD;
        }

        switch(resolution) {
          case Resolution._2160p:
            return Quality.Bluray2160p;

          case Resolution._1080p:
            return Quality.Bluray1080p;

          case Resolution._480p:
          case Resolution._576p:
            return Quality.DVD;

          default:
            return Quality.Bluray720p;
        }
      }

      if (sourceMatch.webdl) {
        switch(resolution) {
          case Resolution._2160p:
            return Quality.WEBDL2160p;

          case Resolution._1080p:
            return Quality.WEBDL1080p;

          case Resolution._720p:
            return Quality.WEBDL720p;

          default:
            if (name.indexOf('[WEBDL]') !== -1) {
              return Quality.WEBDL720p;
            }

            return Quality.WEBDL480p;
        }
      }

      if (sourceMatch.hdtv) {
        switch(resolution) {
          case Resolution._2160p:
            return Quality.HDTV2160p;

          case Resolution._1080p:
            return Quality.HDTV1080p;

          case Resolution._720p:
            return Quality.HDTV720p;

          default:
            if (name.indexOf('[HDTV]') !== -1) {
              return Quality.HDTV720p;
            }

            return Quality.SDTV;
        }
      }

      if (sourceMatch.bdrip || sourceMatch.brrip) {
        switch (resolution) {
          case Resolution._720p:
            return Quality.Bluray720p;

          case Resolution._1080p:
            return Quality.Bluray1080p;

          default:
            return Quality.DVD;
        }
      }

      if (sourceMatch.dvd)
      {
        return Quality.DVD;
      }

      if (sourceMatch.pdtv || sourceMatch.sdtv || sourceMatch.dsr || sourceMatch.tvrip) {
        if (REGEX.highDefPdtv.test(normalizedName)) {
          return Quality.HDTV720p;
        }

        return Quality.SDTV;
      }
    }

    switch(resolution) {
      case Resolution._2160p:
        return Quality.HDTV2160p;

      case Resolution._1080p:
        return Quality.HDTV1080p;

      case Resolution._720p:
        return Quality.HDTV720p;

      case Resolution._480p:
        return Quality.SDTV;
    }

    if (codecMatch !== null && codecMatch.x264) {
      return Quality.SDTV;
    }

    if (normalizedName.indexOf('848x480') !== -1) {
      if (normalizedName.indexOf('dvd') !== -1) {
        return Quality.DVD;
      }

      return Quality.SDTV;
    }

    if (normalizedName.indexOf('1280x720') !== -1) {
      if (normalizedName.indexOf('bluray') !== -1) {
        return Quality.Bluray720p;
      }

      return Quality.HDTV720p;
    }

    if (normalizedName.indexOf('1920x1080') !== -1) {
      if (normalizedName.indexOf('bluray') !== -1) {
        return Quality.Bluray1080p;
      }

      return Quality.HDTV1080p;
    }

    if (normalizedName.indexOf('bluray720p') !== -1) {
      return Quality.Bluray720p;
    }

    if (normalizedName.indexOf('bluray1080p') !== -1) {
      return Quality.Bluray1080p;
    }

    var otherSourceMatch = XRegExp.exec(normalizedName, REGEX.otherSource);
    if (otherSourceMatch !== null)
    {
      if(otherSourceMatch.sdtv) {
        return Quality.SDTV;
      }

      if(otherSourceMatch.hdtv) {
        return Quality.HDTV720p;
      }
    }

    return Quality.Unknown;
  }

  parseResolution(name) {
    /*jshint curly: false */
    var match = XRegExp.exec(name, REGEX.resolution);

    if(match === null) return Resolution.Unknown;
    if(match._480p) return Resolution._480p;
    if(match._576p) return Resolution._576p;
    if(match._720p) return Resolution._720p;
    if(match._1080p) return Resolution._1080p;
    if(match._2160p) return Resolution._2160p;
  }

  parseRevision(name) {
    const revision = {
      version: 1,
      real: null
    };

    if(REGEX.proper.test(name)) {
      revision.version = 2;
    }

    /*const versionResult = XRegExp.exec(name, REGEX.version);
    if(versionResult !== null) {
      revision.version = parseInt(versionResult.version);
    }*/

    return revision;
  }
}

module.exports = TorrentNameParser;
