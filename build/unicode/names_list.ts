export const UNICODE_CHAR_DB_NAMES_LIST =
  "https://www.unicode.org/Public/UCD/latest/ucd/NamesList.txt";

export interface NamesListData {
  unicodeVersion: string;
  data: [codepoint: number, name: string][];
}

export async function getNamesListData(): Promise<NamesListData> {
  const text = await (await fetch(UNICODE_CHAR_DB_NAMES_LIST)).text();

  const lines = text.split("\n");

  const unicodeVersion = lines[1].replace(
    /@@@\tThe Unicode Standard ((\d|\.)+)/,
    "$1",
  );

  const data: [number, string][] = [];

  for (const line of lines) {
    if (!line || !/[0-9A-F]/.test(line[0])) continue;

    const [codePoint, name] = line.split(/\t/);
    data.push([parseInt(codePoint, 16), name]);
  }

  return {
    unicodeVersion,
    data,
  };
}

if (import.meta.main) {
  console.log(await getNamesListData());
}
