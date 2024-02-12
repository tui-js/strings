import { loopAnsi } from "../mod.ts";
import { textWidth } from "../mod.ts";

/**
 * `String.prototype.slice` but using widths.
 *
 * @example
 * ```ts
 *  console.log(slice("Hello, World!", 0, 5)); // "Hello"
 *  console.log(slice("🐶 woof woof", 0, 7)); // "🐶 woof"
 *  console.log(slice("🐶", 0, 2)); // "🐶"
 *  console.log(slice("🐶", 0, 1)); // ""
 *  console.log(slice("meow 🐱", -2)); // "🐱"
 *  console.log(slice("\x1b[32mfoo\x1b[0m", 0, 3)); // "\x1b[32mfoo\x1b[0m"
 *  console.log(slice("\x1b[32mfoo\x1b[0m", 0, 2, true)); // "\x1b[32mfo\x1b[0m" (preserve all ansi styles [default])
 *  console.log(slice("\x1b[32mfoo\x1b[0m", 0, 2, false)); // "\x1b[32mfo" (preserve only the ansi styles that are in the slice range)
 * ```
 */
export function slice(
  input: string,
  start?: number,
  end?: number,
  preserveAllAnsi = true,
): string {
  const inputWidth = textWidth(input);

  start ??= inputWidth;
  if (start < 0) start = inputWidth + start;

  end ??= inputWidth;
  if (end < 0) end = inputWidth + end;

  let cropped = "";
  let position = 0;
  loopAnsi(input, (char, style) => {
    if (style) {
      cropped += style;
      return;
    }

    const width = textWidth(char);

    if (position >= start! && position + width <= end!) {
      cropped += char;
    } else if (position >= end! && !preserveAllAnsi) {
      return true;
    }

    position += width;
  });

  return cropped;
}
