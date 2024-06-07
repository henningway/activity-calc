import { expect, it } from "vitest";
import {
  augmentWithDurations,
  createReport,
  durationPerLine,
  groupByDate,
  groupByDateAndAnalyze,
  prepareReportForOutput,
} from "./calc";

const input = [
  "# 28.05.2024",
  "",
  "0950 Ankommen",
  "1000 Daily (10)",
  "1010 Responsive Ereignis-Kacheln",
  "1200 Mittag",
  "1240 Responsive Ereignis-Kacheln",
  "1700 Ende",
  "",
  "# 27.05.2024",
  "",
  "0950 Gitlab/Mails",
  "1000 Daily",
  "1015 Labern",
  "1030 Dev-Meeting",
  "1215 Mittag",
  "1250 Responsive Ereignis-Kacheln",
  "1600 Ende",
];

it("can add durations to activities", () => {
  expect(augmentWithDurations(input)).toStrictEqual([
    "# 28.05.2024",
    "",
    "0950 Ankommen (10)",
    "1000 Daily (10)",
    "1010 Responsive Ereignis-Kacheln (110)",
    "1200 Mittag (40)",
    "1240 Responsive Ereignis-Kacheln (260)",
    "1700 Ende",
    "",
    "# 27.05.2024",
    "",
    "0950 Gitlab/Mails (10)",
    "1000 Daily (15)",
    "1015 Labern (15)",
    "1030 Dev-Meeting (105)",
    "1215 Mittag (35)",
    "1250 Responsive Ereignis-Kacheln (190)",
    "1600 Ende",
  ]);
});

it("can provide duration per line", () => {
  expect(durationPerLine(input)).toStrictEqual([
    undefined,
    undefined,
    10,
    10,
    110,
    40,
    260,
    undefined,
    undefined,
    undefined,
    undefined,
    10,
    15,
    15,
    105,
    35,
    190,
    undefined,
  ]);
});

it("can group by date", () => {
  expect(groupByDate(input)).toStrictEqual({
    "27.05.2024": [
      "",
      "0950 Gitlab/Mails",
      "1000 Daily",
      "1015 Labern",
      "1030 Dev-Meeting",
      "1215 Mittag",
      "1250 Responsive Ereignis-Kacheln",
      "1600 Ende",
    ],
    "28.05.2024": [
      "",
      "0950 Ankommen",
      "1000 Daily (10)",
      "1010 Responsive Ereignis-Kacheln",
      "1200 Mittag",
      "1240 Responsive Ereignis-Kacheln",
      "1700 Ende",
      "",
    ],
  });
});

it("can group and analyze (provide meta information to each line) the input", () => {
  expect(groupByDateAndAnalyze(input)).toStrictEqual({
    "27.05.2024": [
      { text: "", label: undefined, duration: undefined, timestamp: undefined },
      {
        text: "0950 Gitlab/Mails",
        label: "Gitlab/Mails",
        duration: 10,
        timestamp: "0950",
      },
      { text: "1000 Daily", label: "Daily", duration: 15, timestamp: "1000" },
      { text: "1015 Labern", label: "Labern", duration: 15, timestamp: "1015" },
      {
        text: "1030 Dev-Meeting",
        label: "Dev-Meeting",
        duration: 105,
        timestamp: "1030",
      },
      { text: "1215 Mittag", label: "Mittag", duration: 35, timestamp: "1215" },
      {
        text: "1250 Responsive Ereignis-Kacheln",
        label: "Responsive Ereignis-Kacheln",
        duration: 190,
        timestamp: "1250",
      },
      {
        text: "1600 Ende",
        label: "Ende",
        duration: undefined,
        timestamp: "1600",
      },
    ],
    "28.05.2024": [
      { text: "", label: undefined, duration: undefined, timestamp: undefined },
      {
        text: "0950 Ankommen",
        label: "Ankommen",
        duration: 10,
        timestamp: "0950",
      },
      {
        text: "1000 Daily (10)",
        label: "Daily",
        duration: 10,
        timestamp: "1000",
      },
      {
        text: "1010 Responsive Ereignis-Kacheln",
        label: "Responsive Ereignis-Kacheln",
        duration: 110,
        timestamp: "1010",
      },
      { text: "1200 Mittag", label: "Mittag", duration: 40, timestamp: "1200" },
      {
        text: "1240 Responsive Ereignis-Kacheln",
        label: "Responsive Ereignis-Kacheln",
        duration: 260,
        timestamp: "1240",
      },
      {
        text: "1700 Ende",
        label: "Ende",
        duration: undefined,
        timestamp: "1700",
      },
      { text: "", label: undefined, duration: undefined, timestamp: undefined },
    ],
  });
});

it("can provide a daily report with aggregated durations", () => {
  expect(createReport(input)).toStrictEqual({
    "27.05.2024": {
      Daily: 15,
      "Dev-Meeting": 105,
      "Gitlab/Mails": 10,
      Labern: 15,
      Mittag: 35,
      "Responsive Ereignis-Kacheln": 190,
    },
    "28.05.2024": {
      Ankommen: 10,
      Daily: 10,
      Mittag: 40,
      "Responsive Ereignis-Kacheln": 370,
    },
  });
});

it("can provide the daily report as string prepared for output", () => {
  expect(prepareReportForOutput(createReport(input))).toEqual(`# 28.05.2024

Ankommen: 10
Daily: 10
Responsive Ereignis-Kacheln: 370
Mittag: 40

# 27.05.2024

Gitlab/Mails: 10
Daily: 15
Labern: 15
Dev-Meeting: 105
Mittag: 35
Responsive Ereignis-Kacheln: 190`);
});
