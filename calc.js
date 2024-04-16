const fs = require("node:fs");

function readActivityFile(path) {
  try {
    const data = fs.readFileSync(path, "utf8");
    return data;
  } catch (err) {
    console.error(err);
  }
}

// takes file contents
function writeActivityDurationToFile(path) {
  const lines = readActivityFile(path).toString().split("\n");

  const suffixPerLine = lines.map((line, index) => {
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

    console.log(
      hasDiff ? "true" : "false",
      " ",
      time,
      " ",
      nextTime,
      " ",
      diff
    );

    return diff;
  });

  console.log(suffixPerLine);

  const output = lines.map((line, index) => {
    const suffix = suffixPerLine[index];

    if (suffix === undefined) return line;

    return `${line} (${suffix})`;
  });

  console.log(output);

  try {
    fs.writeFileSync(path, output.join("\n"));
  } catch (err) {
    console.error(err);
  }
}

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
 * Tells whether given string or number can me mapped to a number.
 */
const isNumber = (v) => !isNaN(Number(v));

writeActivityDurationToFile("./activity.md");
