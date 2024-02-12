const UNICODE_CHAR_DB_EAST_ASIAN_WIDTH_URL =
  "https://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt";

// https://www.unicode.org/reports/tr11/#Definitions
export enum EastAsianWidth {
  Ambiguous = "A",
  Fullwidth = "F",
  Halfwidth = "H",
  Wide = "W",
  Narrow = "Na",
  Unlisted = "N",
}

export type Range = [from: number, to: number];

export interface EastAsianWidthData {
  unicodeVersion: string;
  data: [Range, EastAsianWidth][];
}

function parseRange(range: string): Range {
  const split = range
    .trim()
    .split("..")
    .map((hex) => parseInt(hex, 16));

  if (split.length == 1) {
    return [split[0], split[0]];
  }
  return split as Range;
}

export async function getEastAsianWidthData(): Promise<EastAsianWidthData> {
  const text = await (await fetch(UNICODE_CHAR_DB_EAST_ASIAN_WIDTH_URL)).text();

  const lines = text.split("\n");

  const unicodeVersion = lines[0].replace(
    /# EastAsianWidth-((\d|\.)+)\.txt/,
    "$1",
  );

  const data: [Range, EastAsianWidth][] = [];

  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;

    const [range, right] = line.split(";");
    const [eastAsianWidth] = right.split("#");

    data.push([
      parseRange(range),
      eastAsianWidth.trim() as EastAsianWidth,
    ]);
  }

  return {
    unicodeVersion,
    data,
  };
}

if (import.meta.main) {
  console.log(await getEastAsianWidthData());
}
