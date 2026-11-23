import {mkdirSync,readFileSync,readdirSync,writeFileSync} from "node:fs";
const IR=process.argv[2]||process.env.MAKEFUN_INPUT_DIR||"/input",OR=process.argv[3]||process.env.MAKEFUN_OUTPUT_DIR||"/output";
function run(p,i){
  const s=new Int32Array(257),c=new Int32Array(64),m=new Int32Array(256);
  let sp=0,cp=0,pc=0,st=0,ip=0;
  const o=[];
  const need=n=>{if(sp<n)throw 2};
  const room=()=>{if(sp>=256)throw 3};
  try{
    for(;;){
      if(st>=1e6)throw 10;
      if(pc<0||pc>=p.length)throw 9;
      const op=p[pc];
      let il=0;
      if(op<8)il=op===1?1:op===2?4:0;
      else if(op>=16&&op<=30)il=0;
      else if(op>=32&&op<=34)il=0;
      else if(op>=48&&op<=52)il=op===52?0:2;
      else if(op===64||op===65)il=0;
      else if(op>=80&&op<=83)il=0;
      else throw 5;
      if(pc+1+il>p.length)throw 9;
      st++;
      const nx=pc+1+il;
      let f=0;
      if(op===48||op===49||op===50){f=p[pc+1]|p[pc+2]<<8;if(f>=32768)f-=65536;}
      switch(op){
        case 0:return [Buffer.from(o),0];
        case 1:room();s[sp++]=p[pc+1]<<24>>24;break;
        case 2:room();s[sp++]=p[pc+1]|p[pc+2]<<8|p[pc+3]<<16|p[pc+4]<<24;break;
        case 3:need(1);sp--;break;
        case 4:need(1);room();s[sp]=s[sp-1];sp++;break;
        case 5:need(2);{const t=s[sp-1];s[sp-1]=s[sp-2];s[sp-2]=t;}break;
        case 6:need(2);room();s[sp]=s[sp-2];sp++;break;
        case 7:need(3);{const t=s[sp-3];s[sp-3]=s[sp-2];s[sp-2]=s[sp-1];s[sp-1]=t;}break;
        case 23:need(1);s[sp-1]=-s[sp-1]|0;break;
        case 27:need(1);s[sp-1]=~s[sp-1];break;
        case 48:pc=nx+f;continue;
        case 49:need(1);if(s[--sp]===0){pc=nx+f;continue;}break;
        case 50:need(1);if(s[--sp]!==0){pc=nx+f;continue;}break;
        case 51:if(cp>=64)throw 7;c[cp++]=nx;pc=p[pc+1]|p[pc+2]<<8;continue;
        case 52:if(cp===0)throw 8;pc=c[--cp];continue;
        case 64:need(1);{const a=s[sp-1];if(a<0||a>255)throw 6;s[sp-1]=m[a];}break;
        case 65:need(2);{const a=s[--sp],v=s[--sp];if(a<0||a>255)throw 6;m[a]=v;}break;
        case 80:need(1);{const v=s[--sp],d=String(v);if(o.length+d.length>65536)throw 11;for(let k=0;k<d.length;k++)o.push(d.charCodeAt(k));}break;
        case 81:need(1);{const v=s[--sp];if(o.length>=65536)throw 11;o.push(v&255);}break;
        case 82:room();s[sp++]=ip<i.length?i[ip++]:-1;break;
        case 83:need(1);return [Buffer.from(o),s[--sp]&255];
        default:
          need(2);
          const b=s[--sp],a=s[sp-1];
          let r=0;
          if(op===16)r=(a+b)|0;
          else if(op===17)r=(a-b)|0;
          else if(op===18)r=Math.imul(a,b);
          else if(op===19){if(b===0)throw 4;r=Math.trunc(a/b)|0;}
          else if(op===20){if(b===0)throw 4;r=a%b|0;}
          else if(op===21){if(b===0)throw 4;r=(a>>>0)/(b>>>0)|0;}
          else if(op===22){if(b===0)throw 4;r=(a>>>0)%(b>>>0)|0;}
          else if(op===24)r=a&b;
          else if(op===25)r=a|b;
          else if(op===26)r=a^b;
          else if(op===28)r=a<<b;
          else if(op===29)r=a>>b;
          else if(op===30)r=a>>>b|0;
          else if(op===32)r=a===b?1:0;
          else if(op===33)r=a<b?1:0;
          else if(op===34)r=(a>>>0)<(b>>>0)?1:0;
          s[sp-1]=r;
      }
      pc=nx;
    }
  }catch(e){return [Buffer.from(o),e];}
}
for(const id of readdirSync(IR).sort()){
  try{
    const p=readFileSync(IR+"/"+id+"/program.bin");
    const i=readFileSync(IR+"/"+id+"/input.bin");
    const r=run(p,i);
    mkdirSync(OR+"/"+id,{recursive:true});
    writeFileSync(OR+"/"+id+"/stdout.bin",r[0]);
    writeFileSync(OR+"/"+id+"/exit.txt",String(r[1]));
  }catch(e){
    try{mkdirSync(OR+"/"+id,{recursive:true});writeFileSync(OR+"/"+id+"/stdout.bin",Buffer.alloc(0));writeFileSync(OR+"/"+id+"/exit.txt","0");}catch(_){}
  }
}
