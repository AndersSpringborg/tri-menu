export function isValidDate(date: Date | null | undefined) {
  if (!date) return false;

  return date.toString() !== 'Invalid Date';
}