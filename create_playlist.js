#!/usr/bin/env node

/**
 * @typedef Difficulties
 * @property {string} characteristic
 * @property {string} name
 */

/**
 * @typedef PlaylistSong
 * @property {string} songName
 * @property {string} levelAuthorName
 * @property {string} hash
 * @property {string} levelid
 * @property {Difficulties[]} difficulties
 */

/**
 * @typedef {string} Hash
 */

/**
 * @typedef {Map<Hash, PlaylistSong>} MapYearLeaderboard
 */

// Glob all *.json
const fs = require("fs");
const path = require("path");

fs.readdir(path.resolve(path.join(__dirname, "score")), (err, fileName) => {
  handleFiles(err, fileName);

  mapByYear.forEach((mapYearLeaderboard, year) => {
    const fileContent = JSON.stringify({
      playlistTitle: `Ranked maps from year ${year}`,
      playlistAuthor: `JavaScript`,
      songs: Array.from(mapYearLeaderboard.values()),
      image: "",
    });

    fs.writeFileSync(
      path.join(__dirname, `${year}.json`),
      fileContent,
      (err) => {
        throw err;
      }
    );
  });
});

/** @type {Map<number, MapYearLeaderboard>} */
const mapByYear = new Map();

/**
 * @param {NodeJS.ErrnoException} err
 * @param {string[]} fileNames
 */
function handleFiles(err, fileNames) {
  if (err) {
    throw err;
  }

  fileNames.forEach((fileName) => {
    if (!fileName.match(/\.json$/i)) return;

    const responseString = fs.readFileSync(
      path.join(__dirname, "score", fileName),
      {
        encoding: "utf-8",
      }
    );

    handleJsonString(responseString);
  });
}

/**
 * @param {string} responseString
 * @returns {number}
 */
function handleJsonString(responseString) {
  const response = JSON.parse(responseString);

  /** @type {LeaderboardInfo[]} */
  const leaderboards = response.leaderboards;

  leaderboards.forEach((leaderboard) => {
    const rankedDate = new Date(leaderboard.rankedDate);

    const yearOfRanked = rankedDate.getFullYear();
    /** @type {PlaylistSong} */
    const songData = {
      songName: leaderboard.songName,
      levelAuthorName: leaderboard.levelAuthorName,
      hash: leaderboard.songHash,
      levelid: `custom_level_${leaderboard.songHash}`,
      difficulties: [], // TODO
    };

    const rankedMapsOfTheYear = mapByYear.get(yearOfRanked);
    if (!rankedMapsOfTheYear) {
      /** @type {MapYearLeaderboard} */
      const yearLeaderboard = new Map();
      yearLeaderboard.set(`${leaderboard.songHash}`, songData);

      mapByYear.set(yearOfRanked, yearLeaderboard);
    } else {
      rankedMapsOfTheYear.set(`${leaderboard.songHash}`, songData);
    }
  });
}
