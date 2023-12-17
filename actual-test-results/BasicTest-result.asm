
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

    //Push constant 10
    @10
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to LCL 0
    @10
    D=A
    @300
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push constant 21
    @21
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 22
    @22
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to ARG 2
    @22
    D=A
    @402
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Pop to ARG 1
    @21
    D=A
    @401
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push constant 36
    @36
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to THIS 6
    @36
    D=A
    @3006
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push constant 42
    @42
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 45
    @45
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to THAT 5
    @45
    D=A
    @3015
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Pop to THAT 2
    @42
    D=A
    @3012
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push constant 510
    @510
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Pop to TEMP 6
    @510
    D=A
    @11
    M=D
    @SP
    M=M-1
    @SP
    A=M
    M=0
      
    //Push to LCL 0
    @10
    D=A
    @256
    M=D
    @SP
    M=M+1
                
    //Push to THAT 5
    @45
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //add 45 and 10, result: 55
    @55
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  
    //Push to ARG 1
    @21
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //sub 21 and 55, result: 34
    @34
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  
    //Push to THIS 6
    @36
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //Push to THIS 6
    @36
    D=A
    @258
    M=D
    @SP
    M=M+1
                
    //add 36 and 36, result: 72
    @72
    D=A
    @257
    M=D
    @258
    M=0
    @SP
    M=M-1
  
    //sub 72 and 34, result: -38
    @-38
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  
    //Push to TEMP 6
    @510
    D=A
    @257
    M=D
    @SP
    M=M+1
                
    //add 510 and -38, result: 472
    @472
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  