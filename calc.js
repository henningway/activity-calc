const fs = require("node:fs");
const R = require("ramda");

/**
 * Augments the activity entries in the file at given path with durations.
 *
 * @param {string} path
 */
function writeActivityDurationToFile(path) {
  const lines = readFile(path).toString().split("\n");
  const output = augmentWithDurations(lines);

  try {
    fs.writeFileSync(path, output.join("\n"));
  } catch (err) {
    console.error(err);
  }
}

/**
 * Updates each activity entry of the input file with a duration.
 *
 * @param {string[]} lines
 * @return {string[]}
 */
function augmentWithDurations(lines) {
  return addDurationSuffixes(lines, durationPerLine(lines, true));
}

/**
 * Modifies each line by the matching entry in given durations.
 *
 * @param {string[]} lines
 * @param {string[]} durations
 * @return {string[]}
 */
function addDurationSuffixes(lines, durations) {
  return lines.map((line, index) => {
    const suffix = durations[index];
    if (suffix === undefined) return line;
    return `${line} (${suffix})`;
  });
}

/**
 * Provides the duration for each activity entry of the input file as a diff of the timestamps in a line and the next
 * line.
 *
 * @param {string[]} lines
 * @return {string[]}
 */
function durationPerLine(lines, skipIfHasDiff = false) {
  return lines.map((line, index) => {
    const nextLine = index + 1 >= lines.length ? null : lines[index + 1];

    if (nextLine === null) return;

    const hasDiff = line.match(/\([0-9]*\)$/)?.length > 0;

    if (skipIfHasDiff && hasDiff) return;

    const time = line.substring(0, 4);
    const nextTime = nextLine.substring(0, 4);

    if (
      time === "" ||
      nextTime === "" ||
      !isNumber(time) ||
      !isNumber(nextTime)
    )
      return;

    const diff = timeDifferenceInMinutes(time, nextTime);

    // console.log(
    //   hasDiff ? "true" : "false",
    //   " ",
    //   time,
    //   " ",
    //   nextTime,
    //   " ",
    //   diff
    // );

    return diff;
  });
}

/**
 * Matches the timestamp in given line.
 */
function matchTimestamp(line) {
  return R.match(/^([0-9]{4})/, line);
}

/**
 * Extracts the timestamp in a given line.
 */
function extractTimestamp(line) {
  return matchTimestamp(line)?.[1];
}

/**
 * Matches the label in givne line.
 */
function matchLabel(line) {
  // ^[0-9]{4} ([^(\()]*)\s?(\([0-9]*\))?$
  return R.match(/^[0-9]{4} ([^(\()]*)\s?(\([0-9]*\))?$/, line);
}

/**
 * Extracts the label in a given line.
 */
function extractLabel(line) {
  const result = matchLabel(line)?.[1];
  if (result === undefined) return result;
  return R.trim(result);
}

/**
 * Calculates the duration in minutes between two time strings in HH:MM format.
 */
function timeDifferenceInMinutes(time1, time2) {
  // Convert time strings to minutes
  const time1InMinutes =
    parseInt(time1.substring(0, 2)) * 60 + parseInt(time1.substring(2));
  const time2InMinutes =
    parseInt(time2.substring(0, 2)) * 60 + parseInt(time2.substring(2));

  // Calculate the difference in minutes
  const differenceInMinutes = time2InMinutes - time1InMinutes;

  return differenceInMinutes;
}

/**
 * Groups lines by date.
 */
function groupByDate(lines) {
  const dateRegEx = /^# ([0-9]{2}\.[0-9]{2}\.[0-9]{4})/;
  const matchDate = R.match(dateRegEx);

  const dates = R.map(
    (dateLine) => matchDate(dateLine)[1],
    R.filter(R.test(dateRegEx), lines)
  );
  const groups = R.splitWhenever(R.test(dateRegEx), lines);

  return R.map(
    (entry) => entry[1],
    R.indexBy((entry) => entry[0], R.zip(dates, groups))
  );
}

/**
 * Groups lines by date and provides meta information for each line (duration, label, timestamp).
 */
function groupByDateAndAnalyze(lines) {
  return mapGroup(
    ([text, duration]) => ({
      text,
      duration,
      timestamp: extractTimestamp(text),
      label: extractLabel(text),
    }),
    R.map((lines) => R.zip(lines, durationPerLine(lines)), groupByDate(lines))
  );
}

/**
 * Maps a function to all lines in all groups.
 */
function mapGroup(fn, groups) {
  return R.map(R.map(fn), groups);
}

/**
 * Reads file contents at the given path.
 *
 * @param {string} path
 * @return {string}
 */
function readFile(path) {
  try {
    const data = fs.readFileSync(path, "utf8");
    return data;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Tells whether given string or number can me mapped to a number.
 *
 * @param {number} v
 * @return {boolean}
 */
const isNumber = (v) => !isNaN(Number(v));

writeActivityDurationToFile("./activity.md");

module.exports = {
  analyzeInput: groupByDateAndAnalyze,
  augmentWithDurations,
  durationPerLine,
  extractLabel,
  extractTimestamp,
  groupByDate,
  mapGroup,
};
