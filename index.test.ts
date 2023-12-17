import { test } from "bun:test";
import { Parser } from "./parser";

test("todo", () => {
  const parser = new Parser("./tests/BasicTest.vm");
  parser.scan();
  //   expect(parser.scanTokens()).toEqual("p");
});
