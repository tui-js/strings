import { loopAnsi } from "./ansi_looping.ts";
import { charWidth } from "./char_width.ts";

/** Dimensions in columns and rows of a terminal */
export type Dimensions = ReturnType<typeof Deno.consoleSize>;

/**
 * Calculate with and height of given {@linkcode input}.\
 * If text width varies between lines, the maximum is returned.
 *
 * @example
 * ```ts
 * console.log(dimensions("Hello\nWorld!")); // { columns: 6, rows: 2 }
 * ```
 */
export function dimensions(input: string): Dimensions {
  let columns = 0;
  let currentColumns = 0;
  let rows = 1;

  loopAnsi(input, (char, style) => {
    if (style) return;

    if (char === "\n") {
      rows += 1;
      columns = Math.max(columns, currentColumns);
      currentColumns = 0;
      return;
    }

    currentColumns += charWidth(char);
  });

  columns = Math.max(columns, currentColumns);

  return { columns, rows };
}
