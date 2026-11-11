(function(root){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bin=(n,w)=>n.toString(2).padStart(w,'0');
function read(spec,address){
 const rows=2**spec.inputs.length,columns=spec.outputs.length;
 if(!Number.isInteger(address)||address<0||address>=rows)throw new RangeError('Address is outside this ROM.');
 const words=Array.from({length:rows},(_,a)=>String(spec.word(a)));
 if(words.some(w=>!new RegExp('^[01]{'+columns+'}$').test(w)))throw new Error('Every ROM address needs a complete binary word.');
 const minterms=spec.outputs.map((_,j)=>words.flatMap((w,a)=>w[j]==='1'?[a]:[]));
 const values=minterms.map(list=>+list.includes(address));
 return {rows,columns,address,addressBits:bin(address,spec.inputs.length),words,minterms,values,word:values.join(''),connections:words.flatMap((w,r)=>[...w].flatMap((v,c)=>v==='1'?[{row:r,column:c}]:[]))};
}
const text=(x,y,value,cls='',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(value)}</text>`;
const line=(d,cls='')=>`<path d="${d}" class="ra-line ${cls}"/>`;
const cross=(x,y,cls='')=>`<path d="M${x-4} ${y-4} l8 8 M${x-4} ${y+4} l8 -8" class="ra-mark ${cls}"/>`;
function render(spec,address,options={}){
 const data=read(spec,address),stage=options.stage??3,expanded=!!options.expanded,symbol=options.symbol||'dot',n=spec.inputs.length;
 const width=expanded?1480:1160,top=100,pitch=data.rows<=4?60:34,last=top+(data.rows-1)*pitch,gateY=last+100,height=gateY+160;
 const dx=expanded?470:145,dw=expanded?60:215,rowStart=expanded?530:360,gridLeft=expanded?665:475,gridRight=width-40;
 const cols=spec.outputs.map((_,j)=>gridLeft+(gridRight-gridLeft)*(j+.5)/data.columns);
 const rowOn=stage>=1,colOn=j=>stage>=2&&data.values[j]===1,outputOn=j=>stage>=3&&data.values[j]===1;
 let body=`<title>${esc(spec.title)}: fixed decoder and programmed OR array</title><desc>Address ${data.addressBits}. Decoder row m${address} is selected. Stored output order ${esc(spec.outputs.join(', '))}. Word ${data.word}. Only marked crossings are programmed connections.</desc>`;
 body+=text(expanded?75:145,24,expanded?'Fixed AND plane: all address minterms':'Fixed decoder', 'ra-heading')+text(gridLeft,24,'Programmed OR plane','ra-heading');
 body+=`<rect class="ra-row-band" x="${expanded?62:dx+3}" y="${top+address*pitch-13}" width="${width-(expanded?100:dx+42)}" height="26" opacity="${rowOn?1:0}"/>`;
 if(expanded){
  const railPitch=Math.min(43,(dx-95)/(2*n-1));
  spec.inputs.forEach((name,i)=>[false,true].forEach((neg,k)=>{const x=82+(2*i+k)*railPitch,v=+(data.addressBits[i]);const val=neg?1-v:v;body+=text(x,46,name+(neg?'′':''),'ra-rail-label','middle')+text(x,68,val,'ra-small','middle')+line(`M${x} 77 V${last+20}`,val?'ra-input-high':'');}));
  for(let r=0;r<data.rows;r++){
   const y=top+r*pitch,active=rowOn&&r===address,bits=bin(r,n);
   body+=line(`M62 ${y} H${dx}`,active?'ra-active':'');
   [...bits].forEach((b,i)=>{const x=82+(2*i+(b==='1'?0:1))*railPitch;body+=cross(x,y,'ra-fixed'+(active?' ra-selected':''));});
   body+=`<path class="ra-gate ${active?'ra-active-gate':''}" d="M${dx} ${y-12} H${dx+27} A12 12 0 0 1 ${dx+27} ${y+12} H${dx} Z"/>`;
   body+=text(dx+15,y+5,'&','ra-small','middle')+line(`M${dx+39} ${y} H${gridRight}`,active?'ra-active':'')+text(dx+50,y-5,'m'+r,'ra-small');
  }
 }else{
  body+=`<rect class="ra-decoder" x="${dx}" y="${top-30}" width="${dw}" height="${last-top+60}"/>`;
  const cy=(top+last)/2;
  body+=text(dx+90,cy-18,`${n}-to-${data.rows}`,'ra-decoder-label','middle')+text(dx+90,cy+9,'decoder','ra-decoder-label','middle')+text(dx+90,cy+35,'fixed AND','ra-small','middle');
  spec.inputs.forEach((name,i)=>{const y=cy+(i-(n-1)/2)*35;body+=text(17,y+5,`${name}=${data.addressBits[i]}`,'ra-input-label')+line(`M94 ${y} H${dx}`,'ra-address-wire');});
  for(let r=0;r<data.rows;r++){const y=top+r*pitch,active=rowOn&&r===address;body+=line(`M${rowStart} ${y} H${gridRight}`,active?'ra-active':'')+text(dx+dw-12,y+5,'m'+r,`ra-small ${active?'ra-hot-text':''}`,'end');}
 }
 // A column is the standard bundled-input notation for one OR gate.
 // It is not a single wire that electrically shorts the decoder outputs.
 cols.forEach((x,j)=>{body+=text(x,56,spec.outputs[j],'ra-heading','middle')+line(`M${x} ${top-20} V${gateY-24}`);if(colOn(j))body+=line(`M${x} ${top+address*pitch} V${gateY-24}`,'ra-active');});
 data.connections.forEach(({row,column})=>{const x=cols[column],y=top+row*pitch,active=stage>=2&&row===address;body+=`<g class="ra-connection ${active?'ra-selected':''}" data-row="${row}" data-column="${column}"><title>m${row} connects to ${esc(spec.outputs[column])}: stored bit 1</title>${symbol==='cross'?cross(x,y):`<circle cx="${x}" cy="${y}" r="5.5"/>`}</g>`;});
 cols.forEach((x,j)=>{
  const active=outputOn(j);body+=`<g transform="translate(${x},${gateY}) rotate(90)"><path class="ra-gate ${active?'ra-active-gate':''}" d="M-38 -38 Q0 -38 38 0 Q0 38 -38 38 Q-15 0 -38 -38 Z"/></g>`+text(x,gateY+6,'OR','ra-small','middle');
  body+=line(`M${x} ${gateY+38} V${gateY+66}`,active?'ra-active':'')+`<rect class="ra-value ${active?'ra-value-high':''}" x="${x-24}" y="${gateY+66}" width="48" height="34" rx="4"/>`+text(x,gateY+90,stage>=3?data.values[j]:'?','ra-value-text','middle')+text(x,gateY+128,spec.outputs[j],'ra-heading','middle');
 });
 body+=text(dx,gateY+25,`${data.rows} words × ${data.columns} bits`,'ra-small')+text(dx,gateY+50,rowOn?`Selected m${address} (${data.addressBits})`:`Address ${data.addressBits}; decode next`,'ra-small');
 return `<svg xmlns="http://www.w3.org/2000/svg" class="rom-array-svg ${expanded?'ra-expanded':''}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(spec.title)} ROM decoder and programmed OR matrix" data-address="${address}" data-stage="${stage}" data-expanded="${expanded}">${body}</svg>`;
}
const api={read,render};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ROM_ARRAY=api;
})(typeof window!=='undefined'?window:globalThis);
