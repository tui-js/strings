import { assertEquals } from "@std/assert";
import { errorMessage } from "./shared.ts";

import { cropStart } from "../src/crop_start.ts";
import { DEFAULT_ELLIPSIS } from "../src/shared.ts";

Deno.test("cropStart()", () => {
  const EXPECTED_RESULTS = [
    ["Hello, World!", 6, undefined, undefined, "World!"],
    ["🐶 woof woof", 7, undefined, undefined, "of woof"],

    ["🐶🐶", 1, undefined, undefined, DEFAULT_ELLIPSIS],
    ["🐶", 2, undefined, undefined, "🐶"],
    ["🐶", 1, " ", undefined, " "],
    ["🐶", 1, "🐱", undefined, ""],

    ["meow 🐱", 2, undefined, undefined, "🐱"],
    ["meow 🐱", 1, undefined, undefined, DEFAULT_ELLIPSIS],
    ["meow 🐱", 0, undefined, undefined, ""],

    ["こんにちは、世界", 4, undefined, undefined, "世界"],
    ["こんにちは、世界", 5, undefined, undefined, DEFAULT_ELLIPSIS + "世界"],
    ["こんにちは、世界", 6, undefined, undefined, "、世界"],

    ["ｱｲｳｴｵ", 1, undefined, undefined, "ｵ"],
    ["ｱｲｳｴｵ", 2, undefined, undefined, "ｴｵ"],
    ["ｱｲｳｴｵ", 3, undefined, undefined, "ｳｴｵ"],

    ["1 \x1b[32mfoo\x1b[0m", 3, undefined, undefined, "\x1b[32mfoo\x1b[0m"],
    ["2 \x1b[32mfoo\x1b[0m", 3, undefined, true, "\x1b[32mfoo\x1b[0m"],
    ["3 \x1b[32mfoo\x1b[0m", 2, undefined, undefined, "\x1b[32moo\x1b[0m"],
    ["4 \x1b[32mfoo\x1b[0m", 2, undefined, true, "\x1b[32moo\x1b[0m"],

    ["5 \x1b[32mfoo\x1b[0m", 3, undefined, false, "\x1b[32mfoo\x1b[0m"],
    ["6 \x1b[32mfoo\x1b[0m", 2, undefined, false, "oo\x1b[0m"],
  ] as const;

  for (
    const [input, width, ellipsis, preserveAllAnsi, expected]
      of EXPECTED_RESULTS
  ) {
    assertEquals(
      cropStart(input, width, ellipsis, preserveAllAnsi),
      expected,
      errorMessage(input),
    );
  }
});
