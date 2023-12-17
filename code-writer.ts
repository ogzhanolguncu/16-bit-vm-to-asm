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
const REGISTER_OF_THIS = 3000;
const REGISTER_OF_THAT = 3010;
export class CodeWriter {
  RAM = [
    REGISTER_OF_SP,
    REGISTER_OF_LCL,
    REGISTER_OF_ARG,
    REGISTER_OF_THIS,
    REGISTER_OF_THAT,
  ];

  //CALCULATE OFFSETS HERE
  SP = REGISTER_OF_SP;
  LCL = REGISTER_OF_LCL;
  ARG = REGISTER_OF_ARG;
  _THIS = REGISTER_OF_THIS;
  _THAT = REGISTER_OF_THAT;

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
    if (LIST_OF_ARITHMETIC_AND_LOGICAL.includes(input)) {
      this.writeArithmetic(input);
    }
    this.writePushPop(
      input.split(" ") as [
        commandType: CommandType,
        segment: string,
        index: string
      ]
    );
  }

  writeArithmetic(input: string) {
    //TODO:
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
          this.RAM[this.SP++] = index;

          this.source += `
        //Push constant ${index}
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
      }
    }
    if (commandType === "C_POP") {
      this.pop(index, segment);
    }
  }
  //257 -> 300
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
    } else return ["ERROR", 99999999, 99999999];
  }

  private currentValueAtSP() {
    const SP = this.RAM[--this.SP];
    return SP;
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
