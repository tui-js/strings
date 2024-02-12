interface LoopAnsiCallback {
  (char: string, lastStyle?: string): void;
}

/**
 * Loop over {input}.\
 * For every character, that's not an ansi sequence call {callback}.\
 * If between last and current call there was an ansi style,
 * the second argument of that callback will be equal to that style.
 *
 * @example
 * ```ts
 * let text = "";
 * let styles = "";
 * loopAnsi("\x1b[32mHello world\x1b[0m", (char, style) => {
 *    if (style) {
 *      styles += style;
 *    } else {
 *      text += char
 *    };
 * });
 *
 * console.log(text); // "Hello world"
 * console.log(styles); "\x1b[32m\x1b[0m"
 * ```
 */
export function loopAnsi(input: string, callback: LoopAnsiCallback): void {
  let ansi = 0;
  let style = "";

  for (const char of input) {
    if (char === "\x1b") {
      ansi = 1;
      style += char;
    } else if (ansi >= 3 && isFinalAnsiByte(char)) {
      callback(char, style);
      style = "";
      ansi = 0;
    } else if (ansi > 0) {
      ansi += 1;
      style += char;
    } else {
      callback(char);
    }
  }
}

/**
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code
 */
export function isFinalAnsiByte(character: string): boolean {
  const charCode = character.charCodeAt(0);
  // final byte is one in range 0x40–0x7E
  // We don't include 0x70–0x7E range because its considered "private"
  return charCode >= 0x40 && charCode < 0x70;
}
