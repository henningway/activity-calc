import { it, expect } from "vitest";
import { augmentWithDurations } from "./calc";

it("can add durations to activities", () => {
  const input = [
    "# 05.06.2024",
    "",
    "1000 Daily",
    "1010 Gitlab/Mails",
    "1035 Responsive Ereignis-Kacheln",
    "1100 Meeting Strategie E2E-Tests",
    "1205 Mittag",
    "1255 FASÖ Review",
    "1300 Gitlab/Mails",
    "1310 Responsive Ereignis-Kacheln",
    "1540 FASÖ Review",
    "1545 Gitlab/Mails",
    "1630 Ende",
  ];

  expect(augmentWithDurations(input)).toStrictEqual([
    "# 05.06.2024",
    "",
    "1000 Daily (10)",
    "1010 Gitlab/Mails (25)",
    "1035 Responsive Ereignis-Kacheln (25)",
    "1100 Meeting Strategie E2E-Tests (65)",
    "1205 Mittag (50)",
    "1255 FASÖ Review (5)",
    "1300 Gitlab/Mails (10)",
    "1310 Responsive Ereignis-Kacheln (150)",
    "1540 FASÖ Review (5)",
    "1545 Gitlab/Mails (45)",
    "1630 Ende",
  ]);
});