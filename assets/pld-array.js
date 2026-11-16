(function(root){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(spec,input,{arch='pla',budget=2}={}){
 const active=spec.terms.map(t=>[...t.lits].every((v,i)=>v==='–'||v==='-'||+v===+input[i]));
 const counts=spec.outputs.map((_,j)=>spec.terms.filter(t=>t.outs.includes(j)).length);
 const target=spec.outputs.map((_,j)=>+(spec.terms.some((t,i)=>active[i]&&t.outs.includes(j))));
 (spec.inverted||[]).forEach(j=>target[j]=1-target[j]);
 const fits=arch==='pla'||counts.every(n=>n<=budget), rows=[];
 if(arch==='pla')spec.terms.forEach((t,i)=>rows.push({name:t.name,lits:t.lits,outs:t.outs,active:active[i],term:i,disabled:false}));
 else spec.outputs.forEach((out,j)=>{
  const assigned=spec.terms.map((t,i)=>({...t,term:i})).filter(t=>t.outs.includes(j));
  assigned.slice(0,budget).forEach(t=>rows.push({name:t.name+'@'+out,lits:t.lits,outs:[j],active:active[t.term],term:t.term,disabled:false,group:j}));
  const unused=budget-Math.min(budget,assigned.length);
  if(unused)rows.push({name:unused===1?'spare=0':unused+' spare=0',lits:'–'.repeat(spec.inputs.length),outs:[j],active:false,disabled:true,slots:unused,group:j});
 });
 return {active,counts,target,fits,rows,output:fits?target:null,overflow:counts.map(n=>Math.max(0,n-budget)),used:counts.reduce((a,b)=>a+b,0)};
}
function layout(spec,input,options={}){
 const {arch='pla',budget=2,stage=2,symbol='dot'}=options,r=read(spec,input,{arch,budget}),e=[];
 const n=spec.inputs.length,m=spec.outputs.length,start=110,dx=n>4?62:64,andX=Math.max(560,start+(2*n-1)*dx+54),orStart=andX+170,orGap=100;
 const W=Math.max(1160,orStart+(m-1)*orGap+120),pitch=options.compact?32:44,top=options.compact?96:116,last=top+(r.rows.length-1)*pitch,gateY=last+(options.compact?54:72),H=gateY+(options.compact?84:98);
 const col={ink:'#b7cdd9',text:'#edf5fa',muted:'#9ab2c2',hot:'#f9c56b',and:'#172d40',or:'#1b283b',fixed:'#9fb6c6',bad:'#ff9c9c'};
 const ln=(x1,y1,x2,y2,hot=false,kind='wire')=>e.push({type:'line',x1,y1,x2,y2,color:hot?col.hot:col.ink,width:hot?3:1.5,kind});
 const txt=(x,y,text,size=18,align='left',color=col.text,bold=false)=>e.push({type:'text',x,y,text:String(text),size,align,color,bold});
 const mark=(x,y,hot,fixed=false)=>e.push({type:fixed||symbol==='cross'?'cross':'circle',x,y,r:4.5,color:hot?col.hot:fixed?col.fixed:col.text,fixed});
 const path=(cmd,hot=false)=>e.push({type:'path',commands:cmd,color:hot?col.hot:col.ink,fill:'#0d1b2b',width:2});
 e.push({type:'rect',x:start-26,y:34,w:andX-start+108,h:last-8,fill:col.and});
 e.push({type:'rect',x:orStart-35,y:34,w:(m-1)*orGap+76,h:last-8,fill:col.or});
 txt((start+andX)/2,21,'PROGRAMMABLE AND PLANE',21,'center',col.text,true);
 txt(orStart+(m-1)*orGap/2,21,arch==='pla'?'PROGRAMMABLE OR':'FIXED OR GROUPS',21,'center',col.text,true);
 spec.inputs.forEach((v,i)=>[1,0].forEach((pol,k)=>{const x=start+(2*i+k)*dx,val=pol?+input[i]:1-(+input[i]);ln(x,86,x,last+20,!!val);txt(x,57,v+(pol?'':'′'),19,'center',col.text,true);txt(x,80,val,16,'center',val?col.hot:col.muted);}));
 const outputActive=j=>stage>=2&&r.fits&&!!r.target[j];
 const sumActive=j=>stage>=2&&r.fits&&r.rows.some(t=>t.active&&t.outs.includes(j));
 spec.outputs.forEach((v,j)=>ln(orStart+j*orGap,95,orStart+j*orGap,gateY-19,sumActive(j)));
 r.rows.forEach((row,i)=>{
  const y=top+i*pitch,hot=stage>=1&&row.active;
  if(arch==='pal'&&(i===0||row.group!==r.rows[i-1].group))e.push({type:'line',x1:5,y1:y-20,x2:W-10,y2:y-20,color:'#496070',width:1,kind:'separator'});
  txt(8,y+6,row.name,17,'left',row.disabled?col.muted:hot?col.hot:col.text,true);
  ln(start-15,y,andX,y,hot);
  if(!row.disabled)[...row.lits].forEach((v,j)=>{if(v==='0'||v==='1')mark(start+(2*j+(v==='1'?0:1))*dx,y,stage>=1&&(v==='1'?input[j]:!input[j]));});
  path([{moveTo:{x:andX,y:y-13}},{lineTo:{x:andX+26,y:y-13}},{cubicBezTo:{x1:andX+51,y1:y-13,x2:andX+51,y2:y+13,x:andX+26,y:y+13}},{lineTo:{x:andX,y:y+13}},{close:{}}],hot);
  ln(andX+45,y,orStart+(m-1)*orGap+34,y,hot);
  row.outs.forEach(j=>mark(orStart+j*orGap,y,stage>=2&&row.active,arch==='pal'));
  txt(andX+63,y-6,stage>=1?+row.active:'?',16,'center',hot?col.hot:col.muted);
 });
 spec.outputs.forEach((v,j)=>{const x=orStart+j*orGap,hot=sumActive(j),outHot=outputActive(j);
  path([{moveTo:{x:x-26,y:gateY-23}},{cubicBezTo:{x1:x-23,y1:gateY-1,x2:x-15,y2:gateY+16,x,y:gateY+29}},{cubicBezTo:{x1:x+15,y1:gateY+16,x2:x+23,y2:gateY-1,x:x+26,y:gateY-23}},{cubicBezTo:{x1:x+8,y1:gateY-12,x2:x-8,y2:gateY-12,x:x-26,y:gateY-23}},{close:{}}],hot);
  let yy=gateY+29;if(spec.inverted?.includes(j)){e.push({type:'bubble',x,y:yy+5,r:5,color:col.ink});yy+=10;}ln(x,yy,x,gateY+53,outHot);
  txt(x,gateY+78,v+' = '+(stage<2?'?':r.fits?r.target[j]:'—'),19,'center',!r.fits?col.bad:outHot?col.hot:col.text,true);
 });
 return {width:W,height:H,elements:e,read:r,arch,budget,stage,symbol};
}
function render(spec,input,options={}){const s=layout(spec,input,options);return `<svg xmlns="http://www.w3.org/2000/svg" class="pld-array lesson-diagram" viewBox="0 0 ${s.width} ${s.height}" role="img" aria-label="${esc(s.arch.toUpperCase()+' programmed AND OR array for '+spec.title)}"><title>${esc(spec.title)}: programmable AND plane; ${s.arch==='pla'?'programmable OR connections':'fixed local OR connections'}</title>${s.elements.map(e=>{
 if(e.type==='line')return `<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" stroke="${e.color}" stroke-width="${e.width}"/>`;
 if(e.type==='rect')return `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="5" fill="${e.fill}"/>`;
 if(e.type==='text')return `<text x="${e.x}" y="${e.y}" style="font-size:${e.size}px;font-weight:${e.bold?700:400};fill:${e.color}" text-anchor="${e.align==='center'?'middle':e.align==='right'?'end':'start'}">${esc(e.text)}</text>`;
 if(e.type==='circle'||e.type==='bubble')return `<circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="${e.type==='bubble'?'#0d1b2b':e.color}" stroke="${e.color}" stroke-width="2" data-connection="${e.type==='circle'?'programmable':'inversion'}"/>`;
 if(e.type==='cross')return `<path d="M${e.x-5} ${e.y-5} l10 10 M${e.x-5} ${e.y+5} l10 -10" fill="none" stroke="${e.color}" stroke-width="2.2" data-connection="${e.fixed?'fixed':'programmable'}"/>`;
 const d=e.commands.map(c=>c.moveTo?`M${c.moveTo.x} ${c.moveTo.y}`:c.lineTo?`L${c.lineTo.x} ${c.lineTo.y}`:c.cubicBezTo?`C${c.cubicBezTo.x1} ${c.cubicBezTo.y1} ${c.cubicBezTo.x2} ${c.cubicBezTo.y2} ${c.cubicBezTo.x} ${c.cubicBezTo.y}`:'Z').join(' ');return `<path d="${d}" stroke="${e.color}" fill="${e.fill}" stroke-width="${e.width}"/>`;
 }).join('')}</svg>`;}
const api={read,layout,render};if(typeof module!=='undefined')module.exports=api;root.PLD_ARRAY=api;
})(typeof window!=='undefined'?window:globalThis);
