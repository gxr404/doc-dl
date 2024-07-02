```
auto buf_ptr;
buf_ptr=qword(x1+0x10);
msg("%x\n",buf_ptr);
 
auto buf_1_len_ptr,buf_1_len,buf_1_ptr;
buf_1_len_ptr=buf_ptr+1;
buf_1_len=dword(buf_1_len_ptr);
buf_1_ptr=buf_1_len_ptr+4;
msg("%x,%x\n",buf_1_ptr,buf_1_len);
 
auto buf_2_len_ptr,buf_2_len,buf_2_ptr;
buf_2_len_ptr=buf_1_ptr+buf_1_len;
buf_2_len=dword(buf_2_len_ptr);
buf_2_ptr=buf_2_len_ptr+4;
msg("%x,%x\n",buf_2_ptr,buf_2_len);
 
auto buf_3_len_ptr,buf_3_len,buf_3_ptr;
buf_3_len_ptr=buf_2_ptr+buf_2_len;
buf_3_len=dword(buf_3_len_ptr);
buf_3_ptr=buf_3_len_ptr+4;
msg("%x,%x\n",buf_3_ptr,buf_3_len);
 
auto buf_4_len_ptr,buf_4_len,buf_4_ptr;
buf_4_len_ptr=buf_3_ptr+buf_3_len;
buf_4_len=dword(buf_4_len_ptr);
buf_4_ptr=buf_4_len_ptr+4;
msg("%x,%x\n",buf_4_ptr,buf_4_len);
 
auto buf_5_len,buf_5_ptr;
buf_5_ptr=buf_4_ptr+buf_4_len;
buf_5_len=dword(buf_5_ptr+0x28)+word(buf_5_ptr+0x3a)*word(buf_5_ptr+0x3c);
msg("%x,%x\n",buf_5_ptr,buf_5_len);
 
auto new_buf_1_ptr,new_buf_2_ptr,new_buf_3_ptr,new_buf_4_ptr;
new_buf_1_ptr=qword(x0+0x50);
new_buf_2_ptr=qword(x0+0x80);
new_buf_3_ptr=qword(x0+0x88);
new_buf_4_ptr=qword(x0+0x90);
msg("%x,%x,%x,%x\n",new_buf_1_ptr,new_buf_2_ptr,new_buf_3_ptr,new_buf_4_ptr);
 
 
auto ph_off,jmprel_off,rela_off,dynamic_off;
ph_off=qword(buf_5_ptr+0x20);
 
auto ph_index,ph_size,ph_num,temp_ptr;
ph_index=0;
ph_size=word(buf_5_ptr+0x36);
ph_num=word(buf_5_ptr+0x38);
while(ph_index<ph_num)
{
    temp_ptr=new_buf_1_ptr+ph_size*ph_index;
    if(dword(temp_ptr)==2)
    {
        dynamic_off=qword(temp_ptr+8);
        break;
    }
    ph_index++;
}
 
auto dyn_index,dyn_size,dyn_num;
dyn_index=0;
dyn_size=0x10;
dyn_num=buf_4_len/dyn_size;
while(dyn_index<dyn_num)
{
    temp_ptr=new_buf_4_ptr+dyn_size*dyn_index;
    if(dword(temp_ptr)==0x17)
    {
        jmprel_off=qword(temp_ptr+8);
    }
    else if(dword(temp_ptr)==7)
    {
        rela_off=qword(temp_ptr+8);
    }
    dyn_index++;
}
msg("%x,%x,%x,%x\n",ph_off,jmprel_off,rela_off,dynamic_off);
 
 
msg("start\n");
auto dump_so ;
dump_so =fopen("D:\\ dump.so","wb");
 
savefile(dump_so, 0, buf_5_ptr, buf_5_len);
msg("save so(buf_5)\n");
 
savefile(dump_so, ph_off, new_buf_1_ptr, buf_1_len);
msg("save Phdrs((buf_1))\n");
 
savefile(dump_so, jmprel_off, new_buf_2_ptr, buf_2_len);
msg("save DT_JMPREL(buf_2)\n");
 
savefile(dump_so, rela_off, new_buf_3_ptr, buf_3_len);
msg("save DT_RELA(buf_3)\n");
 
savefile(dump_so, dynamic_off, new_buf_4_ptr, buf_4_len);
msg("save PT_DYNAMIC(buf_4)\n");
 
 
fclose(dump_so);
 
msg("end\n");
```