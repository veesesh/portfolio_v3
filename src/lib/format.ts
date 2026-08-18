const MONTH_YEAR: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };

/** "Aug 2025" */
export function monthYear(date: Date): string {
  return date.toLocaleDateString("en-GB", MONTH_YEAR);
}

/** "Jan 2026 — now" / "Jul 2022 — Dec 2024" */
export function period(start: Date, end: Date | null): string {
  return `${monthYear(start)} — ${end ? monthYear(end) : "now"}`;
}
