
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

    //Push constant 3030
    @3030
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to POINTER 0
    @3030
    D=A
    @3
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push constant 3040
    @3040
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to POINTER 1
    @3040
    D=A
    @4
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push constant 32
    @32
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to THIS 2
    @32
    D=A
    @3032
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push constant 46
    @46
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to THAT 6
    @46
    D=A
    @3046
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push to POINTER 0
    @3030
    D=A
    @256
    M=D
    @SP
    M=M+1
                
    //Push to POINTER 1
    @3040
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //add 3040 and 3030, result: 6070
    @6070
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  
    //Push to THIS 2
    @32
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //sub 32 and 6070, result: 6038
    @6038
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  
    //Push to THAT 6
    @46
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //add 46 and 6038, result: 6084
    @6084
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  