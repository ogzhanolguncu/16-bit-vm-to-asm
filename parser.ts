import {
  MAX_STACK_SIZE,
  REGISTER_OF_SP,
  REGISTER_OF_LCL,
  REGISTER_OF_ARG,
  REGISTER_OF_THIS,
  REGISTER_OF_THAT,
  REGISTER_OF_TEMP,
  SEGMENT,
  INDEX_OF_LCL,
  INDEX_OF_ARG,
  INDEX_OF_THIS,
  INDEX_OF_THAT,
  INDEX_OF_TEMP,
  POINTER_THIS,
  EQUAL,
  NOT_EQUAL,
  INDEX_OF_STATIC,
  REGISTER_OF_STATIC,
} from './constants';
import { CommandType, LIST_OF_ARITHMETIC_AND_LOGICAL } from './lexer';

/**
 *           0      SP
 *           1      LCL
 *           2      ARG
 *           3      THIS
 *           4      THAT
 *           5
 *           .
 *           .      TEMP
 *           .
 *           12
 *           13
 *           14     GENERAL PURPOSE
 *           15
 *           16
 *           .
 *           .      STATIC VARIABLES
 *           .
 *           256
 *           .
 *           .      STACK
 *           .
 *           2047
 *
 */

export class CodeWriter {
  RAM: number[] = new Array(MAX_STACK_SIZE).fill(0);
  SP = REGISTER_OF_SP;

  pointerActive = false;
  source = '';
  fileName = '';

  constructor() {
    this.RAM[0] = REGISTER_OF_SP; // SP
    this.RAM[1] = REGISTER_OF_LCL; // LCL
    this.RAM[2] = REGISTER_OF_ARG; // ARG
    this.RAM[3] = REGISTER_OF_THIS; // THIS
    this.RAM[4] = REGISTER_OF_THAT; // THAT
    this.RAM[5] = REGISTER_OF_TEMP; // TEMP
    this.RAM[16] = REGISTER_OF_TEMP; // TEMP

    this.generateAssemblyCodeForInitialization();
  }

  write(input: string, fileName: string) {
    this.fileName = fileName;
    const cleanedInput = input.replace(/undefined|null|UNKNOWN/g, '').trim();
    if (!cleanedInput) return;

    if (LIST_OF_ARITHMETIC_AND_LOGICAL.includes(cleanedInput)) {
      this.writeArithmetic(cleanedInput);
    } else {
      this.writePushPop(cleanedInput.split(' ') as [commandType: CommandType, segment: string, index: string]);
    }
  }

  writeArithmetic(operation: string) {
    switch (operation) {
      case 'add': {
        const { firstNum, secondNum, result } = this.performStackOperation((a, b) => a + b);
        this.generateAssemblyCodeForArithmetic(operation, firstNum, secondNum, result);
        break;
      }
      case 'sub': {
        const { firstNum, secondNum, result } = this.performStackOperation((a, b) => b - a);
        this.generateAssemblyCodeForArithmetic(operation, firstNum, secondNum, result);
        break;
      }
      case 'eq': {
        const { firstNum, secondNum, result } = this.performStackOperation((a, b) => (b === a ? EQUAL : NOT_EQUAL));
        this.generateAssemblyCodeForArithmetic(operation, firstNum, secondNum, result);
        break;
      }
      case 'lt': {
        const { firstNum, secondNum, result } = this.performStackOperation((a, b) => (b < a ? EQUAL : NOT_EQUAL));
        this.generateAssemblyCodeForArithmetic(operation, firstNum, secondNum, result);
        break;
      }
      case 'gt': {
        const { firstNum, secondNum, result } = this.performStackOperation((a, b) => (b > a ? EQUAL : NOT_EQUAL));
        this.generateAssemblyCodeForArithmetic(operation, firstNum, secondNum, result);
        break;
      }
      case 'neg': {
        const { firstNum, result } = this.performNegateStackOperation((a) => a * -1);
        this.generateAssemblyCodeForArithmetic(operation, firstNum, -1, result);
        break;
      }
      case 'and': {
        const { firstNum, secondNum, result } = this.performStackOperation((a, b) => a & b);
        this.generateAssemblyCodeForArithmetic(operation, firstNum, secondNum, result);
        break;
      }
      case 'or': {
        const { firstNum, secondNum, result } = this.performStackOperation((a, b) => a | b);
        this.generateAssemblyCodeForArithmetic(operation, firstNum, secondNum, result);
        break;
      }
      case 'not': {
        const { firstNum, result } = this.performNegateStackOperation((a) => ~a);
        this.generateAssemblyCodeForArithmetic(operation, firstNum, -1, result);
        break;
      }
    }
  }

  performStackOperation(operation: (firstNum: number, secondNum: number) => number): {
    firstNum: number;
    secondNum: number;
    result: number;
  } {
    const firstNum = this.popFromStack();
    const secondNum = this.popFromStack();
    const result = operation(firstNum, secondNum);

    this.RAM[this.SP++] = result;
    return { firstNum, secondNum, result } as const;
  }

  performNegateStackOperation(operation: (firstNum: number) => number): {
    firstNum: number;
    result: number;
  } {
    const firstNum = this.popFromStack();
    const result = operation(firstNum);

    this.RAM[this.SP++] = result;
    return { firstNum, result } as const;
  }

