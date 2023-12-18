import { expect, test } from "bun:test";
import { Parser } from "./parser";
import { readFile } from "./utils";

test("should verify basic test case", async () => {
  const parser = new Parser("./tests/BasicTest.vm");
  await parser.scan();

  const firstFile = readFile("./tests/BasicTest.asm");
  const secondFile = readFile("./actual-test-results/BasicTest-result.asm");
  expect(firstFile).toEqual(secondFile);
});

test("should work with pointers", async () => {
  const parser = new Parser("./tests/PointerTest.vm");
  await parser.scan();

  const firstFile = readFile("./tests/PointerTest.asm");
  const secondFile = readFile("./actual-test-results/PointerTest-result.asm");
  expect(firstFile).toEqual(secondFile);
});
