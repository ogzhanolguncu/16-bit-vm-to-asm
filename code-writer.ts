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

export class CodeWriter {
  RAM = [256, 300, 400, 3000, 3010];

  SP = 256;
  LCL = 300;

  source = "";

  constructor() {
    this.source += `
//Initialize SP
@${this.SP}
D=A
@SP
M=D

//Initialize LCL
@${this.LCL}
D=A
@LCL
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
        index: number
      ]
    );
  }

  writeArithmetic(input: string) {
    //TODO:
  }

  writePushPop([commandType, segment, index]: [
    commandType: CommandType,
    segment: string,
    index: number
  ]) {
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
        }
      }
    }

    if (commandType === "C_POP") {
      switch (segment) {
        case "local": {
          this.RAM[(this.LCL += index)] = --this.SP;
          this.source += `
//Pop local ${index}
@${this.RAM[this.SP]}
D=A
@LCL
A=M
M=D
@LCL
M=M+1
@SP
M=M-1
@SP
A=M
M=0
              `;
        }
      }
    }
  }
}

// push constant 10
//pop local 0

//TO SELECT SOMEWHERE IN THE MEMORY LIKE RAM[256] = 0 LIKE POINTER
//USE THIS
//@SP
//A=M
//M=0

//TO ASSIGN SOMEWHERE DIRECTLY IN THE MEMORY LIKE CHANGING SP; MEANING RAM[0] = 0
//@SP
//M=0
