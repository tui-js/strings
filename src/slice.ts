import { loopAnsi } from "../mod.ts";
import { textWidth } from "../mod.ts";

/**
 * `String.prototype.slice` but using widths.
 *
 * @example
 * ```ts
 *
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
