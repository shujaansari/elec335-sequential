(function(){
'use strict';
const main=window.CIRCUIT_VISUALS.scenes;
const N=(id,label,type,x,y,sub='',key=id,w=112)=>({id,label,type,x,y,sub,key,w,h:64});
const E=(from,to)=>({from,to});
const S=(event,v,explain,edge=false)=>({event,v,explain,edge});
const find=(id,name)=>main[id].find(scene=>scene.name===name);
const use=(scene,changes={})=>({...scene,...changes});

const dff=find('01','D flip-flop');
const jk=find('01','JK flip-flop');
const analysis=main['02'][0];
const mod6=main['03'][0];
const ripple=find('04','Ripple path: 011 to 100');
const rippleWrap=find('04','MOD-6 wrap: 101 to 000');
const simpleSr=find('01','Simple active-high SR latch');
const gatedSr=find('01','Gated SR latch');
const shift=find('05','Four-stage shift register');
const johnson=find('05','Johnson counter');
const detector=main['06'][0];
const reduced=main['08'][0];
const transmitter=main['10'][0];

const bitScene=(name,samples)=>({
  name,lead:'The present bit Q and desired next bit Q⁺ determine which flip-flop inputs are required.',
  formula:'D=Q⁺; T=Q⊕Q⁺; for 1→0, JK requires K=1 while J is free',
  nodes:[N('q','present Q','input',20,20,'','Q',140),N('target','target Q⁺','input',20,120,'','TARGET',140),N('xor','XOR','xor',290,45,'T=Q⊕Q⁺','T',145),N('tout','T','output',650,45,'','T'),N('dout','D=Q⁺','output',650,145,'','D',140),N('qk','Q','input',240,175,'','Q'),N('target2','target Q⁺','input',20,260,'','TARGET',140),N('not','NOT','not',250,260,'¬Q⁺','nTARGET'),N('andk','AND','and',500,225,'K=Q·¬Q⁺','K',145),N('kout','K','output',740,225,'','K')],
  edges:[E('q','xor'),E('target','xor'),E('xor','tout'),E('target','dout'),E('target2','not'),E('qk','andk'),E('not','andk'),E('andk','kout')],height:350,
  rows:[['present Q','Q'],['target Q⁺','TARGET'],['D','D'],['T','T'],['K','K']],samples,
  note:'The JK excitation entry J is a don’t-care when the present state is Q=1. The timing trace shows a requested transition, then its clock edge.'
});

const moore={
  name:'Moore toggle machine',lead:'X and Q pass through XOR to the D input. The Moore output is the stored state bit Q itself.',
  formula:'D=X⊕Q; Q⁺=D at clock ↑; Z=Q',
  nodes:[N('x','X','input',20,35,'','X'),N('qfb','Q feedback','input',20,170,'','Q',145),N('xor','XOR','xor',305,90,'D','D',145),N('ff','D flip-flop','ff',645,90,'Moore Z=Q','Q',165)],
  edges:[E('x','xor'),E('qfb','xor'),E('xor','ff')],height:270,
  rows:[['X','X'],['D','D'],['Q / Moore Z','Q']],
  samples:[S('S₀',{X:0,Q:0,D:0},'State S₀ has Moore output Z=0.'),S('X←1',{X:1,Q:0,D:1},'X=1 prepares a toggle.'),S('clock ↑',{X:1,Q:1,D:0},'The machine enters S₁; Z becomes 1 after the edge.',true),S('X←0',{X:0,Q:1,D:1},'X=0 prepares a hold.'),S('clock ↑',{X:0,Q:1,D:1},'State and output remain 1.',true),S('X←1',{X:1,Q:1,D:0},'X=1 prepares another toggle.'),S('clock ↑',{X:1,Q:0,D:1},'The machine returns to S₀; Z becomes 0.',true)]
};

const detectorValues=(x,q)=>({X:x,Q:q,Q0:+q[1],Q1:+q[0],nX:1-x,D1:(+q[1])*(1-x),D0:x,Z:(+q[0])*x});
const detectorTrace=use(detector,{name:'Detect overlapping 101 in 10101',samples:[
  S('reset',detectorValues(0,'00'),'S₀ stores no useful suffix.'),
  S('1',detectorValues(1,'00'),'The first 1 prepares S₁.'),
  S('clock ↑',detectorValues(1,'01'),'Store suffix 1.',true),
  S('0',detectorValues(0,'01'),'Input 0 prepares S₂.'),
  S('clock ↑',detectorValues(0,'10'),'Store suffix 10.',true),
  S('1',detectorValues(1,'10'),'First 101 detected: Z=1 before the edge.'),
  S('clock ↑',detectorValues(1,'01'),'Retain suffix 1 for overlap.',true),
  S('0',detectorValues(0,'01'),'The next 0 prepares S₂ again.'),
  S('clock ↑',detectorValues(0,'10'),'Store suffix 10 again.',true),
  S('1',detectorValues(1,'10'),'Second 101 detected: Z=1.',false),
  S('clock ↑',detectorValues(1,'01'),'Retain suffix 1 again.',true)
]});

const encoding5={
  name:'Five-state encoding and S₄ decode',lead:'Binary uses three state flip-flops and a decode gate for S₄. One-hot uses five flip-flops and its S₄ bit directly.',
  formula:'Binary S₄ detector=B₂·B̅₁·B̅₀; one-hot S₄ detector=Q₄',
  nodes:[N('b2','B₂','input',20,20,'','B2'),N('nb1','B̅₁','input',20,105,'','nB1'),N('nb0','B̅₀','input',20,190,'','nB0'),N('and','AND','and',320,98,'binary S₄','DETECT',160),N('oh','one-hot Q₄','input',610,98,'direct state bit','OH4',170)],
  edges:[E('b2','and'),E('nb1','and'),E('nb0','and')],height:275,
  rows:[['state','STATE'],['binary code','BIN'],['one-hot code','ONE'],['S₄ active','DETECT']],
  samples:Array.from({length:5},(_,i)=>{const binary=i.toString(2).padStart(3,'0'),one=(1<<i).toString(2).padStart(5,'0');return S(`S${i}`,{STATE:`S${i}`,BIN:binary,ONE:one,B2:+binary[0],nB1:1-(+binary[1]),nB0:1-(+binary[2]),OH4:+(i===4),DETECT:+(i===4)},`S${i} uses ${binary} in binary or ${one} in one-hot.`)}),
  note:'The successive labels illustrate code assignments only; the prompt does not specify state transitions or their timing.'
};

const comparison={
  name:'Compare future outputs',lead:'Apply the same input to two candidate states. An XOR of their observable outputs reveals a distinguishing sequence.',
  formula:'Different = Z₁ ⊕ Z₂; states can merge only if Different stays 0 for every future input sequence',
  nodes:[N('pair','candidate pair','input',20,92,'','PAIR',160),N('z1','output Z₁','input',270,25,'','Z1',145),N('z2','output Z₂','input',270,180,'','Z2',145),N('xor','XOR','xor',575,95,'different?','DIFF',160)],
  edges:[E('z1','xor'),E('z2','xor')],height:280,
  rows:[['pair','PAIR'],['input X','X'],['first output','Z1'],['second output','Z2'],['different','DIFF']],
  samples:[S('B,C',{PAIR:'B,C',X:0,Z1:0,Z2:0,DIFF:0},'B and C initially have the same Moore output.'),S('X=0',{PAIR:'B,C',X:0,Z1:0,Z2:0,DIFF:0},'Their successors remain in the same output class.'),S('X=1',{PAIR:'B,C',X:1,Z1:1,Z2:1,DIFF:0},'Both move to D; their outputs remain equal.'),S('A,B',{PAIR:'A,B',X:0,Z1:0,Z2:0,DIFF:0},'A and B also start with equal output.'),S('X=1',{PAIR:'A,B',X:1,Z1:0,Z2:1,DIFF:1},'A→C (output 0), B→D (output 1): distinguishable.')],
  note:'Columns show successive comparison cases, not clock cycles of one physical machine.'
};

const controllerRom={
  name:'16×5 controller ROM',lead:'Two state bits plus start and last form four address bits. The ROM returns next state and three control actions.',
  formula:'4 address bits → 2⁴=16 words; 2 next-state bits + 3 actions = 5 bits/word; total 80 bits',
  nodes:[N('addr','state/start/last','input',20,105,'4-bit address','ADDR',190),N('decode','AND decode','logic',305,105,'one of 16 rows','ROW',165),N('rom','ROM 16×5','rom',585,105,'stored word','WORD',180)],
  edges:[E('addr','decode'),E('decode','rom')],height:275,
  rows:[['address','ADDR'],['next state','NEXT'],['load','LOAD'],['shift','SHIFT'],['done','DONE']],
  samples:[S('IDLE wait',{ADDR:'0000',ROW:'0',WORD:'00000',NEXT:'00',LOAD:0,SHIFT:0,DONE:0},'IDLE with start=0 stays IDLE.'),S('start=1',{ADDR:'0010',ROW:'2',WORD:'01000',NEXT:'01',LOAD:0,SHIFT:0,DONE:0},'IDLE with start=1 prepares LOAD.'),S('LOAD',{ADDR:'0100',ROW:'4',WORD:'10100',NEXT:'10',LOAD:1,SHIFT:0,DONE:0},'LOAD captures data and prepares SHIFT.'),S('SHIFT',{ADDR:'1000',ROW:'8',WORD:'10010',NEXT:'10',LOAD:0,SHIFT:1,DONE:0},'SHIFT with last=0 remains SHIFT.'),S('last=1',{ADDR:'1001',ROW:'9',WORD:'11010',NEXT:'11',LOAD:0,SHIFT:1,DONE:0},'The final SHIFT prepares DONE.'),S('DONE',{ADDR:'1100',ROW:'12',WORD:'00001',NEXT:'00',LOAD:0,SHIFT:0,DONE:1},'DONE pulses, then returns to IDLE.')],
  note:'The shown contents are one consistent illustrative state assignment. All sixteen addresses, including unused conditions, need a defined word.'
};

window.EXAMPLE_VISUALS={
  '01':[
    [use(simpleSr,{name:'Set, hold, then reset'})],
    [use(gatedSr,{name:'Enable controls when set and reset act'})],
    [use(dff,{name:'D trace: 1, 0, 1 at three edges',samples:[S('Q=0',{D:0,Q:0},'Initial state Q=0.'),S('D←1',{D:1,Q:0},'D=1 waits at the input.'),S('edge 1 ↑',{D:1,Q:1},'Edge 1 stores 1.',true),S('D←0',{D:0,Q:1},'Q holds 1 between edges.'),S('edge 2 ↑',{D:0,Q:0},'Edge 2 stores 0.',true),S('D←1',{D:1,Q:0},'D returns to 1 before edge 3.'),S('edge 3 ↑',{D:1,Q:1},'Edge 3 stores 1.',true)]})],
    [use(jk,{name:'JK reset from Q=1',samples:[S('given',{J:0,K:1,Q:1,nQ:0,nK:0,p1:0,p2:0,D:0},'J=0, K=1 requests reset; both AND terms are 0.'),S('clock ↑',{J:0,K:1,Q:0,nQ:1,nK:0,p1:0,p2:0,D:0},'The edge stores D=0, so Q⁺=0.',true),S('hold',{J:0,K:0,Q:0,nQ:1,nK:1,p1:0,p2:0,D:0},'With JK=00, the new Q=0 holds.') ]})]
  ],
  '02':[[use(analysis,{name:'Analyze D=X⊕Q and Z=XQ'})],[moore]],
  '03':[[use(mod6,{name:'Design and trace the mod-6 D counter'})],[bitScene('Excitation for 1→0',[S('Q=1',{Q:1,TARGET:1,D:1,T:0,K:0,nTARGET:0},'Initially the bit holds at 1.'),S('target 0',{Q:1,TARGET:0,D:0,T:1,K:1,nTARGET:1},'The requested 1→0 transition needs D=0, T=1, K=1.'),S('clock ↑',{Q:0,TARGET:0,D:0,T:0,K:0,nTARGET:1},'After the edge, Q=0. The original 1→0 request has been completed.',true)])]],
  '04':[[use(ripple,{name:'Worked trace: 011 → 100'})],[use(rippleWrap,{name:'Worked trace: 101 → 000 via clear'})]],
  '05':[[use(shift,{name:'SIPO input 1,0,1,1',samples:[S('reset',{IN:0,Q:'0000',Q3:0,Q2:0,Q1:0,Q0:0},'Start with 0000.'),S('1 ↑',{IN:1,Q:'1000',Q3:1,Q2:0,Q1:0,Q0:0},'Enter 1: 1000.',true),S('0 ↑',{IN:0,Q:'0100',Q3:0,Q2:1,Q1:0,Q0:0},'Enter 0: 0100.',true),S('1 ↑',{IN:1,Q:'1010',Q3:1,Q2:0,Q1:1,Q0:0},'Enter 1: 1010.',true),S('1 ↑',{IN:1,Q:'1101',Q3:1,Q2:1,Q1:0,Q0:1},'Enter 1: 1101.',true)]})],[use(johnson,{name:'Eight-state Johnson cycle'})]],
  '06':[[detectorTrace],[encoding5]],
  '07':[[use(main['07'][0],{name:'ROM: four stored words'}),use(main['07'][1],{name:'PLA: three product terms'})],[use(main['07'][2],{name:'PAL fixed OR allocation'})]],
  '08':[[use(comparison,{name:'Implication check: merge B and C'})],[use(comparison,{name:'A and B are distinguishable',samples:[S('A,B',{PAIR:'A,B',X:0,Z1:0,Z2:0,DIFF:0},'Both present outputs are 0.'),S('apply X=1',{PAIR:'A,B',X:1,Z1:0,Z2:0,DIFF:0},'A moves to C while B moves to D.'),S('next interval',{PAIR:'C,D',X:1,Z1:0,Z2:1,DIFF:1},'C outputs 0, D outputs 1; XOR proves the pair differs.') ]})]],
  '09':[[use(comparison,{name:'Partition refinement by successor behavior'})],[use(main['09'][0],{name:'Binary assignment: two flip-flops'}),use(main['09'][1],{name:'One-hot assignment: three flip-flops'})]],
  '10':[[use(transmitter,{name:'Transmit 1011 as 1101'})],[controllerRom]]
};
})();
