import path from 'path';
import makeDebug from 'debug';
import XRegExp from 'xregexp';

import Quality from './infos/quality';
import Resolution from './infos/resolution';
import Language from './infos/language';
import Regex from './infos/regex';
import FileExtQuality from './infos/file-extension';

const debug = makeDebug('torrents-name-parser');

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

    var match = XRegExp.exec(name, Regex.language);

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
    if(XRegExp.test(normalizedName, Regex.rawHD)) {
      return Quality.RawHD;
    }

    const sourceMatch = XRegExp.exec(normalizedName, Regex.source);
    const codecMatch = XRegExp.exec(normalizedName, Regex.codec);

    debug('Source Regex matches', sourceMatch);
    debug('Codec Regex matches', codecMatch);

    if(sourceMatch !== null) {
      if (sourceMatch.bluray) {
        if (codecMatch !== null && (codecMatch.xvid || codecMatch.divx)) {
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
        if (XRegExp.test(normalizedName, Regex.highDefPdtv)) {
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

    let quality = Quality.Unknown;

    // TODO: next conditions are strange, because even if the inside if is true, second value will be set... Use else?
    if (normalizedName.indexOf('848x480') !== -1) {
      if (normalizedName.indexOf('dvd') !== -1) {
        quality = Quality.DVD;
      }

      quality = Quality.SDTV;
    }

    if (normalizedName.indexOf('1280x720') !== -1) {
      if (normalizedName.indexOf('bluray') !== -1) {
        quality = Quality.Bluray720p;
      }

      quality = Quality.HDTV720p;
    }

    if (normalizedName.indexOf('1920x1080') !== -1) {
      if (normalizedName.indexOf('bluray') !== -1) {
        quality = Quality.Bluray1080p;
      }

      quality = Quality.HDTV1080p;
    }

    if (normalizedName.indexOf('bluray720p') !== -1) {
      quality = Quality.Bluray720p;
    }

    if (normalizedName.indexOf('bluray1080p') !== -1) {
      quality = Quality.Bluray1080p;
    }

    var otherSourceMatch = XRegExp.exec(normalizedName, Regex.otherSource);
    if (otherSourceMatch !== null)
    {
      if(otherSourceMatch.sdtv) {
        quality = Quality.SDTV;
      }

      if(otherSourceMatch.hdtv) {
        quality = Quality.HDTV720p;
      }
    }

    if (quality === Quality.Unknown || quality === null) {
      const ext = path.extname(name);

      if(ext && FileExtQuality[ext]) {
        quality = FileExtQuality[ext];
      }
    }

    return quality;
  }

  parseResolution(name) {
    /*jshint curly: false */
    var match = XRegExp.exec(name, Regex.resolution);

    debug('Resolution Regex matches', match);

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

    const isProper = XRegExp.test(name, Regex.proper);

    if(isProper) {
      revision.version = 2;
    }

    /*const versionResult = XRegExp.exec(name, Regex.version);
    if(versionResult !== null) {
      revision.version = parseInt(versionResult.version);
    }*/

    return revision;
  }
}

module.exports = TorrentNameParser;
