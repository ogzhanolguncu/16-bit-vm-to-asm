import { CodeWriter } from './parser';
import { readFile } from './utils';

export type CommandType =
  | 'C_ARITHMETIC'
  | 'C_PUSH'
  | 'C_POP'
  | 'C_IF'
  | 'C_FUNCTION'
  | 'C_RETURN'
  | 'C_CALL'
  | 'UNKNOWN';

export const LIST_OF_ARITHMETIC_AND_LOGICAL = ['add', 'sub', 'neg', 'eq', 'gt', 'lt', 'and', 'or', 'not'];

export class Parser {
  private source: string;
  private line = 1;
  private fileName: string;
  private sourceLineCount = 0;
  private current = 0;

  constructor(fileName: string) {
    this.fileName = fileName;
    this.source = readFile(this.fileName);
    this.sourceLineCount = this.source.split('\n').length;
  }

  show() {
    return this.source;
  }

  async scan() {
    const codeWritter = new CodeWriter();
    while (this.line <= this.sourceLineCount) {
      const scannedLine = this.readLine();
      if (scannedLine.startsWith('//' || scannedLine === '')) continue; //Skips newline and comment
      codeWritter.write(
        `${this.commandType(scannedLine)} ${this.arg1(scannedLine)} ${this.arg2(
          this.commandType(scannedLine),
          scannedLine
        )}`
      );
      this.line++;
    }
    await Bun.write(`${this.fileName.replace('.vm', '')}.asm`, codeWritter.source);
  }

  private readLine() {
    let line = '';
    while (this.current < this.source.length && this.peek() !== '\n') {
      line += this.source.charAt(this.current);
      this.advance();
    }
    this.advance(); //Skips the newline
    return line.split('//')[0].trim(); // Remove  inline comment
  }

  private commandType(line: string): CommandType | string {
    const [commandType] = this.commandParts(line);
    if (LIST_OF_ARITHMETIC_AND_LOGICAL.includes(commandType)) return commandType;

    if (commandType === 'push') return 'C_PUSH';
    else if (commandType === 'pop') return 'C_POP';
    else return 'UNKNOWN';
  }

  private arg1(line: string) {
    const [_, memorySegment] = this.commandParts(line);
    return memorySegment;
  }

  //Should be called only if the current command is C_PUSH, C_POP, C_FUNCTION, C_CALL
  private arg2(commandType: CommandType | string, line: string) {
    const [_, __, register] = this.commandParts(line);
    if (['C_PUSH', 'C_POP', 'C_FUNCTION', 'C_CALL'].includes(commandType)) return register;
    return null;
  }

  private commandParts(line: string): [string, string, number] {
    const [rawCommand, memorySegment, register] = line.split(' ');
    return [rawCommand, memorySegment, parseInt(register)];
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }
}
