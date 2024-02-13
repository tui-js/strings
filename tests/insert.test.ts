import { assertEquals } from "@std/assert";
import { errorMessage } from "./shared.ts";

import { insert } from "../src/insert.ts";

Deno.test("insert()", () => {
  // TODO(Im-Beast): More test cases
  const EXPECTED_RESULTS = [
    ["Hello, World!", "Doggo", 7, "Hello, Doggo!"],
    ["🐶 woof woof", "🐱 meow", 8, "🐶 woof 🐱 meow"],
    ["This is background", "fore", 8, "This is foreground"],
  ] as const;

  for (const [input, content, position, expected] of EXPECTED_RESULTS) {
    assertEquals(
      insert(input, content, position),
      expected,
      errorMessage(input),
    );
  }
});
