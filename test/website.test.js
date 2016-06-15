'use babel';

import chai from 'chai';

import TorrentNameParser from '../src/torrent-name-parser';

const expect = chai.expect;

const testCases = [
  ['[4GTeam] India Blues (2013-vostfr)', '4GTeam'],
  ['[Bette Davis] Confessions à un cadavre - 1965 - VO', 'Bette Davis'],
  ['Confessions à un cadavre [Bette Davis] - 1965 - VO', undefined],
  ['Burn.Notice.S04E15.Brotherly.Love.GERMAN.DUBBED.WS.WEBRiP.XviD.REPACK-TVP', undefined]
];

describe('Parse torrent website from name', () => {
  const parser = new TorrentNameParser();

  testCases.forEach((testCase) => {
    const torrentName = testCase[0];
    const expectedWebsite = testCase[1];

    const testName = `"${torrentName}" = ${expectedWebsite}`;
    const parsedTorrent = parser.parse(torrentName);

    it(testName, () => {
      expect(parsedTorrent.website).to.equal(expectedWebsite);
    });
  });
});
