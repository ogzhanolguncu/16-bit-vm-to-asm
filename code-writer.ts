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

  write(input: string) {
    const cleanedInput = input.replace(/undefined|null/g, "").trim();
    if (LIST_OF_ARITHMETIC_AND_LOGICAL.includes(cleanedInput)) {
      this.writeArithmetic(cleanedInput);
    }
    this.writePushPop(
      cleanedInput.split(" ") as [
        commandType: CommandType,
        segment: string,
        index: string
      ]
    );
  }

  writeArithmetic(input: string) {
    //TODO:
    //get last two item from stack pointer
    //add them
    //add them back into stack
    //must support add and sub
    if (input === "add") {
      const firstNum = this.RAM[--this.SP];
      const secondNum = this.RAM[--this.SP];
      this.RAM[this.SP++] = firstNum + secondNum;

      this.source += `
    //Add ${firstNum} and ${secondNum} result: ${firstNum + secondNum}
    @${firstNum + secondNum}
    D=A
    @${this.SP - 1}
    M=D
    @${this.SP}
    M=0
    @SP
    M=M-1
        `;
    }

    if (input === "sub") {
      const firstNum = this.RAM[--this.SP];
      const secondNum = this.RAM[--this.SP];
      this.RAM[this.SP++] = secondNum - firstNum;

      this.source += `
    //Sub ${firstNum} and ${secondNum} result: ${secondNum - firstNum}
    @${secondNum - firstNum}
    D=A
    @${this.SP - 1}
    M=D
    @${this.SP}
    M=0
    @SP
    M=M-1
        `;
    }
  }

  writePushPop([commandType, segment, _index]: [
    commandType: CommandType,
    segment: string,
    _index: string
  ]) {
    const index = parseInt(_index);
    if (commandType === "C_PUSH") {
      switch (segment) {
        case "constant": {
          this.RAM[this.SP] = index;

          this.source += `
    //Push to ${segment.toUpperCase()} ${index}
    @${index}
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
          `;
          break;
        }

        default:
          this.push(index, segment);
          break;
      }
      this.advanceSP();
    }
    if (commandType === "C_POP") {
      this.retreatSP();
      this.pop(index, segment);
    }
  }

  private push(offset: number, segment: string) {
    let [_segment, _, pointerOfSegment] = this.extractSegment(segment);

    const valueAt = this.RAM[pointerOfSegment + offset];
    this.RAM[this.SP] = valueAt;

    this.source += `
    //Push to ${_segment} ${offset}
    @${valueAt}
    D=A
    @${this.SP}
    M=D
    @SP
    M=M+1
                `;
  }

  private pop(offset: number, segment: string) {
    let [_segment, location, pointerOfSegment] = this.extractSegment(segment);
    const valueAtSP = this.currentValueAtSP();
    this.RAM[location] = pointerOfSegment + offset;
    this.RAM[pointerOfSegment + offset] = valueAtSP;

    this.source += `
    //Pop to ${_segment} ${offset}
    @${valueAtSP}
    D=A
    @${this.RAM[location]}
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      `;
  }

  private extractSegment(
    segment: string
  ): [string, segmentValue: number, pointerOfSegment: number] {
    if (segment === "local") {
      return ["LCL", 1, this.LCL];
    } else if (segment === "argument") {
      return ["ARG", 2, this.ARG];
    } else if (segment === "this") {
      return ["THIS", 3, this._THIS];
    } else if (segment === "that") {
      return ["THAT", 4, this._THAT];
    } else if (segment === "temp") {
      return ["TEMP", 5, this.TEMP];
    } else return ["ERROR", 99999999, 99999999];
  }

  private currentValueAtSP() {
    const SP = this.RAM[this.SP];
    return SP;
  }

  private advanceSP() {
    this.SP++;
  }
  private retreatSP() {
    this.SP--;
  }
}

//TO SELECT SOMEWHERE IN THE MEMORY LIKE RAM[256] = 0 LIKE POINTER
//USE THIS
//@SP
//A=M
//M=0

//TO ASSIGN SOMEWHERE DIRECTLY IN THE MEMORY LIKE CHANGING SP; MEANING RAM[0] = 0
//@SP
//M=0
//This is the same technique we use to increment SP,LCL,THIS,THAT like SP++,LCL++
