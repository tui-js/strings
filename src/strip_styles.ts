import { loopAnsi } from "./ansi_looping.ts";

/**
 * Removes ANSI styles from given {input}.
 *
 * @example
 * ```ts
 * console.log(stripStyles("\x1b[32mHello world\x1b[0m")); // "Hello world"
 * ```
 */
export function stripStyles(input: string): string {
  let output = "";
  loopAnsi(input, (char, style) => {
    if (style) return;
    output += char;
  });
  return output;
}
