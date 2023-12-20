import { expect, test } from 'bun:test';
import { Parser } from './lexer';
import { readFile } from './utils';

test('should verify basic test case', async () => {
  const parser = new Parser('./tests/BasicTest.vm', 'BasicTest');
  await parser.scan();

  const firstFile = readFile('./tests/BasicTest.asm');
  const secondFile = readFile('./actual-test-results/BasicTestResult.asm');
  expect(firstFile).toEqual(secondFile);
});

test('should work with pointers', async () => {
  const parser = new Parser('./tests/PointerTest.vm', 'PointerTest');
  await parser.scan();

  const firstFile = readFile('./tests/PointerTest.asm');
  const secondFile = readFile('./actual-test-results/PointerTestResult.asm');
  expect(firstFile).toEqual(secondFile);
});

test('should work with simple add', async () => {
  const parser = new Parser('./tests/SimpleAdd.vm', 'SimpleAdd');
  await parser.scan();

  const firstFile = readFile('./tests/SimpleAdd.asm');
  const secondFile = readFile('./actual-test-results/SimpleAddResult.asm');
  expect(firstFile).toEqual(secondFile);
});

test('should work with various arithetic operations', async () => {
  const parser = new Parser('./tests/StackTest.vm', 'SimpleAdd');
  await parser.scan();

  const firstFile = readFile('./tests/StackTest.asm');
  const secondFile = readFile('./actual-test-results/StackTestResult.asm');
  expect(firstFile).toEqual(secondFile);
});

test('should work with statics', async () => {
  const parser = new Parser('./tests/StaticTest.vm', 'StaticTest');
  await parser.scan();

  const firstFile = readFile('./tests/StaticTest.asm');
  const secondFile = readFile('./actual-test-results/StaticTestResult.asm');
  expect(firstFile).toEqual(secondFile);
});
