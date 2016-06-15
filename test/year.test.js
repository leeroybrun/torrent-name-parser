'use babel';

import chai from 'chai';

import TorrentNameParser from '../src/torrent-name-parser';

const expect = chai.expect;

const testCases = [
  ['[4GTeam] India Blues (2013-vostfr)', 2013],
  ['Les Huit salopards (2015) MULTi VFQ [1080p] BluRay', 2015],
  ['Spectre (2015) MULTi (VFF-VOA) [1080p] BluRay x264', 2015],
  ['Game.of.thrones.S06E02.VOSTFR.1080i.SUBFRENCH.H264', null],
  ['Deadpool.2016.TRUEFRENCH.BDRip.XVID-EVE.avi.torren', 2016],
  ['Mission Impossible - Rogue Nation (2015) [1080p]', 2015]
];

describe('Parse torrent year from name', () => {
  const parser = new TorrentNameParser();

  testCases.forEach((testCase) => {
    const torrentName = testCase[0];
    const expectedYear = testCase[1];

    const testName = `"${torrentName}" = ${expectedYear}`;
    const parsedTorrent = parser.parse(torrentName);

    it(testName, () => {
      expect(parsedTorrent.year).to.equal(expectedYear);
    });
  });
});
