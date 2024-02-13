import { DEFAULT_ELLIPSIS } from "./shared.ts";

import { loopAnsi } from "./ansi_looping.ts";
import { textWidth } from "./text_width.ts";

/**
 * `String.prototype.slice` but using widths.
 *
 * Keep in mind that this function might return string shorter than {end}-{start} in two scenarios:
 * - {input} text was shorter than specified {end}-{start}.
 * - {input} text had fullwidth or wide characters which couldn't be fit into {end}-{start}.
 *  - If that's the case, `slice` will try to append `ellipsis` to the end of the string
 *    to make it the same width as {end}-{start}.
 *  - If {ellipsis} itself can't be fit into {end}-{start}, it will be omitted.
 *
 * @see {@link DEFAULT_ELLIPSIS} for the default ellipsis character
 *
 * @example
 * ```ts
 *  console.log(slice("Hello, World!", 0, 5)); // "Hello"
 *  console.log(slice("🐶 woof woof", 0, 7)); // "🐶 woof"
 *  console.log(slice("🐶", 0, 2)); // "🐶"
 *  console.log(slice("🐶", 0, 1)); // "…"
 *  console.log(slice("🐶", 0, 1, " ")); // " " (custom ellipsis)
 *  console.log(slice("🐶", 0, 1, "🐱")); // "" (ellipsis is too wide)
 *  console.log(slice("meow 🐱", -2)); // "🐱"
 *  console.log(slice("\x1b[32mfoo\x1b[0m", 0, 3)); // "\x1b[32mfoo\x1b[0m"
 *  console.log(slice("\x1b[32mfoo\x1b[0m", 0, 2, undefined, true)); // "\x1b[32mfo\x1b[0m" (preserve all ansi styles [default])
 *  console.log(slice("\x1b[32mfoo\x1b[0m", 0, 2, undefined, false)); // "\x1b[32mfo" (preserve only the ansi styles that are in the slice range)
 * ```
 */
export function slice(
  input: string,
  start?: number,
  end?: number,
  ellipsis = DEFAULT_ELLIPSIS,
  preserveAllAnsi = true,
): string {
  const inputWidth = textWidth(input);
  start ??= inputWidth;
  if (start < 0) start = inputWidth + start;
  end ??= inputWidth;
  if (end < 0) end = inputWidth + end;

  const ellipsisWidth = textWidth(ellipsis);

  let cropped = "";
  let position = 0;
  loopAnsi(input, (char, style) => {
    if (style) {
      cropped += style;
      return;
    }

    if (position >= end!) {
      return !preserveAllAnsi;
    }

    const width = textWidth(char);
    if (position >= start!) {
      if (position + width > end!) {
        if (position + ellipsisWidth === end!) {
          cropped += ellipsis;
        }
        return true;
      }

      cropped += char;
    }

    position += width;
  });

  return cropped;
}
