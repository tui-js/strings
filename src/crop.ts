import { charWidth } from "./char_width.ts";
import { loopAnsi } from "./ansi_looping.ts";

/**
 * Default ellipsis character used by `crop`
 */
export const DEFAULT_ELLIPSIS = "…";

/**
 * Crops the {input} to given {desiredWidth}
 *
 * Keep in mind that this function might return string shorter than {desiredWidth} in two scenarios:
 *  - {input} text was shorter than specified {desiredWidth}
 *  - {input} text had fullwidth or wide characters which couldn't be fit into {desiredWidth}
 * 		- If that's the case, `crop` will try to append `ellipsis` to the end of the string
 * 			to make it the same width as {desiredWidth}
 * 		- If {ellipsis} itself can't be fit into {desiredWidth}, it will be omitted
 *
 * @see {@link DEFAULT_ELLIPSIS} for the default ellipsis character
 *
 * @example
 * ```ts
 * console.log(crop("Hello, World!", 5)); // "Hello"
 * console.log(crop("🐶 woof woof", 7)); // "🐶 woof"
 * console.log(crop("🐶", 2)); // "🐶"
 * console.log(crop("🐶", 1)); // "…"
 * console.log(crop("🐶", 1, " ")); // " " (custom ellipsis)
 * console.log(crop("🐶", 1, "🐱")); // "" (ellipsis is too wide)
 * console.log(crop("\x1b[32mfoo\x1b[0m", 3)); // "\x1b[32mfoo\x1b[0m" (preserve all ansi styles [default])
 * console.log(crop("\x1b[32mfoo\x1b[0m", 2, undefined, false)); // "\x1b[32mfo\x1b[0m" (preserve only the ansi styles that are in the slice range)
 * ```
 */
export function crop(
  input: string,
  desiredWidth: number,
  ellipsis = DEFAULT_ELLIPSIS,
  preserveAllAnsi = true,
): string {
  const ellipsisWidth = charWidth(ellipsis);

  let cropped = "";
  let croppedWidth = 0;

  loopAnsi(input, (char, style) => {
    if (style) {
      cropped += style;
      return;
    }

    if (croppedWidth >= desiredWidth) {
      return !preserveAllAnsi;
    }

    const width = charWidth(char);
    if (croppedWidth + width > desiredWidth) {
      if (croppedWidth + ellipsisWidth === desiredWidth) {
        cropped += ellipsis;
      }
      return true;
    }

    croppedWidth += width;
    cropped += char;
  });

  return cropped;
}
