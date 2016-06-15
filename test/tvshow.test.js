'use babel';

import chai from 'chai';

import TorrentNameParser from '../src/torrent-name-parser';

const expect = chai.expect;

const testCases = [
  ['Castle.2009.S01E14.English.HDTV.XviD-LOL', 1, 14],
  ['Salamander.S01E01.FLEMISH.HDTV.x264-BRiGAND', 1, 1],
  ['H.Polukatoikia.S03E13.Greek.PDTV.XviD-Ouzo', 3, 13],
  ['Burn.Notice.S04E15.Brotherly.Love.GERMAN.DUBBED.WS.WEBRiP.XviD.REPACK-TVP', 4, 15],
  ['Ray Donovan - S01E01.720p.HDtv.x264-Evolve (NLsub)', 1, 1]
];

describe('Parse torrent season and episode from name', () => {
  const parser = new TorrentNameParser();

  testCases.forEach((testCase) => {
    const torrentName = testCase[0];
    const expectedSeason = testCase[1];
    const expectedEpisode = testCase[2];

    const testName = `"${torrentName}" = Season ${expectedSeason} episode ${expectedEpisode}`;
    const parsedTorrent = parser.parse(torrentName);

    it(testName, () => {
      expect(parsedTorrent.tvshow.season).to.equal(expectedSeason);
      expect(parsedTorrent.tvshow.episode).to.equal(expectedEpisode);
    });
  });
});
