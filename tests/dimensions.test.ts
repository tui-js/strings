import { assertEquals } from "jsr:@std/assert@0.215.0";
import { intoCodePoints } from "./shared.ts";

import { dimensions } from "../src/dimensions.ts";

Deno.test("dimensions()", () => {
  // deno-fmt-ignore
  const EXPECTED_RESULTS = [
    ["Hello, World!", { columns: 13, rows: 1 }],
		["🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐽🐸🐒🐔🐧🐦🐤🐣🐥🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐞🐜🦗🦂🦟🦠🐢🐍🦎🦖🦕🐙🦑🦐🦞🦀🐡🐠🐟🐬🐳🐋🦈🐊🐅🐆🦓🦍🦧", { columns: 126, rows: 1 }],
		["你好，世界！", { columns: 12, rows: 1 }],
		["こんにちは、世界！", { columns: 18, rows: 1 }],
		["안녕하세요, 세계!", { columns: 17, rows: 1 }],
		["안녕하세요, 세계!\n안녕하세요, 세계!", { columns: 17, rows: 2 }],
		["안녕하세요, 세계!\n안녕하세요, 세계!\n안녕하세요, 세계!", { columns: 17, rows: 3 }],
		["안녕하세요, 세계!\n안녕하세요, 세계!\n안녕하세요, 세계!\n안녕하세요, 세계!", { columns: 17, rows: 4 }],
		["🐶🐱🐭🐹🐰🦊\n🐻🐼🐨🐯🦁🐮\n🐷🐽🐸🐒🐔🐧\n🐦🐤🐣🐥🦆🦅\n🦉🦇🐺🐗🐴", { columns: 12, rows: 5 }],
		["\x1b[32m🐶\x1b[0m🐱🐭🐹🐰\x1b[32m🦊\x1b[0m\n\x1b[32m🐻🐼🐨🐯\x1b[1m🦁🐮\x1b[0m\n🐷🐽🐸🐒🐔🐧\n🐦🐤🐣🐥🦆🦅\n🦉🦇🐺🐗\x1b[32m🐴\x1b[0m", { columns: 12, rows: 5 }],
  ] as const;

  for (const [text, expected] of EXPECTED_RESULTS) {
    const errorMessage = `
Failed on text: "${text}".
Codepoints: [${intoCodePoints(text)}]`;

    assertEquals(dimensions(text), expected, errorMessage);
  }
});
