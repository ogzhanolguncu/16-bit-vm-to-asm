import { expect, test } from 'bun:test';
import { Parser } from './parser';
import { readFile } from './utils';

test('should verify basic test case', async () => {
  const parser = new Parser('./tests/BasicTest.vm');
  await parser.scan();

  const firstFile = readFile('./tests/BasicTest.asm');
  const secondFile = readFile('./actual-test-results/BasicTestResult.asm');
  expect(firstFile).toEqual(secondFile);
});

test('should work with pointers', async () => {
  const parser = new Parser('./tests/PointerTest.vm');
  await parser.scan();

  const firstFile = readFile('./tests/PointerTest.asm');
  const secondFile = readFile('./actual-test-results/PointerTestResult.asm');
  expect(firstFile).toEqual(secondFile);
});

test('should work with simple add', async () => {
  const parser = new Parser('./tests/SimpleAdd.vm');
  await parser.scan();

  const firstFile = readFile('./tests/SimpleAdd.asm');
  const secondFile = readFile('./actual-test-results/SimpleAddResult.asm');
  expect(firstFile).toEqual(secondFile);
});

test('should work with various arithetic operations', async () => {
  const parser = new Parser('./tests/StackTest.vm');
  await parser.scan();

  const firstFile = readFile('./tests/StackTest.asm');
  const secondFile = readFile('./actual-test-results/StackTestResult.asm');
  expect(firstFile).toEqual(secondFile);
});
