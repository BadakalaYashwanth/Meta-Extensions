export default function turunctateString(
  str: string,
  maxLength?: number,
): string {
  if (!maxLength) {
    maxLength = 4;
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "..." + str.slice(-maxLength);
}
