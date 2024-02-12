import {
  EastAsianWidth,
  EastAsianWidthData,
  getEastAsianWidthData,
  Range,
} from "./unicode/east_asian_width.ts";

function getTwoWidthRanges(EAWData: EastAsianWidthData): Range[] {
  const filteredData = EAWData.data
    .toSorted((a, b) => a[1].localeCompare(b[1]))
    .filter(([_, EAW]) => (
      EAW !== EastAsianWidth.Ambiguous && // skip Ambiguous characters, we can't predict the context of character usage
      EAW !== EastAsianWidth.Narrow && // We default to width of 1, so we skip Narrow and Halfwidth
      EAW !== EastAsianWidth.Halfwidth &&
      EAW !== EastAsianWidth.Unlisted // We skip unlisted code points, as they're almost always width of 1
    ))
    .map((data) => data[0]) // Keep only ranges
    .sort((a, b) => a[1] - b[0]); // Sort ranges, so that ends meet the closest begginings

  // Combine ranges
  const ranges: Range[] = [];
  for (const range of filteredData) {
    const lastRange = ranges.at(-1);
    if (lastRange?.[1] === range[0] - 1) {
      ranges.pop();
      ranges.push([lastRange[0], range[1]]);
    } else {
      ranges.push(range);
    }
  }

  return ranges;
}

async function generateCharWidthFunction() {
  const EAWData = await getEastAsianWidthData();
  const twoWidthRanges = getTwoWidthRanges(EAWData);

  let twoWidthCondition = "";
  for (const [i, range] of twoWidthRanges.entries()) {
    if (i > 0) twoWidthCondition += " || ";
    // TODO(Im-Beast): Try to find where in specs given codepoint is defined
    if (range[0] === range[1]) {
      const codePoint = `0x${range[0].toString(16)}`;
      twoWidthCondition += `codePoint === ${codePoint}`;
    } else {
      const from = `0x${range[0].toString(16)}`;
      const to = `0x${range[1].toString(16)}`;
      twoWidthCondition += `(codePoint >= ${from} && codePoint <= ${to})`;
    }
  }

  // TODO(Im-Beast): Warning on generated files to not edit them directly and instead modify the templates
  const code = (await Deno.readTextFile(
    new URL(import.meta.resolve("./templates/char_width.ts")),
  ))
    .replace("$UNICODE_VERSION", EAWData.unicodeVersion)
    .replace("$TWO_WIDTH_CONDITION", twoWidthCondition);

  return code;
}

if (import.meta.main) {
  const code = await generateCharWidthFunction();
  console.log(code);
}
