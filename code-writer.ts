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

import { CommandType, LIST_OF_ARITHMETIC_AND_LOGICAL } from "./parser";

const REGISTER_OF_SP = 256;
const REGISTER_OF_LCL = 300;
const REGISTER_OF_ARG = 400;
const REGISTER_OF_TEMP = 5;
const REGISTER_OF_THIS = 3000;
const REGISTER_OF_THAT = 3010;
export class CodeWriter {
  RAM = [
    REGISTER_OF_SP,
    REGISTER_OF_LCL,
    REGISTER_OF_ARG,
    REGISTER_OF_THIS,
    REGISTER_OF_THAT,
    REGISTER_OF_TEMP,
  ];

  //CALCULATE OFFSETS HERE
  SP = REGISTER_OF_SP;
  LCL = REGISTER_OF_LCL;
  ARG = REGISTER_OF_ARG;
  _THIS = REGISTER_OF_THIS;
  _THAT = REGISTER_OF_THAT;
  TEMP = REGISTER_OF_TEMP;

  source = "";

  constructor() {
    this.generateAssemblyCodeForInitialization();
  }

  write(input: string) {
    const cleanedInput = input.replace(/undefined|null|UNKNOWN/g, "").trim();
    if (!cleanedInput) return;

    if (LIST_OF_ARITHMETIC_AND_LOGICAL.includes(cleanedInput)) {
      this.writeArithmetic(cleanedInput);
    } else {
      this.writePushPop(
        cleanedInput.split(" ") as [
          commandType: CommandType,
          segment: string,
          index: string
        ]
      );
    }
  }

  writeArithmetic(operation: string) {
    if (operation === "add") {
      const { firstNum, secondNum, result } = this.performStackOperation(
        (a, b) => a + b
      );
      this.generateAssemblyCodeForArithmetic(
        operation,
        firstNum,
        secondNum,
        result
      );
    }

    if (operation === "sub") {
      const { firstNum, secondNum, result } = this.performStackOperation(
        (a, b) => b - a
      );
      this.generateAssemblyCodeForArithmetic(
        operation,
        firstNum,
        secondNum,
        result
      );
    }
  }

  performStackOperation(
    operation: (firstNum: number, secondNum: number) => number
  ): { firstNum: number; secondNum: number; result: number } {
    const firstNum = this.popFromStack();
    const secondNum = this.popFromStack();
    const result = operation(firstNum, secondNum);

    this.RAM[this.SP++] = result;
    return { firstNum, secondNum, result } as const;
  }

  private generateAssemblyCodeForArithmetic(
    operation: string,
    firstNum: number,
    secondNum: number,
    result: number
  ) {
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

    if (commandType === "C_PUSH") {
      if (segment === "constant") {
        this.pushConstantToStack(index);
      } else {
        this.pushIntoSegment(index, segment);
      }
    } else if (commandType === "C_POP") {
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
    let [_segment, _, pointerOfSegment] = this.extractSegment(segment);

    const valueAt = this.RAM[pointerOfSegment + offset];
    this.generateAssemblyCodeForPush(_segment, offset, valueAt);
    this.pushToStack(valueAt);
  }

  private generateAssemblyCodeForPush(
    segment: string,
    offset: number,
    address: number
  ) {
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
    let [_segment, location, pointerOfSegment] = this.extractSegment(segment);
    const valueAtSP = this.popFromStack();
    this.RAM[location] = pointerOfSegment + offset;
    this.RAM[pointerOfSegment + offset] = valueAtSP;

    this.generateAssemblyCodePop(
      _segment,
      offset,
      valueAtSP,
      pointerOfSegment + offset
    );
  }

  private generateAssemblyCodePop(
    segment: string,
    offset: number,
    value: number,
    address: number
  ) {
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

  private extractSegment(segment: string): [string, number, number] {
    const segmentMap: Record<string, [string, number, number]> = {
      local: ["LCL", 1, this.LCL],
      argument: ["ARG", 2, this.ARG],
      this: ["THIS", 3, this._THIS],
      that: ["THAT", 4, this._THAT],
      temp: ["TEMP", 5, this.TEMP],
    };

    const result = segmentMap[segment];
    if (!result) {
      throw new Error(`Unknown segment: ${segment}`);
    }
    return result;
  }

  private popFromStack() {
    if (this.SP < REGISTER_OF_SP) {
      throw new Error(
        "Stack underflow: Not enough data on the stack to perform the operation"
      );
    }
    return this.RAM[--this.SP];
  }

  private pushToStack(value: number) {
    if (this.SP >= 2047) {
      throw new Error(
        "Stack overflow: Too many data on the stack to perform the operation"
      );
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
}
