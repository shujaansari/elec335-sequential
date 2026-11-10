(function(root){
'use strict';
const bin=(n,w)=>n.toString(2).padStart(w,'0');
const mod6=[1,2,3,4,5,0,0,0], arbitrary=[1,2,4,1,3,1,1,1], pattern=[1,0,1,1,0,0];
const mealyNext=[[0,1],[2,1],[0,1],[0,0]],mooreNext=[[0,1],[2,1],[0,3],[2,1]];
function detector(q,x,kind='mealy') {return {next:(kind==='moore'?mooreNext:mealyNext)[q][x],z:kind==='moore'?+(q===3):+(q===2&&x===1)};}
function detectorFrames(stream,kind='mealy',initial=0){
 let q=initial,m=initial===3&&kind==='mealy'?0:initial,frames=[];
 const snap=(phase,x,edge,event,bit,note)=>{const g=detector(q,x,kind);frames.push({phase,x,edge,event,bit,q,d:g.next,z:g.z,mooreZ:+(m===3),address:bin(q,2)+x,word:bin(g.next,2)+g.z,note});};
 snap('reset',0,0,'–',0,'Reset establishes the starting state. The combinational outputs are evaluated from the current state and input.');
 [...stream].forEach((c,i)=>{const x=+c,g=detector(q,x,kind),ev=+(q===2&&x===1);
  snap(`X${i+1} set`,x,0,'–',i+1,`Input ${x} is stable. State S${q} still holds. The logic prepares next state S${g.next} and raw Z=${g.z}.`);
  const old=q;q=g.next;m=mooreNext[m][x];
  snap(`edge ${i+1} ↑`,x,1,ev,i+1,`The edge stores S${q}. ${kind==='mealy'?`The pre-edge detection event is ${ev}. Raw Z now recomputes from the new state.`:`Moore Z is now ${+(q===3)} because the stored state ${q===3?'is':'is not'} S3.`} The transition was S${old} with X=${x}.`);
 });return frames;
}
function controller(q,start,last){return {next:q===0?(start?1:0):q===1?2:q===2?(last?3:2):0,load:+(q===1),shift:+(q===2),done:+(q===3)};}
function controllerFrames(word){let q=0,data=0,index=0,serial='',frames=[];
 function snap(phase,edge,start,note){const last=+(index===3),g=controller(q,start,last);frames.push({phase,edge,q,data,index,start,last,d:g.next,load:g.load,shift:g.shift,done:g.done,serial:serial||'–',address:bin(q,2)+start+last,word:bin(g.next,2)+g.load+g.shift+g.done,note});}
 snap('reset',0,0,'Controller IDLE, data 0000 and index 00. The first accepted start selects LOAD.');
 for(let edge=1;edge<=7;edge++){
  const start=+(edge===1),g=controller(q,start,+(index===3));
  snap('prepare '+edge,0,start,`Current state ${['IDLE','LOAD','SHIFT','DONE'][q]} prepares ${['IDLE','LOAD','SHIFT','DONE'][g.next]}. Controls load=${g.load}, shift=${g.shift}, done=${g.done} belong to the current interval.`);
  let action='State update only.';
  if(g.load){data=parseInt(word,2);index=0;serial='';action=`Load ${word} and reset index to 00.`;}
  if(g.shift){const bit=data&1;serial+=bit;data>>=1;index=(index+1)&3;action=`Emit old Q0=${bit}, shift right with zero fill and advance the index.`;}
  q=g.next;snap(`edge ${edge} ↑`,1,0,`${action} Stored controller is now ${['IDLE','LOAD','SHIFT','DONE'][q]}. Its Moore controls recompute after the edge.`);
 }return frames;
}
function universal(q,w,mode,sir,sil){return mode===0?q:mode===1?(sir<<3)|(q>>1):mode===2?((q<<1)&15)|sil:w;}
const term=(name,lits,outs)=>({name,lits,outs});
const products={
 xor:{title:'XOR and AND',inputs:['A','B'],outputs:['F','G'],terms:[term('P1','01',[0]),term('P2','10',[0]),term('P3','11',[1])]},
 counter:{title:'Synchronous MOD-6 D inputs',inputs:['Q2','Q1','Q0'],outputs:['D2','D1','D0'],terms:[term('P1','011',[0]),term('P2','100',[0]),term('P3','001',[1]),term('P4','010',[1]),term('P5','0–0',[2]),term('P6','–00',[2])]},
 mealy:{title:'Mealy 101 detector',inputs:['Q1','Q0','X'],outputs:['D1','D0','Z'],terms:[term('P1','010',[0]),term('P2','0–1',[1]),term('P3','101',[1,2])]},
 moore:{title:'Moore 101 detector',inputs:['Q1','Q0','X'],outputs:['D1','D0','Z'],terms:[term('P1','–10',[0]),term('P2','101',[0]),term('P3','––1',[1]),term('P4','11–',[2])]},
 hold:{title:'One PIPO register bit',inputs:['L','W','Q'],outputs:['D'],terms:[term('P1','11–',[0]),term('P2','0–1',[0])]},
 piso:{title:'One PISO register bit',inputs:['L','S','W','R','Q'],outputs:['D'],terms:[term('P1','1–1––',[0]),term('P2','01–1–',[0]),term('P3','00––1',[0])]},
 universal:{title:'One universal-register bit',inputs:['M1','M0','Q','R','L','W'],outputs:['D'],terms:[term('P1','001–––',[0]),term('P2','01–1––',[0]),term('P3','10––1–',[0]),term('P4','11–––1',[0])]},
 controller:{title:'ASM register controller',inputs:['Q1','Q0','start','last'],outputs:['D1','D0','load','shift','done'],terms:[term('P1','01––',[0,2]),term('P2','10––',[0,3]),term('P3','11––',[4]),term('P4','001–',[1]),term('P5','10–1',[1])]},
 clear:{title:'Active-low terminal clear',inputs:['Q2','Q1'],outputs:['CLR_n'],inverted:[0],terms:[term('P1','11',[0])]},
 clearSop:{title:'Non-inverting terminal-clear SOP',inputs:['Q2','Q1'],outputs:['CLR_n'],terms:[term('P1','0–',[0]),term('P2','–0',[0])]}
};
function evaluate(spec,inputs){const active=spec.terms.map(t=>[...t.lits].every((c,i)=>c==='–'||+c===+inputs[i]));const out=spec.outputs.map((_,j)=>+active.some((v,i)=>v&&spec.terms[i].outs.includes(j)));(spec.inverted||[]).forEach(j=>out[j]=1-out[j]);return {active,out};}
function literalExpression(spec,t){return [...t.lits].flatMap((c,i)=>c==='–'?[]:[spec.inputs[i]+(c==='0'?'′':'')]).join('·')||'1';}
const romSpecs={
 xor:{title:'XOR and AND',inputs:['A','B'],outputs:['F','G'],word:a=>`${((a>>1)&1)^(a&1)}${+((a&3)===3)}`},
 adder:{title:'Full adder',inputs:['A','B','Cin'],outputs:['S','Cout'],word:a=>{const n=(a>>2)+((a>>1)&1)+(a&1);return `${n&1}${+(n>=2)}`;}},
 hold:{title:'Load/hold register bit',inputs:['E','W','Q'],outputs:['D'],word:a=>String((a>>2)?((a>>1)&1):(a&1))},
 terminal:{title:'Ripple terminal decoder',inputs:['Q2','Q1','Q0'],outputs:['CLR_n'],word:a=>String(+(a<6))},
 counter:{title:'Synchronous MOD-6',inputs:['Q2','Q1','Q0'],outputs:['D2','D1','D0'],word:a=>bin(mod6[a],3)},
 arbitrary:{title:'Arbitrary word generator',inputs:['Q2','Q1','Q0'],outputs:['D2','D1','D0'],word:a=>bin(arbitrary[a],3)},
 pattern:{title:'Serial pattern 101100',inputs:['Q2','Q1','Q0'],outputs:['D2','D1','D0','Y'],word:a=>bin(mod6[a],3)+(a<6?pattern[a]:0)},
 mealy:{title:'Mealy 101 detector',inputs:['Q1','Q0','X'],outputs:['D1','D0','Z'],word:a=>{const g=detector(a>>1,a&1);return bin(g.next,2)+g.z;}},
 moore:{title:'Moore 101 detector',inputs:['Q1','Q0','X'],outputs:['D1','D0','Z'],word:a=>{const g=detector(a>>1,a&1,'moore');return bin(g.next,2)+g.z;}},
 controller:{title:'ASM controller',inputs:['Q1','Q0','start','last'],outputs:['D1','D0','load','shift','done'],word:a=>{const g=controller(a>>2,(a>>1)&1,a&1);return bin(g.next,2)+g.load+g.shift+g.done;}}
};
const romRows=s=>Array.from({length:2**s.inputs.length},(_,a)=>[bin(a,s.inputs.length),s.word(a)]);
function counterFrames(kind='counter',initial=0,cycles=7){let q=initial,frames=[],spec=romSpecs[kind];
 const snap=(phase,edge,note)=>{const word=spec.word(q);frames.push({phase,edge,q,d:parseInt(word.slice(0,3),2),address:bin(q,3),word,z:kind==='pattern'?+(word[3]):0,note});};
 snap('initial read',0,'Current Q addresses the ROM. Read D before applying the clock.');
 for(let i=0;i<cycles;i++){const old=q;snap(`prepare ${i+1}`,0,`Q=${bin(q,3)} selects word ${spec.word(q)}. The state still holds.`);q=parseInt(spec.word(q).slice(0,3),2);snap(`edge ${i+1} ↑`,1,`The edge stores ${bin(q,3)} from old state ${bin(old,3)}. The new address immediately starts a new ROM read.`);}return frames;
}
const rippleFrames=[
 {phase:'stable 101',q:5,clear:1,edge:0,note:'The settled count is 101. Q2Q1=10 keeps CLR_n inactive.'},
 {phase:'Q0 falls',q:4,clear:1,edge:1,note:'The external falling clock edge toggles Q0. Code 100 appears before the next stage responds.'},
 {phase:'Q1 rises',q:6,clear:1,edge:0,note:'Q0 falling clocks FF1. Q1 rises and creates the transient terminal code 110.'},
 {phase:'clear asserts',q:6,clear:0,edge:0,note:'After decoder delay, CLR_n falls. Every asynchronous clear pin now receives an active reset.'},
 {phase:'Q clears',q:0,clear:0,edge:0,note:'The flip-flops clear to 000. The decoder has not yet responded to the changed inputs.'},
 {phase:'clear releases',q:0,clear:1,edge:0,note:'The cleared Q2Q1 removes the terminal condition. CLR_n rises after decode delay. Its pulse width must satisfy every flip-flop.'}
];
const api={bin,mod6,arbitrary,pattern,mealyNext,mooreNext,detector,detectorFrames,controller,controllerFrames,universal,products,evaluate,literalExpression,romSpecs,romRows,counterFrames,rippleFrames};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FINAL_MODELS=api;
})(typeof window!=='undefined'?window:globalThis);
