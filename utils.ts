import { readFileSync } from "fs";

export function extractFileName(inputString: string): string | null {
  const regexPattern: RegExp = /\/([^\/]+)\.asm$/;

  const matchArray = inputString.match(regexPattern);

  if (matchArray && matchArray.length > 1) {
    return matchArray[1];
  } else {
    return null;
  }
}

type Fn<A, B> = (_: A) => B;

interface Pipe<A, B> extends Fn<A, B> {
  then<C>(g: Fn<B, C>): Pipe<A, C>;
}

export function pipe<A>(): Pipe<A, A> {
  function _pipe<A, B>(f: Fn<A, B>): Pipe<A, B> {
    return Object.assign(f, {
      then<C>(g: Fn<B, C>): Pipe<A, C> {
        return _pipe<A, C>((a) => g(f(a)));
      },
    });
  }
  return _pipe((a) => a);
}

export function readFile(filePath: string): string {
  try {
    const text = readFileSync(filePath, "utf-8");
    return text;
  } catch (error) {
    console.error(`Error reading file: ${(error as Error).message}`);
    throw error;
  }
}
