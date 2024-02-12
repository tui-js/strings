// Converts string to array of hex code points
export function intoCodePoints(string: string): string[] {
  const codePoints = [];
  for (let i = 0; i < string.length; ++i) {
    codePoints.push(string.charCodeAt(i).toString(16));
  }
  return codePoints;
}

// Returns a string with the error message for failedd test
export function errorMessage(input: string, code?: string): string {
  const codePoints = intoCodePoints(input);
  return `\n<${code}>Failed on input: "${input}".\nCodepoints: [${codePoints}]`;
}
