/**
 * @module
 * Crops the start of the string so that it fits in given space.\
 * @see {@linkcode cropStart} for more information.
 *
 * @example
 * ```ts
 * console.log(cropStart("Hello, World!", 6)); // "World!"
 * ```
 */

import { DEFAULT_ELLIPSIS } from "./shared.ts";

import { charWidth } from "./char_width.ts";
import { textWidth } from "./text_width.ts";
import { loopAnsi } from "./ansi_looping.ts";

/**
 * Crops the start of the {@linkcode input} so that it fits in given {@linkcode desiredWidth}.
 *
 * Keep in mind that this function might return string shorter than {@linkcode desiredWidth} in two scenarios:
 * - {@linkcode input} text was shorter than specified {@linkcode desiredWidth}.
 * - {@linkcode input} text had fullwidth or wide characters which couldn't be fit into {@linkcode desiredWidth}.
 *  - If that's the case, `crop` will try to append `ellipsis` to the end of the string
 *  	to make it the same width as {@linkcode desiredWidth}.
 *  - If {@linkcode ellipsis} itself can't be fit into {@linkcode desiredWidth}, it will be omitted.
 *
 * @see {@link DEFAULT_ELLIPSIS} – the default ellipsis character.
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
  const ellipsisWidth = textWidth(ellipsis);
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
      if (
        position + width > cropStart &&
        position + ellipsisWidth === cropStart
      ) {
        cropped += ellipsis;
        croppedWidth += ellipsisWidth;
      }
      position += width;
      return;
    }

    if (croppedWidth + width > desiredWidth) {
      if (croppedWidth + ellipsisWidth === desiredWidth) {
        cropped += ellipsis;
        croppedWidth += ellipsisWidth;
      }
      return true;
    }

    croppedWidth += width;
    cropped += char;
  });

  return cropped;
}
