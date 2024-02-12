import { getNamesListData } from "./unicode/names_list.ts";

async function generateCharWidthFunction() {
  const NLData = await getNamesListData();

  let charNameMap = "";
  for (const [i, [codepoint, name]] of NLData.data.entries()) {
    if (i > 0) charNameMap += "\n";
    charNameMap += `[${codepoint}]: "${name}",`;
  }

  const code = (await Deno.readTextFile(
    new URL(import.meta.resolve("./templates/char_name.ts")),
  ))
    .replace("$UNICODE_VERSION", NLData.unicodeVersion)
    .replace("$CHAR_NAME_MAP", charNameMap);

  return code;
}

if (import.meta.main) {
  const code = await generateCharWidthFunction();
  console.log(code);
}
