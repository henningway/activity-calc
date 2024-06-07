const fs = require("node:fs");

/**
 * Augments the activity entries in the file at given path with durations.
 *
 * @param {string} path
 */
function writeActivityDurationToFile(path) {
  const lines = readFile(path).toString().split("\n");
  const output = addDurationSuffixes(lines, durationPerLine(lines));

  try {
    fs.writeFileSync(path, output.join("\n"));
  } catch (err) {
    console.error(err);
  }
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
function durationPerLine(lines) {
  return lines.map((line, index) => {
    const nextLine = index + 1 >= lines.length ? null : lines[index + 1];

    if (nextLine === null) return;

    const hasDiff = line.match(/\([0-9]*\)$/)?.length > 0;

    if (hasDiff) return;

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
