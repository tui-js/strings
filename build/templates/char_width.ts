/**
 * @module
 * Based on Unicode $UNICODE_VERSION.
 * 
 * Get width of given character.\
 * @see {@linkcode charWidth} for more information.
 * 
 * @example
 * ```ts
 * console.log(charWidth("🐱")); // 2
 * ```
 */

/**
 * Returns a width of given {@linkcode character}.\
 * Width of character is determined from Unicode $UNICODE_VERSION East Asian Width data.
 * Some characters (like Zerowidth punctuation) are edited manually.\
 * Possible widths are:
 *  - 2 – Wide or Fullwidth
 *  - 0 – Zerowidth punctuation or flow modifiers
 *  - 1 - Anything that's not Fullwidth, Wide or Zerowidth (Narrow, Halfwidth, Ambiguous and Unlisted)
 * 
 * @example
 * ```ts
 * console.log(charWidth("H")); // 1
 * console.log(charWidth("ﾍ")); // 1
 * console.log(charWidth("ぬ")); // 2
 * console.log(charWidth("🐈")); // 2
 * console.log(charWidth("🐱")); // 2
 * ```
 */
export function charWidth(char: string): number {
  const codePoint = char.codePointAt(0);

  if (!codePoint) return 0;

  // Zero width characters
  if (
    // [General Punctuation](https://www.unicode.org/charts/PDF/U2000.pdf)
    (
      (codePoint >= 0x200B && codePoint <= 0x200F) ||
      (codePoint >= 0x202A && codePoint <= 0x202E) ||
      (codePoint >= 0x2060 && codePoint <= 0x206F)
    ) ||
    // [Hangul Jamo](https://www.unicode.org/charts/PDF/U1100.pdf)
    codePoint === 0x115F ||
    // [Arabic Presentation Forms-B](https://www.unicode.org/charts/PDF/UFE70.pdf)
    codePoint === 0xFEFF
  ) {
    return 0;
  }

  // Fullwidth/Wide characters
  if ($TWO_WIDTH_CONDITION) {
    return 2;
  }

  return 1;
}
