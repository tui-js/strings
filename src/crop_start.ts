import { DEFAULT_ELLIPSIS } from "./shared.ts";

import { textWidth } from "./text_width.ts";
import { charWidth } from "./char_width.ts";
import { loopAnsi } from "./ansi_looping.ts";

/**
 * Crops the start of the {input} so that it fits in given {desiredWidth}.
 *
 * Keep in mind that this function might return string shorter than {desiredWidth} in two scenarios:
 * - {input} text was shorter than specified {desiredWidth}.
 * - {input} text had fullwidth or wide characters which couldn't be fit into {desiredWidth}.
 *  - If that's the case, `crop` will try to append `ellipsis` to the end of the string
 *  	to make it the same width as {desiredWidth}.
 *  - If {ellipsis} itself can't be fit into {desiredWidth}, it will be omitted.
 *
 * @see {@link DEFAULT_ELLIPSIS} for the default ellipsis character
 *
 * @example
 * ```ts
 * console.log(cropStart("Hello, World!", 6)); // "World!"
 * console.log(cropStart("🐶 woof woof", 7)); // "of woof"
 * console.log(cropStart("🐶", 2)); // "🐶"
 * console.log(cropStart("🐶", 1)); // "…"
 * console.log(cropStart("🐶", 0)); // ""
 * console.log(cropStart("🐶", 1, "🐱")); // "" (ellipsis is too wide)
 * console.log(cropStart("こんにちは、世界", 4)); // "世界"
 * console.log(cropStart("こんにちは、世界", 5)); // "世界…"
 * console.log(cropStart("\x1b[32mfoo\x1b[0m", 2)); // "\x1b[32moo\x1b[0m" (preserve all ansi styles [default])
 * console.log(cropStart("\x1b[32mfoo\x1b[0m", 2, undefined, false)); // "oo\x1b[0m" (preserve only the ansi styles that are in the slice range)
 *
 * ```
 */
export function cropStart(
  input: string,
  desiredWidth: number,
  ellipsis = DEFAULT_ELLIPSIS,
  preserveAllAnsi = true,
): string {
  const ellipsisWidth = charWidth(ellipsis);
  const cropStart = textWidth(input) - desiredWidth;

  let cropped = "";
  let position = 0;
  let croppedWidth = 0;

  loopAnsi(input, (char, style) => {
    if (style) {
      if ((preserveAllAnsi || position >= cropStart)) {
        cropped += style;
      }
      return;
    }

    if (croppedWidth >= desiredWidth) {
      return !preserveAllAnsi;
    }

    const width = charWidth(char);
    if (position < cropStart) {
      position += width;
      return;
    }

    if (croppedWidth + width > desiredWidth) {
      if (croppedWidth + ellipsisWidth === desiredWidth) {
        cropped += ellipsis;
      }
      return true;
    }

    croppedWidth += width;
    cropped += char;
  });

  if (croppedWidth + ellipsisWidth === desiredWidth) {
    cropped += ellipsis;
  }

  return cropped;
}
