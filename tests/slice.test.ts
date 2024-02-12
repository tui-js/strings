import { assertEquals } from "jsr:@std/assert@0.215.0";
import { intoCodePoints } from "./shared.ts";

import { slice } from "../src/slice.ts";

Deno.test("slice()", () => {
  const EXPECTED_RESULTS = [
    ["Hello, World!", 0, 5, undefined, "Hello"],
    ["🐶 woof woof", 0, 7, undefined, "🐶 woof"],
    ["🐶", 0, 2, undefined, "🐶"],
    ["🐶", 0, 1, undefined, ""],
    ["meow 🐱", -2, undefined, undefined, "🐱"],
    ["meow 🐱", -1, undefined, undefined, ""],
    ["meow 🐱", 0, -1, undefined, "meow "],
    ["meow 🐱", 0, -2, undefined, "meow "],
    ["meow 🐱", 0, -3, undefined, "meow"],
    ["こんにちは、世界", 0, 4, undefined, "こん"],
    ["こんにちは、世界", 0, 5, undefined, "こん"],
    ["こんにちは、世界", 0, 6, undefined, "こんに"],
    ["ｱｲｳｴｵ", 0, 1, undefined, "ｱ"],
    ["ｱｲｳｴｵ", 0, 2, undefined, "ｱｲ"],
    ["ｱｲｳｴｵ", 0, 3, undefined, "ｱｲｳ"],
    ["\x1b[32mfoo\x1b[0m", 0, 3, undefined, "\x1b[32mfoo\x1b[0m"],
    ["\x1b[32mfoo\x1b[0m", 0, 2, true, "\x1b[32mfo\x1b[0m"],
    ["\x1b[32mfoo\x1b[0m", 0, 2, false, "\x1b[32mfo"],
  ] as const;

  for (
    const [input, start, end, preserveAllAnsi, expected] of EXPECTED_RESULTS
  ) {
    const errorMessage = `
Failed on input: "${input}".
Codepoints: [${intoCodePoints(input)}]`;

    assertEquals(
      slice(input, start, end, preserveAllAnsi),
      expected,
      errorMessage,
    );
  }
});
