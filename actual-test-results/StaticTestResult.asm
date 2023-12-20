
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

    //Push constant 111
    @111
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 333
    @333
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 888
    @888
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to STATIC 8
    @888
    D=A
    @StaticTest.8
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Pop to STATIC 3
    @333
    D=A
    @StaticTest.3
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Pop to STATIC 1
    @111
    D=A
    @StaticTest.1
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push to STATIC 3
    @333
    D=A
    @256
    M=D
    @SP
    M=M+1
                
    //Push to STATIC 1
    @111
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //sub 111 and 333, result: 222
    @222
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  
    //Push to STATIC 8
    @888
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //add 888 and 222, result: 1110
    @1110
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  