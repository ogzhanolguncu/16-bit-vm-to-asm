
    //Initialize SP
    @256
    D=A
    @SP
    M=D

    //Initialize LCL
    @300
    D=A
    @LCL
    M=D

    //Initialize ARG
    @400
    D=A
    @ARG
    M=D

    //Initialize THIS
    @3000
    D=A
    @THIS
    M=D

    //Initialize THAT
    @3010
    D=A
    @THAT
    M=D

    //Push constant 7
    @7
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 8
    @8
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //add 8 and 7, result: 15
    @15
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  