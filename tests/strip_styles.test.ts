import { assertEquals } from "jsr:@std/assert@0.215.0";
import { stripStyles } from "../src/strip_styles.ts";

Deno.test("stripStyles()", () => {
  const words = ["foo", "bar", "baz"];
  const modifiers = ["\x1b[31m", "\x1b[32m", "\x1b[33m"];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const modifier = modifiers[i];

    const styledWord = `${modifier}${word}\x1b[0m`;
    assertEquals(stripStyles(styledWord), word);

    for (let j = 0; j < words.length; j++) {
      const otherWord = words[j];
      const otherModifier = modifiers[j];

      const styledWords =
        `${modifier}${word}${otherModifier}${otherWord}\x1b[0m`;

      assertEquals(stripStyles(styledWords), word + otherWord);
    }
  }
});
