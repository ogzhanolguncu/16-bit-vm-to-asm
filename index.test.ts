import { test } from "bun:test";
import { Parser } from "./parser";

test("todo", () => {
  const parser = new Parser("./tests/BasicTest-v1.vm");
  parser.scan();
  //   expect(parser.scanTokens()).toEqual("p");
});
