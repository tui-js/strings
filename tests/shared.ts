// Converts string to array of hex code points
export function intoCodePoints(string: string): string[] {
  const codePoints = [];
  for (let i = 0; i < string.length; ++i) {
    codePoints.push(string.charCodeAt(i).toString(16));
  }
  return codePoints;
}
