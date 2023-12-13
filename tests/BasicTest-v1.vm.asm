
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
    
//Push constant 10
@10
D=A
@SP
A=M
M=D
@SP
M=M+1
          
//Pop local 0
@10
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
              