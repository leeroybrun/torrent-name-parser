'use babel';

import chai from 'chai';

import TorrentNameParser from '../src/torrent-name-parser';

const expect = chai.expect;

// See: https://github.com/Sonarr/Sonarr/blob/develop/src/NzbDrone.Core.Test/ParserTests/QualityParserFixture.cs

// Regex ^ *\[TestCase\("([^"]+)", (false|true)\)\]
const testCases = [
  {
    quality: 'SDTV',
    torrents: [
      ['S07E23 .avi', false],
      ['The.Shield.S01E13.x264-CtrlSD', false],
      ['Nikita S02E01 HDTV XviD 2HD', false],
      ['Gossip Girl S05E11 PROPER HDTV XviD 2HD', true],
      ['The Jonathan Ross Show S02E08 HDTV x264 FTP', false],
      ['White.Van.Man.2011.S02E01.WS.PDTV.x264-TLA', false],
      ['White.Van.Man.2011.S02E01.WS.PDTV.x264-REPACK-TLA', true],
      ['The Real Housewives of Vancouver S01E04 DSR x264 2HD', false],
      ['Vanguard S01E04 Mexicos Death Train DSR x264 MiNDTHEGAP', false],
      ['Chuck S11E03 has no periods or extension HDTV', false],
      ['Chuck.S04E05.HDTV.XviD-LOL', false],
      ['Sonny.With.a.Chance.S02E15.avi', false],
      ['Sonny.With.a.Chance.S02E15.xvid', false],
      ['Sonny.With.a.Chance.S02E15.divx', false],
      ['The.Girls.Next.Door.S03E06.HDTV-WiDE', false],
      ['Degrassi.S10E27.WS.DSR.XviD-2HD', false],
      ['[HorribleSubs] Yowamushi Pedal - 32 [480p]', false],
      ['[CR] Sailor Moon - 004 [480p][48CE2D0F]', false],
      ['[Hatsuyuki] Naruto Shippuuden - 363 [848x480][ADE35E38]', false],
      ['Muppet.Babies.S03.TVRip.XviD-NOGRP', false]
    ]
  },
  {
    quality: 'DVD',
    torrents: [
      ['WEEDS.S03E01-06.DUAL.XviD.Bluray.AC3-REPACK.-HELLYWOOD.avi', true],
      ['The.Shield.S01E13.NTSC.x264-CtrlSD', false],
      ['WEEDS.S03E01-06.DUAL.BDRip.XviD.AC3.-HELLYWOOD', false],
      ['WEEDS.S03E01-06.DUAL.BDRip.X-viD.AC3.-HELLYWOOD', false],
      ['WEEDS.S03E01-06.DUAL.BDRip.XviD.AC3.-HELLYWOOD.avi', false],
      ['WEEDS.S03E01-06.DUAL.XviD.Bluray.AC3.-HELLYWOOD.avi', false],
      ['The.Girls.Next.Door.S03E06.DVDRip.XviD-WiDE', false],
      ['The.Girls.Next.Door.S03E06.DVD.Rip.XviD-WiDE', false],
      ['the.shield.1x13.circles.ws.xvidvd-tns', false],
      ['the_x-files.9x18.sunshine_days.ac3.ws_dvdrip_xvid-fov.avi', false],
      ['[FroZen] Miyuki - 23 [DVD][7F6170E6]', false],
      ['Hannibal.S01E05.576p.BluRay.DD5.1.x264-HiSD', false],
      ['Hannibal.S01E05.480p.BluRay.DD5.1.x264-HiSD', false],
      ['Heidi Girl of the Alps (BD)(640x480(RAW) (BATCH 1) (1-13)', false],
      ['[Doki] Clannad - 02 (848x480 XviD BD MP3) [95360783]', false],
      ['WEEDS.S03E01-06.DUAL.BDRip.AC3.-HELLYWOOD', false]
    ]
  },
  {
    quality: 'WEBDL-480p',
    torrents: [
      ['Elementary.S01E10.The.Leviathan.480p.WEB-DL.x264-mSD', false],
      ['Glee.S04E10.Glee.Actually.480p.WEB-DL.x264-mSD', false],
      ['The.Big.Bang.Theory.S06E11.The.Santa.Simulation.480p.WEB-DL.x264-mSD', false],
      ['Da.Vincis.Demons.S02E04.480p.WEB.DL.nSD.x264-NhaNc3', false]
    ]
  },
  {
    quality: 'HDTV-720p',
    torrents: [
      ['Dexter - S01E01 - Title [HDTV]', false],
      ['Dexter - S01E01 - Title [HDTV-720p]', false],
      ['Pawn Stars S04E87 REPACK 720p HDTV x264 aAF', true],
      ['Sonny.With.a.Chance.S02E15.720p', false],
      ['S07E23 - [HDTV-720p].mkv ', false],
      ['Chuck - S22E03 - MoneyBART - HD TV.mkv', false],
      ['S07E23.mkv ', false],
      ['Two.and.a.Half.Men.S08E05.720p.HDTV.X264-DIMENSION', false],
      ['Sonny.With.a.Chance.S02E15.mkv', false],
      ['Gem.Hunt.S01E08.Tourmaline.Nepal.720p.HDTV.x264-DHD', false],
      ['[Underwater-FFF] No Game No Life - 01 (720p) [27AAA0A0]', false],
      ['[Doki] Mahouka Koukou no Rettousei - 07 (1280x720 Hi10P AAC) [80AF7DDE]', false],
      ['[Doremi].Yes.Pretty.Cure.5.Go.Go!.31.[1280x720].[C65D4B1F].mkv', false],
      ['[HorribleSubs]_Fairy_Tail_-_145_[720p]', false],
      ['[Eveyuu] No Game No Life - 10 [Hi10P 1280x720 H264][10B23BD8]', false],
      ['Hells.Kitchen.US.S12E17.HR.WS.PDTV.X264-DIMENSION', false],
      ['Survivorman.The.Lost.Pilots.Summer.HR.WS.PDTV.x264-DHD', false]
    ]
  },
  {
    quality: 'HDTV-1080p',
    torrents: [
      ['Under the Dome S01E10 Let the Games Begin 1080p', false],
      ['DEXTER.S07E01.ARE.YOU.1080P.HDTV.X264-QCF', false],
      ['DEXTER.S07E01.ARE.YOU.1080P.HDTV.x264-QCF', false],
      ['DEXTER.S07E01.ARE.YOU.1080P.HDTV.proper.X264-QCF', true],
      ['Dexter - S01E01 - Title [HDTV-1080p]', false],
      ['[HorribleSubs] Yowamushi Pedal - 32 [1080p]', false]
    ]
  },
  {
    quality: 'WEBDL-720p',
    torrents: [
      ['Arrested.Development.S04E01.720p.WEBRip.AAC2.0.x264-NFRiP', false],
      ['Vanguard S01E04 Mexicos Death Train 720p WEB DL', false],
      ['Hawaii Five 0 S02E21 720p WEB DL DD5 1 H 264', false],
      ['Castle S04E22 720p WEB DL DD5 1 H 264 NFHD', false],
      ['Chuck - S11E06 - D-Yikes! - 720p WEB-DL.mkv', false],
      ['Sonny.With.a.Chance.S02E15.720p.WEB-DL.DD5.1.H.264-SURFER', false],
      ['S07E23 - [WEBDL].mkv ', false],
      ['Fringe S04E22 720p WEB-DL DD5.1 H264-EbP.mkv', false],
      ['House.S04.720p.Web-Dl.Dd5.1.h264-P2PACK', false],
      ['Da.Vincis.Demons.S02E04.720p.WEB.DL.nSD.x264-NhaNc3', false],
      ['CSI.Miami.S04E25.720p.iTunesHD.AVC-TVS', false],
      ['Castle.S06E23.720p.WebHD.h264-euHD', false],
      ['The.Nightly.Show.2016.03.14.720p.WEB.x264-spamTV', false],
      ['The.Nightly.Show.2016.03.14.720p.WEB.h264-spamTV', false]
    ]
  },
  {
    quality: 'WEBDL-1080p',
    torrents: [
      ['Arrested.Development.S04E01.iNTERNAL.1080p.WEBRip.x264-QRUS', false],
      ['CSI NY S09E03 1080p WEB DL DD5 1 H264 NFHD', false],
      ['Two and a Half Men S10E03 1080p WEB DL DD5 1 H 264 NFHD', false],
      ['Criminal.Minds.S08E01.1080p.WEB-DL.DD5.1.H264-NFHD', false],
      ['Its.Always.Sunny.in.Philadelphia.S08E01.1080p.WEB-DL.proper.AAC2.0.H.264', true],
      ['Two and a Half Men S10E03 1080p WEB DL DD5 1 H 264 REPACK NFHD', true],
      ['Glee.S04E09.Swan.Song.1080p.WEB-DL.DD5.1.H.264-ECI', false],
      ['The.Big.Bang.Theory.S06E11.The.Santa.Simulation.1080p.WEB-DL.DD5.1.H.264', false],
      ['Rosemary\'s.Baby.S01E02.Night.2.[WEBDL-1080p].mkv', false],
      ['The.Nightly.Show.2016.03.14.1080p.WEB.x264-spamTV', false],
      ['The.Nightly.Show.2016.03.14.1080p.WEB.h264-spamTV', false],
      ['Psych.S01.1080p.WEB-DL.AAC2.0.AVC-TrollHD', false],
      ['Series Title S06E08 1080p WEB h264-EXCLUSIVE', false],
      ['Series Title S06E08 No One PROPER 1080p WEB DD5 1 H 264-EXCLUSIVE', true]
    ]
  },
  {
    quality: 'WEBDL-2160p',
    torrents: [
      ['CASANOVA S01E01.2160P AMZN WEBRIP DD2.0 HI10P X264-TROLLUHD', false],
      ['JUST ADD MAGIC S01E01.2160P AMZN WEBRIP DD2.0 X264-TROLLUHD', false],
      ['The.Man.In.The.High.Castle.S01E01.2160p.AMZN.WEBRip.DD2.0.Hi10p.X264-TrollUHD', false],
      ['The Man In the High Castle S01E01 2160p AMZN WEBRip DD2.0 Hi10P x264-TrollUHD', false],
      ['The.Nightly.Show.2016.03.14.2160p.WEB.x264-spamTV', false],
      ['The.Nightly.Show.2016.03.14.2160p.WEB.h264-spamTV', false],
      ['The.Nightly.Show.2016.03.14.2160p.WEB.PROPER.h264-spamTV', true]
    ]
  },
  {
    quality: 'Bluray-720p',
    torrents: [
      ['WEEDS.S03E01-06.DUAL.Bluray.AC3.-HELLYWOOD.avi', false],
      ['Chuck - S01E03 - Come Fly With Me - 720p BluRay.mkv', false],
      ['The Big Bang Theory.S03E01.The Electric Can Opener Fluctuation.m2ts', false],
      ['Revolution.S01E02.Chained.Heat.[Bluray720p].mkv', false],
      ['[FFF] DATE A LIVE - 01 [BD][720p-AAC][0601BED4]', false],
      ['[coldhell] Pupa v3 [BD720p][03192D4C]', false],
      ['[RandomRemux] Nobunagun - 01 [720p BD][043EA407].mkv', false],
      ['[Kaylith] Isshuukan Friends Specials - 01 [BD 720p AAC][B7EEE164].mkv', false],
      ['WEEDS.S03E01-06.DUAL.Blu-ray.AC3.-HELLYWOOD.avi', false],
      ['WEEDS.S03E01-06.DUAL.720p.Blu-ray.AC3.-HELLYWOOD.avi', false],
      ['[Elysium]Lucky.Star.01(BD.720p.AAC.DA)[0BB96AD8].mkv', false],
      ['Battlestar.Galactica.S01E01.33.720p.HDDVD.x264-SiNNERS.mkv', false],
      ['The.Expanse.S01E07.RERIP.720p.BluRay.x264-DEMAND', true]
    ]
  },
  {
    quality: 'Bluray-1080p',
    torrents: [
      ['Chuck - S01E03 - Come Fly With Me - 1080p BluRay.mkv', false],
      ['Sons.Of.Anarchy.S02E13.1080p.BluRay.x264-AVCDVD', false],
      ['Revolution.S01E02.Chained.Heat.[Bluray1080p].mkv', false],
      ['[FFF] Namiuchigiwa no Muromi-san - 10 [BD][1080p-FLAC][0C4091AF]', false],
      ['[coldhell] Pupa v2 [BD1080p][5A45EABE].mkv', false],
      ['[Kaylith] Isshuukan Friends Specials - 01 [BD 1080p FLAC][429FD8C7].mkv', false],
      ['[Zurako] Log Horizon - 01 - The Apocalypse (BD 1080p AAC) [7AE12174].mkv', false],
      ['WEEDS.S03E01-06.DUAL.1080p.Blu-ray.AC3.-HELLYWOOD.avi', false],
      ['[Coalgirls]_Durarara!!_01_(1920x1080_Blu-ray_FLAC)_[8370CB8F].mkv', false],
    ]
  },
  {
    quality: 'Raw-HD',
    torrents: [
      ['POI S02E11 1080i HDTV DD5.1 MPEG2-TrollHD', false],
      ['How I Met Your Mother S01E18 Nothing Good Happens After 2 A.M. 720p HDTV DD5.1 MPEG2-TrollHD', false],
      ['The Voice S01E11 The Finals 1080i HDTV DD5.1 MPEG2-TrollHD', false],
      ['Californication.S07E11.1080i.HDTV.DD5.1.MPEG2-NTb.ts', false],
      ['Game of Thrones S04E10 1080i HDTV MPEG2 DD5.1-CtrlHD.ts', false],
      ['VICE.S02E05.1080i.HDTV.DD2.0.MPEG2-NTb.ts', false],
      ['Show - S03E01 - Episode Title Raw-HD.ts', false],
      ['Saturday.Night.Live.Vintage.S10E09.Eddie.Murphy.The.Honeydrippers.1080i.UPSCALE.HDTV.DD5.1.MPEG2-zebra', false],
      ['The.Colbert.Report.2011-08-04.1080i.HDTV.MPEG-2-CtrlHD', false],
    ]
  },
  {
    quality: null,
    torrents: [
      ['Sonny.With.a.Chance.S02E15', false],
      ['Law & Order: Special Victims Unit - 11x11 - Quickie', false],
      ['Series.Title.S01E01.webm', false],
      ['Droned.S01E01.The.Web.MT-dd', false],
    ]
  }
];

describe('Parse torrent quality from name', () => {
  const parser = new TorrentNameParser();

  testCases.forEach((testCase) => {
    testCase.torrents.forEach((torrent) => {
      const torrentName = torrent[0];
      const torrentProper = torrent[1];

      const parsedTorrent = parser.parse(torrentName);
      const testName = '"' + torrentName + '" = '+ testCase.quality;

      it(testName, () => {
        expect(parsedTorrent.quality).to.equal(testCase.quality);

        const version = torrentProper ? 2 : 1;
        expect(parsedTorrent.revision.version).to.equal(version);
      });
    });
  });
});