  private generateAssemblyCodeForArithmetic(operation: string, firstNum: number, secondNum: number, result: number) {
    this.source += `
    //${operation} ${firstNum} and ${secondNum}, result: ${result}
    @${result}
    D=A
    @${this.SP - 1}
    M=D
    @${this.SP}
    M=0
    @SP
    M=M-1
  `;
  }

  /**
   * Handles push and pop commands.
   * @param {CommandType, string, string} commandInfo - Contains command type, segment, and index.
   */
  writePushPop([commandType, segment, _index]: [CommandType, string, string]) {
    const index = parseInt(_index, 10);
    if (isNaN(index)) {
      throw new Error(`Invalid index: ${_index}`);
    }

    if (commandType === 'C_PUSH') {
      if (segment === 'constant') {
        this.pushConstantToStack(index);
      } else {
        this.pushIntoSegment(index, segment);
      }
    } else if (commandType === 'C_POP') {
      this.initializePointer(segment);
      this.pop(index, segment);
    }
  }

  private pushConstantToStack(value: number) {
    this.pushToStack(value);
    this.source += `
    //Push constant ${value}
    @${value}
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    `;
  }

  private pushIntoSegment(offset: number, segment: string) {
    let [_segment, _, pointerOfSegment] = this.extractSegment(segment, offset);

    let valueAt = this.RAM[pointerOfSegment + offset];
    this.generateAssemblyCodeForPush(
      _segment,
      offset,
      this.pointerActive && segment === 'pointer' ? pointerOfSegment : valueAt
    );
    this.pushToStack(this.pointerActive && segment === 'pointer' ? pointerOfSegment : valueAt);
  }

  private generateAssemblyCodeForPush(segment: string, offset: number, address: number) {
    this.source += `
    //Push to ${segment} ${offset}
    @${address}
    D=A
    @${this.SP}
    M=D
    @SP
    M=M+1
                `;
  }

  private pop(offset: number, segment: string) {
    let [_segment, location, pointerOfSegment] = this.extractSegment(segment, offset);
    const valueAtSP = this.popFromStack();

    if (segment === 'pointer') {
      this.RAM[location] = valueAtSP;
    } else {
      if (!this.pointerActive) {
        this.RAM[location] = pointerOfSegment + offset;
      }
      this.RAM[pointerOfSegment + offset] = valueAtSP;
    }

    if (segment === 'static') {
      this.RAM[pointerOfSegment + offset] = valueAtSP;
      console.log({
        location,
        pointerOfSegment,
        offset,
        valueAtSP,
        17: this.RAM[17],
        19: this.RAM[19],
        24: this.RAM[24],
      });
      this.generateAssemblyCodePop(_segment, offset, valueAtSP, `${this.fileName}.${offset}`);
      return;
    }

    this.generateAssemblyCodePop(
      _segment,
      offset,
      valueAtSP,
      segment === 'pointer' ? location : pointerOfSegment + offset
    );
  }

  private generateAssemblyCodePop(segment: string, offset: number, value: number, address: number | string) {
    this.source += `
    //Pop to ${segment} ${offset}
    @${value}
    D=A
    @${address}
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      `;
  }

  private extractSegment(segment: string, offset?: number): [string, number, number] {
    const segmentMap: Record<string, [segment: string, location: number, pointerOfSegment: number]> = {
      [SEGMENT.LOCAL]: ['LCL', INDEX_OF_LCL, REGISTER_OF_LCL],
      [SEGMENT.ARGUMENT]: ['ARG', INDEX_OF_ARG, REGISTER_OF_ARG],
      [SEGMENT.THIS]: ['THIS', INDEX_OF_THIS, this.pointerActive ? this.RAM[3] : REGISTER_OF_THIS],
      [SEGMENT.THAT]: ['THAT', INDEX_OF_THAT, this.pointerActive ? this.RAM[4] : REGISTER_OF_THAT],
      [SEGMENT.TEMP]: ['TEMP', INDEX_OF_TEMP, REGISTER_OF_TEMP],
      [SEGMENT.STATIC]: ['STATIC', INDEX_OF_STATIC, REGISTER_OF_STATIC],
      [SEGMENT.POINTER]: [
        'POINTER',
        offset === POINTER_THIS ? INDEX_OF_THIS : INDEX_OF_THAT,
        offset === POINTER_THIS ? this.RAM[3] : this.RAM[4],
      ],
    };

    const result = segmentMap[segment];
    if (!result) {
      throw new Error(`Unknown segment: ${segment}`);
    }
    return result;
  }

  private popFromStack() {
    if (this.SP < REGISTER_OF_SP) {
      throw new Error('Stack underflow: Not enough data on the stack to perform the operation');
    }
    return this.RAM[--this.SP];
  }

  private pushToStack(value: number) {
    if (this.SP >= 2047) {
      throw new Error('Stack overflow: Too many data on the stack to perform the operation');
    }
    this.RAM[this.SP++] = value;
  }

  private generateAssemblyCodeForInitialization() {
    this.source += `
    //Initialize SP
    @${this.RAM[0]}
    D=A
    @SP
    M=D

    //Initialize LCL
    @${this.RAM[1]}
    D=A
    @LCL
    M=D

    //Initialize ARG
    @${this.RAM[2]}
    D=A
    @ARG
    M=D

    //Initialize THIS
    @${this.RAM[3]}
    D=A
    @THIS
    M=D

    //Initialize THAT
    @${this.RAM[4]}
    D=A
    @THAT
    M=D
`;
  }

  private initializePointer(segment: string) {
    if (segment === 'pointer') {
      this.pointerActive = true;
    }
  }
}
