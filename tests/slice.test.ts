import { assertEquals } from "jsr:@std/assert@0.215.0";
import { errorMessage } from "./shared.ts";

import { slice } from "../src/slice.ts";
import { DEFAULT_ELLIPSIS } from "../src/shared.ts";

Deno.test("slice()", () => {
  const EXPECTED_RESULTS = [
    ["Hello, World!", 0, 5, undefined, undefined, "Hello"],
    ["🐶 woof woof", 0, 7, undefined, undefined, "🐶 woof"],
    ["🐶", 0, 2, undefined, undefined, "🐶"],
    ["🐶", 0, 1, undefined, undefined, DEFAULT_ELLIPSIS],
    ["test hi", -2, undefined, undefined, undefined, "hi"],
    ["1 meow 🐱", -2, undefined, undefined, undefined, "🐱"],
    ["2 meow 🐱", -1, undefined, undefined, undefined, ""],
    ["3 meow 🐱", 0, -1, undefined, undefined, "3 meow " + DEFAULT_ELLIPSIS],
    ["4 meow 🐱", 0, -2, undefined, undefined, "4 meow "],
    ["5 meow 🐱", 0, -3, undefined, undefined, "5 meow"],
    ["こんにちは、世界", 0, 4, undefined, undefined, "こん"],
    ["こんにちは、世界", 0, 5, undefined, undefined, "こん" + DEFAULT_ELLIPSIS],
    ["こんにちは、世界", 0, 6, undefined, undefined, "こんに"],
    ["ｱｲｳｴｵ", 0, 1, undefined, undefined, "ｱ"],
    ["ｱｲｳｴｵ", 0, 2, undefined, undefined, "ｱｲ"],
    ["ｱｲｳｴｵ", 0, 3, undefined, undefined, "ｱｲｳ"],
    ["\x1b[32mfoo\x1b[0m", 0, 3, undefined, undefined, "\x1b[32mfoo\x1b[0m"],
    ["\x1b[32mfoo\x1b[0m", 0, 2, undefined, true, "\x1b[32mfo\x1b[0m"],
    ["\x1b[32mfoo\x1b[0m", 0, 2, undefined, false, "\x1b[32mfo"],
  ] as const;

  for (
    const [input, start, end, ellipsis, preserveAllAnsi, expected]
      of EXPECTED_RESULTS
  ) {
    assertEquals(
      slice(input, start, end, ellipsis, preserveAllAnsi),
      expected,
      errorMessage(input),
    );
  }
});
