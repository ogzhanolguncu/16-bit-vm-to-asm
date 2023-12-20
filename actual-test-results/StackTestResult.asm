
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

    //Push constant 17
    @17
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 17
    @17
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //eq 17 and 17, result: -1
    @-1
    D=A
    @256
    M=D
    @257
    M=0
    @SP
    M=M-1
  
    //Push constant 17
    @17
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 16
    @16
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //eq 16 and 17, result: 0
    @0
    D=A
    @257
    M=D
    @258
    M=0
    @SP
    M=M-1
  
    //Push constant 16
    @16
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 17
    @17
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //eq 17 and 16, result: 0
    @0
    D=A
    @258
    M=D
    @259
    M=0
    @SP
    M=M-1
  
    //Push constant 892
    @892
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 891
    @891
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //lt 891 and 892, result: 0
    @0
    D=A
    @259
    M=D
    @260
    M=0
    @SP
    M=M-1
  
    //Push constant 891
    @891
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 892
    @892
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //lt 892 and 891, result: -1
    @-1
    D=A
    @260
    M=D
    @261
    M=0
    @SP
    M=M-1
  
    //Push constant 891
    @891
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 891
    @891
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //lt 891 and 891, result: 0
    @0
    D=A
    @261
    M=D
    @262
    M=0
    @SP
    M=M-1
  
    //Push constant 32767
    @32767
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 32766
    @32766
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //gt 32766 and 32767, result: -1
    @-1
    D=A
    @262
    M=D
    @263
    M=0
    @SP
    M=M-1
  
    //Push constant 32766
    @32766
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 32767
    @32767
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //gt 32767 and 32766, result: 0
    @0
    D=A
    @263
    M=D
    @264
    M=0
    @SP
    M=M-1
  
    //Push constant 32766
    @32766
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 32766
    @32766
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //gt 32766 and 32766, result: 0
    @0
    D=A
    @264
    M=D
    @265
    M=0
    @SP
    M=M-1
  
    //Push constant 57
    @57
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 31
    @31
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //Push constant 53
    @53
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //add 53 and 31, result: 84
    @84
    D=A
    @266
    M=D
    @267
    M=0
    @SP
    M=M-1
  
    //Push constant 112
    @112
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //sub 112 and 84, result: -28
    @-28
    D=A
    @266
    M=D
    @267
    M=0
    @SP
    M=M-1
  
    //neg -28 and -1, result: 28
    @28
    D=A
    @266
    M=D
    @267
    M=0
    @SP
    M=M-1
  
    //and 28 and 57, result: 24
    @24
    D=A
    @265
    M=D
    @266
    M=0
    @SP
    M=M-1
  
    //Push constant 82
    @82
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    
    //or 82 and 24, result: 90
    @90
    D=A
    @265
    M=D
    @266
    M=0
    @SP
    M=M-1
  
    //not 90 and -1, result: -91
    @-91
    D=A
    @265
    M=D
    @266
    M=0
    @SP
    M=M-1
  