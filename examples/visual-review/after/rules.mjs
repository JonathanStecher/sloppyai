const dates = new Map([
  ['2026-11-18', 'Wednesday, November 18'],
  ['2026-11-19', 'Thursday, November 19'],
  ['2026-11-20', 'Friday, November 20']
]);

export function selectDay(date) {
  if (!dates.has(date)) throw new RangeError('Choose one of the available days.');
  return { label: dates.get(date), price: 28 };
}
