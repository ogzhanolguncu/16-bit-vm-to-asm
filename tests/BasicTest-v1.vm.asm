
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
      