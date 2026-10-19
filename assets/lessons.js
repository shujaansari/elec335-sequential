window.LESSONS = [
  {
    id:'01', title:'State, latches and flip-flops', short:'State and storage', reading:'Ch. 6 §§6.1–6.3, pp. 365–380', clo:'Flip-flops and sequential behavior', time:'50 min',
    question:'When does stored information change?',
    outcomes:['Explain how the simple and gated SR latches store a bit','Separate present state Q from next state Q⁺','Compare a transparent latch with an edge-triggered flip-flop','Apply D, T, JK and SR characteristic rules'],
    concepts:[
      ['Start with the SR latch','Two cross-coupled NOR gates provide feedback. For the active-high latch, S=1 sets Q, R=1 resets Q, and S=R=0 holds the stored value. S=R=1 is forbidden. No clock is required.'],
      ['Add an enable gate','The gated SR latch forms Sg=E·S and Rg=E·R. E=0 blocks both controls and holds Q. E=1 passes a valid set or reset request immediately; E is a level, not an edge.'],
      ['From latch to flip-flop','A D latch follows D while its enable is active. A D flip-flop samples D only at its active clock edge, so Q stays fixed between edges. Q is present state; Q⁺ is the state after the controlling event.'],
      ['Other flip-flop inputs','D means data: Q⁺=D. T means toggle: Q⁺=Q⊕T. JK means set/reset with JK=11 toggling: Q⁺=JQ′+K′Q. Always state the device and active edge.']
    ],
    table:{heads:['Device','Control','When Q changes','Behavior'],rows:[['Simple NOR SR latch','S,R','Immediately when a valid input changes','00 hold; 10 set; 01 reset; 11 forbidden'],['Gated SR latch','E,S,R','While E=1 and a valid S/R request is present','E=0 hold; E=1 follows SR rule'],['D latch','E,D','While E=1','Q follows D; E=0 holds'],['D flip-flop','clock ↑, D','At the rising edge','Q⁺=D'],['T flip-flop','clock ↑, T','At the rising edge','Q⁺=Q⊕T'],['JK flip-flop','clock ↑, J,K','At the rising edge','00 hold; 01 reset; 10 set; 11 toggle'],['Clocked SR flip-flop','clock ↑, S,R','At the rising edge','00 hold; 10 set; 01 reset; 11 forbidden']]},
    widgets:[{type:'srlatch',title:'Simple SR latch laboratory',caption:'Try set, reset and hold without a clock. The active-high S=R=1 input is forbidden.'},{type:'gatedsrlatch',title:'Gated SR latch laboratory',caption:'Keep E=0 while changing S or R, then enable the latch. Notice that Q responds during the active level.'},{type:'flipflop',title:'Clock-edge laboratory',caption:'Now compare D, T, JK and clocked SR flip-flops. Their stored Q changes only at the selected edge.'}],
    worked:[
      {title:'Trace a simple SR latch',prompt:'Initially Q=0. Pulse S=1, release S, then pulse R=1 and release R. Find Q after each input event.',steps:['S=1, R=0 sets Q immediately to 1.','S=R=0 holds Q at 1 after S is released.','S=0, R=1 resets Q immediately to 0.','S=R=0 holds Q at 0 after R is released.'],answer:'The Q trace is 0 → 1 → 1 → 0 → 0. No clock edge is involved.'},
      {title:'Trace a gated SR latch',prompt:'Initially Q=0 and E=0. Set S=1, then E=1. Disable E, change to R=1, then enable E again. Find Q throughout.',steps:['With E=0, Sg=Rg=0; S=1 alone cannot change Q.','E=1 makes Sg=1 and sets Q to 1 immediately.','E=0 masks the inputs; changing from S to R leaves Q at 1.','E=1 makes Rg=1 and resets Q to 0 immediately.'],answer:'Q remains 0 until the first enable, holds 1 while disabled, and resets to 0 at the second enable.'},
      {title:'Trace a D flip-flop',prompt:'Initially Q=0. D is 1 before edge 1, changes to 0 after that edge, and returns to 1 before edge 3. Find Q after three rising edges.',steps:['At edge 1, D=1, so Q⁺=1.','At edge 2, D=0, so Q⁺=0.','At edge 3, D=1, so Q⁺=1.','Between edges Q holds, even when D changes.'],answer:'The sequence after the edges is 1, 0, 1.'},
      {title:'Use a characteristic equation',prompt:'A JK flip-flop has Q=1, J=0 and K=1. Determine Q⁺.',steps:['The control pair JK=01 requests reset.','Substitute into Q⁺=JQ′+K′Q.','Q⁺=0·0+0·1=0.'],answer:'Q⁺=0.'}
    ],
    practice:[
      {q:'A T flip-flop has Q=1 and T=1. What is Q⁺?',hint:'T=1 requests a toggle.',a:'Q⁺=Q⊕T=1⊕1=0.'},
      {q:'A D latch has enable=1. D changes 0→1 before enable falls. What is Q just before enable falls?',hint:'The latch is transparent during the active level.',a:'Q=1, assuming D has settled. After enable falls, the latch holds 1.'}
    ],
    transfer:['Identify the storage device, active level or edge, and initial state.','Mark the input value at every controlling event before computing Q⁺.','Use the characteristic rule one event at a time, then draw the held intervals.'],
    pitfalls:['A clock edge is an event, not the entire high portion of a waveform.','The basic SR invalid condition depends on the latch polarity. State the polarity before using its table.'],
    teach:['Begin with the two NOR feedback equations and step through set, hold and reset before adding E.','With E=0, change S and R in the gated laboratory; ask students to predict whether Q moves.','Then compare the D latch with an edge-triggered D flip-flop and change D between edges.','Switch between D, T and JK modes. Ask for Q⁺ before each clock.']
  },
  {
    id:'02', title:'Sequential circuit analysis', short:'Analysis and diagrams', reading:'Ch. 6 §6.4, pp. 380–390', clo:'State tables and diagrams', time:'50 min',
    question:'How can a circuit be converted into a complete state model?',
    outcomes:['Derive flip-flop input and next-state equations','Enumerate a state table without missing cases','Distinguish Moore from Mealy output placement'],
    concepts:[
      ['Analysis order','Label flip-flop outputs. Trace the combinational network to write each input equation. Apply the characteristic rule to get Q⁺. Enumerate every present-state/input row, then draw transitions.'],
      ['Output timing','A Moore output depends only on state and belongs inside the state node. A Mealy output depends on state and input and belongs on the transition.'],
      ['Completeness check','For one binary input, every state needs transitions for X=0 and X=1. A table row must specify both next state and output.']
    ],
    table:{heads:['Present Q','Input X','D=X⊕Q','Next Q⁺','Mealy Z=XQ'],rows:[['0','0','0','0','0'],['0','1','1','1','0'],['1','0','1','1','0'],['1','1','0','0','1']]},
    widgets:[{type:'togglefsm',title:'From equation to state trace',caption:'The active row and transition follow D=X⊕Q; Z=XQ responds to the present input and state.'}],
    worked:[
      {title:'Analyze a D flip-flop network',prompt:'One D flip-flop has D=X⊕Q and output Z=XQ. Derive its behavior.',steps:['Since Q⁺=D, write Q⁺=X⊕Q.','For X=0, Q⁺=Q, so both states hold.','For X=1, Q⁺=Q′, so both states toggle.','Compute Z from the present Q and X for each table row.'],answer:'Z=1 only on the transition out of Q=1 with X=1. This is a Mealy output.'},
      {title:'Convert a verbal rule to a table',prompt:'A two-state machine holds when X=0 and toggles when X=1. Its Moore output equals the state bit.',steps:['Name the states S0 and S1 with outputs 0 and 1.','For X=0, draw self-loops on both states.','For X=1, draw S0→S1 and S1→S0.','Place the output inside each state, not on each arrow.'],answer:'Four state/input rows are required, one for each pair of state and X.'}
    ],
    practice:[
      {q:'For D=X⊕Q, what transition occurs from Q=1 when X=1?',hint:'Compute D first.',a:'D=1⊕1=0, so Q⁺=0.'},
      {q:'A circuit output is Z=QX. Is it Moore or Mealy?',hint:'Check whether X appears in the output equation.',a:'Mealy, because the current input X can change Z without a state change.'}
    ],
    transfer:['Name every present-state variable and write flip-flop input equations from the gates.','Apply the correct characteristic equation to obtain each next-state bit.','Enumerate all state/input rows before drawing and checking the diagram.'],
    pitfalls:['Do not replace present Q with Q⁺ when calculating an output defined from present state.','A diagram drawn before the table often omits a transition.'],
    teach:['Set X=1 and single-step twice. Trace each active table row aloud.','Ask students to place Z for Q=1, X=1 on a state or on an arrow.','Use the four-row table as the audit of the diagram.']
  },
  {
    id:'03', title:'Flip-flop excitation and synchronous counters', short:'Synchronous design', reading:'Ch. 7 §§7.1–7.2, pp. 420–447', clo:'Flip-flop and counter design', time:'50 min',
    question:'What input must each flip-flop receive to make a specified transition?',
    outcomes:['Use D, T and JK excitation requirements','Design a synchronous modulus-six counter','Specify recovery from unused encodings'],
    concepts:[
      ['Design direction','Begin with desired Q→Q⁺ transitions. For D, the input is the desired next bit. For T, use T=Q⊕Q⁺. For JK, use the excitation table and its don’t-cares.'],
      ['Shared edge','All flip-flops in a synchronous counter sample one clock. The combinational network prepares every next-state bit before that edge.'],
      ['Unused states','A three-bit mod-6 design has encodings 110 and 111 outside its intended cycle. Assign a recovery transition before simplifying if predictable recovery matters.']
    ],
    table:{heads:['Q→Q⁺','D','T','J','K'],rows:[['0→0','0','0','0','–'],['0→1','1','1','1','–'],['1→0','0','1','–','1'],['1→1','1','0','–','0']]},
    widgets:[{type:'sync6',title:'Mod-6 counter laboratory',caption:'The table assigns 110 and 111 to recover to 000. Watch all three bits update on the same edge.'}],
    worked:[
      {title:'Design a mod-6 counter with D flip-flops',prompt:'Use Q₂Q₁Q₀ for 000→001→010→011→100→101→000. Send 110 and 111 to 000.',steps:['List all eight present states, including 110 and 111.','For every row, copy each next-state bit to D₂D₁D₀.','The ones of D₂ occur at present states 011 and 100.','The ones of D₁ occur at 001 and 010. The ones of D₀ occur at 000, 010 and 100.'],answer:'D₂=Σm(3,4), D₁=Σm(1,2), D₀=Σm(0,2,4), with minterm index Q₂Q₁Q₀.'},
      {title:'Convert a bit transition into excitation',prompt:'A state bit must move 1→0. Determine D, T and the constrained JK input.',steps:['D must equal the requested next value, so D=0.','T=Q⊕Q⁺=1⊕0=1.','For JK, K must be 1; J is a don’t-care because Q=1.'],answer:'D=0, T=1, J=–, K=1.'}
    ],
    practice:[
      {q:'A T flip-flop must move 0→0. What T is required?',hint:'Use T=Q⊕Q⁺.',a:'T=0⊕0=0.'},
      {q:'How many flip-flops are needed for a mod-10 binary counter?',hint:'Find the smallest n for which 2ⁿ≥10.',a:'Four flip-flops; 2³=8 is insufficient and 2⁴=16 is sufficient.'}
    ],
    transfer:['Write the required state sequence and include every unused encoding.','Add excitation columns for the selected flip-flop type.','Simplify each input equation and verify every transition by substitution.'],
    pitfalls:['A don’t-care in an excitation table is a design freedom, not a circuit value to drive.','Ignoring unused states may create an unwanted closed cycle.'],
    teach:['Start the counter at 101 and ask students to predict the wrap.','Use Set state to inject 110, then clock once to show recovery.','Derive one D input column from the transition table before showing all three equations.']
  },
  {
    id:'04', title:'Ripple counters and asynchronous behavior', short:'Asynchronous timing', reading:'Ch. 7 §7.3, pp. 447–450; timing extension', clo:'Asynchronous sequential circuits and ripple counters', time:'50 min',
    question:'What changes when state elements do not update on one shared edge?',
    outcomes:['Trace a ripple counter through transient codes','Explain propagation delay and decode glitches','Recognize a fundamental-mode asynchronous state change'],
    concepts:[
      ['Ripple mechanism','In a falling-edge toggle chain, Q₀ responds to the external clock. A 1→0 transition of Q₀ clocks Q₁, and a 1→0 transition of Q₁ clocks Q₂. These events are separated by propagation delay.'],
      ['Transient states','A 3-bit transition 011→100 passes through 010 and 000 in the illustrated delay model. A combinational decoder can briefly see those codes.'],
      ['Asynchronous feedback','A latch or asynchronous state circuit can change as soon as its control inputs change. In fundamental-mode analysis, allow one external input change at a time and wait for the circuit to settle before the next change. For an active-high request/clear memory with mutually exclusive S and R, Q⁺=S+QR′.']
    ],
    table:{heads:['Property','Synchronous counter','Ripple counter'],rows:[['Clocking','Common clock to all stages','One stage clocks the next'],['Update','Near one edge after logic delay','Cascaded propagation delays'],['Decode','Stable after settling','May see intermediate codes']]},
    widgets:[{type:'ripple',title:'Propagation-delay microscope',caption:'Step the counter and watch intermediate bit patterns. Slow motion makes the ripple visible.'},{type:'srlatch',title:'Asynchronous SR latch',caption:'Set or reset changes Q without a clock. The active-high S=R=1 case is intentionally blocked.'}],
    worked:[
      {title:'Trace 011→100 in a ripple counter',prompt:'A three-bit falling-edge toggle chain starts at Q₂Q₁Q₀=011. Show the order after the next external clock event.',steps:['Q₀ toggles from 1 to 0: 011→010.','That falling edge clocks Q₁, which toggles 1→0: 010→000.','Q₁ falling clocks Q₂, which toggles 0→1: 000→100.','Only 100 is the settled count. 010 and 000 are transient.'],answer:'The observed path is 011, 010, 000, 100.'},
      {title:'Design an asynchronous event memory',prompt:'A request S sets an indicator; clear R resets it. The events never assert together. Derive the next-state rule.',steps:['List the stable cases: 00 holds Q, 10 sets Q to 1, and 01 resets Q to 0.','Use a present-state column to cover Q=0 and Q=1 for each permitted input pair.','The set term S makes Q⁺=1 whenever S=1. The hold term QR′ preserves Q when R=0.','Combine them as Q⁺=S+QR′, valid for the specified mutually exclusive inputs.'],answer:'An active-high SR latch realizes the rule. Input 11 is outside the specification and must be prevented or resolved by design.'}
    ],
    practice:[
      {q:'What intermediate codes can appear during ripple transition 001→010?',hint:'Toggle Q₀ first, then react to its falling edge.',a:'001→000→010.'},
      {q:'Why might a decoder connected to ripple outputs produce a narrow pulse?',hint:'Consider the intermediate codes before settling.',a:'Its Boolean condition can become true briefly for a transient state even when the starting and final states do not require that output.'}
    ],
    transfer:['State which clock edge triggers each stage and in which bit order.','Trace every stage transition and include transient codes before the settled result.','For asynchronous feedback, list stable input/state combinations and check the one-input-change assumption.'],
    pitfalls:['The final binary sequence alone hides the propagation path.','Never assume S=R=1 has the same meaning for every latch type and polarity.'],
    teach:['Freeze the 011→100 ripple transition after its first bit change.','Ask the class which transient code a decoder could detect.','Demonstrate that the SR latch responds while the external clock is idle.']
  },
  {
    id:'05', title:'Registers and counter families', short:'Registers and shifting', reading:'Ch. 8 §§8.1–8.2, pp. 493–506', clo:'Serial, parallel, shift registers and counters', time:'50 min',
    question:'How do storage arrangements trade pins, clock cycles and decoding effort?',
    outcomes:['Trace SISO, SIPO, PISO and PIPO transfers','Determine shift-register latency','Trace ring and Johnson counter cycles'],
    concepts:[
      ['Register transfers','A register stores several bits. Serial input supplies one bit per edge; parallel input supplies all bits together. Serial output emits one bit per edge; parallel output exposes all bits together.'],
      ['Shift timing','For the four-stage register shown, a new serial bit enters the leftmost stage on each edge. The previous contents move one position right. An initial four-bit word requires four input edges to fill the register.'],
      ['Feedback counters','A one-hot ring counter recirculates one asserted bit and has N intended states. A Johnson counter inserts the inverse of the rightmost bit and has 2N intended states from reset.']
    ],
    table:{heads:['Mode','Input','Output','Typical purpose'],rows:[['SISO','Serial','Serial','Delay line'],['SIPO','Serial','Parallel','Receive a word'],['PISO','Parallel','Serial','Transmit a word'],['PIPO','Parallel','Parallel','Store a word']]},
    widgets:[{type:'register',title:'Four-stage register',caption:'Select a transfer mode, load a word or enter serial bits, and advance one edge at a time.'},{type:'ring',title:'Ring and Johnson cycle explorer',caption:'The feedback rule changes the number of reachable states.'}],
    worked:[
      {title:'Fill a SIPO register',prompt:'A four-stage register begins 0000. Enter serial bits 1,0,1,1 at the left end on four edges.',steps:['After 1: 1000.','After 0: 0100.','After 1: 1010.','After 1: 1101.'],answer:'The parallel word is 1101 after four edges.'},
      {title:'Trace a four-stage Johnson counter',prompt:'Starting at 0000, shift right and insert the inverse of the rightmost bit.',steps:['First four edges: 1000, 1100, 1110, 1111.','Now the rightmost bit is 1, so zeros enter.','Next states: 0111, 0011, 0001, 0000.'],answer:'The cycle has eight states, equal to 2N for N=4.'}
    ],
    practice:[
      {q:'How many intended states has a five-stage one-hot ring counter?',hint:'The single 1 occupies each stage once.',a:'Five.'},
      {q:'A loaded four-bit PISO register emits its rightmost bit first. What serial sequence comes from 1011?',hint:'Read rightmost bit, then shift right each edge.',a:'1, 1, 0, 1.'}
    ],
    transfer:['Mark bit order, shift direction, and whether load is serial or parallel.','Write the entire register word after each active edge.','For feedback counters, continue until the initial word returns and count unique states.'],
    pitfalls:['A shift direction must be stated before writing the bit sequence.','Ring and Johnson counters do not normally visit all 2ᴺ bit patterns.'],
    teach:['Load 1011 in PISO mode and ask for the output sequence before clocking.','Toggle between ring and Johnson modes and count states to reset.','Have students distinguish a bit’s entry latency from the full word’s fill latency.']
  },
  {
    id:'06', title:'FSM synthesis, ASM and encoding', short:'FSM synthesis', reading:'Ch. 7 §7.4, pp. 450–465; Ch. 8 §§8.4–8.6, pp. 511–518', clo:'State diagrams and sequential design', time:'50 min',
    question:'What history must a detector remember to report an overlapping pattern?',
    outcomes:['Derive states from useful input suffixes','Design an overlapping 101 detector','Interpret an ASM block and compare binary with one-hot encoding'],
    concepts:[
      ['State meaning','For a 101 detector, remember only suffixes that may begin the target: no useful suffix (S₀), suffix 1 (S₁), and suffix 10 (S₂).'],
      ['Overlap','From S₂, input 1 completes 101. That last 1 can begin another occurrence, so the next state is S₁. This produces correct detections for 10101.'],
      ['ASM and encoding','An ASM state box gives actions during the state interval; a decision box tests inputs; a conditional output box belongs on its selected path. Binary encoding uses ⌈log₂N⌉ state bits; one-hot uses N.']
    ],
    table:{heads:['Present state','X=0: next/Z','X=1: next/Z'],rows:[['S₀ (none)','S₀ / 0','S₁ / 0'],['S₁ (1)','S₂ / 0','S₁ / 0'],['S₂ (10)','S₀ / 0','S₁ / 1']]},
    widgets:[{type:'detector',title:'Overlapping 101 detector',caption:'Enter bits one by one or play 10101. Watch the retained suffix and the detection pulse.'}],
    worked:[
      {title:'Derive the 101 state table',prompt:'Detect every overlapping occurrence of 101 in a serial stream.',steps:['S₀ stores no useful suffix. Input 1 moves to S₁.','S₁ stores suffix 1. Input 0 moves to S₂; input 1 stays S₁.','S₂ stores suffix 10. Input 1 asserts Z=1 and moves to S₁.','Input 0 from S₂ gives 100, with no useful suffix, so return to S₀.'],answer:'The Mealy machine has three states and detects both occurrences in 10101.'},
      {title:'Choose an encoding',prompt:'Encode a five-state controller with binary and one-hot assignments.',steps:['Binary needs ⌈log₂5⌉=3 flip-flops.','One-hot needs five flip-flops.','Binary leaves three unused codes; one-hot leaves many invalid patterns.','Compare next-state logic, reset strategy and timing before choosing.'],answer:'Storage counts are 3 versus 5; neither count alone determines the best implementation.'}
    ],
    practice:[
      {q:'What state follows S₂ after input 1 in the overlapping 101 detector?',hint:'The final 1 is a useful prefix.',a:'S₁, with Z=1 on that transition.'},
      {q:'How many state bits does binary encoding need for 12 states?',hint:'Find the smallest n with 2ⁿ≥12.',a:'Four bits.'}
    ],
    transfer:['Identify the shortest history that affects future output and name one state per useful history.','For every state and input, append the bit, place any output, and retain the longest useful suffix.','Only after the diagram is complete, assign codes and derive next-state equations.'],
    pitfalls:['A detector must define a transition for both input values from every state.','A one-hot code can simplify decoding but requires valid initialization.'],
    teach:['Enter 10101 and pause at the first detection. Ask why the next state is S₁.','Draw the three suffix meanings before showing codes.','Translate one transition into an ASM decision path.']
  },
  {
    id:'07', title:'ROM, PLA and PAL implementation', short:'Memory devices and PLDs', reading:'Ch. 5 §5.6, pp. 276 onward; Ch. 8 §8.3, pp. 506–511', clo:'ROM, PLA and PAL circuit design', time:'50 min',
    question:'How can one truth table be realized with three programmable structures?',
    outcomes:['Map inputs to ROM addresses and output words','Build shared product terms in a PLA','Explain fixed OR allocation in a PAL'],
    concepts:[
      ['ROM','An n-input ROM presents 2ⁿ addresses. The address selects a stored output word. For a sequential implementation, current state and external input can form the address, with next-state and output bits stored in each word.'],
      ['PLA','A programmable AND plane forms selected product terms. A programmable OR plane connects each term to any needed output. Shared terms can serve multiple outputs.'],
      ['PAL','A programmable AND plane feeds a fixed OR arrangement. Product-term allocation is limited by the device architecture, so sharing and fitting must be checked against the chosen PAL.']
    ],
    table:{heads:['A B','ROM word F G','Active product'],rows:[['0 0','0 0','none'],['0 1','1 0','A′B'],['1 0','1 0','AB′'],['1 1','0 1','AB']]},
    widgets:[{type:'pld',title:'One function, three architectures',caption:'Select A and B. The highlighted address, product term and outputs update together.'}],
    worked:[
      {title:'Implement XOR and AND',prompt:'Let F=A⊕B and G=AB. Realize both functions by ROM and PLA.',steps:['List output words at addresses 00,01,10,11: 00,10,10,01.','A 4×2 ROM stores those four words.','Form PLA terms P₁=A′B, P₂=AB′ and P₃=AB.','Connect F=P₁+P₂ and G=P₃.'],answer:'The ROM stores 8 output bits. The PLA uses three product terms for this direct SOP realization.'},
      {title:'Assess a PAL fit',prompt:'A PAL gives each output two fixed OR inputs. Can the same XOR/AND pair fit?',steps:['F needs two product terms, A′B and AB′.','G needs one product term, AB.','Allocate two AND terms to F and one to G.','Check the actual PAL for available true/complement input literals and output polarity.'],answer:'It fits this stated two-terms-per-output model; a real device must be checked against its data sheet.'}
    ],
    practice:[
      {q:'For two input bits and three output bits, what is the minimum ROM organization?',hint:'Addresses are all input combinations.',a:'4×3, meaning four addresses and three output bits per word.'},
      {q:'Let H=A+B. Which input rows store H=1?',hint:'OR is 0 only when both inputs are 0.',a:'Addresses 01, 10 and 11.'}
    ],
    transfer:['Write the full input/output truth table with a fixed address order.','For ROM, copy output words into addresses; for PLA, minimize and list product terms.','For PAL, allocate product terms to each fixed output OR and check device limits.'],
    pitfalls:['ROM capacity is address count × output width, not just the number of asserted truth-table cells.','A PAL is a family of devices; fixed OR limits and output polarity depend on the part.'],
    teach:['Toggle the address and have students read the ROM word before exposing equations.','Highlight how the same truth table maps to a PLA product plane.','Ask students to count terms required at each PAL output.']
  },
  {
    id:'08', title:'State reduction by implication', short:'State reduction', reading:'Ch. 9 §9.1, online chapter pp. 9-3–9-10', clo:'State tables and efficient sequential design', time:'50 min',
    question:'When are two states indistinguishable for every future input sequence?',
    outcomes:['Mark output-incompatible state pairs','Propagate successor implications','Construct a reduced machine from unmarked pairs'],
    concepts:[
      ['Equivalence','Two states are equivalent when every possible future input sequence produces the same observable output sequence. Matching present outputs is necessary for Moore states but is not sufficient.'],
      ['Implication table','List unordered pairs. Mark immediate output mismatches. For the remaining pairs, compare successors under every input. If any successor pair becomes distinguishable, mark the original pair. Repeat until stable.'],
      ['Quotient machine','Each equivalence class becomes one state. Redirect every transition to the class containing its original destination. Preserve reset behavior.']
    ],
    table:{heads:['State / output','X=0 next','X=1 next'],rows:[['A / 0','B','C'],['B / 0','B','D'],['C / 0','C','D'],['D / 1','D','D']]},
    widgets:[{type:'reduction',title:'Implication-table animator',caption:'Advance one pass at a time. Immediate output mismatches appear first; successor distinctions propagate next.'}],
    worked:[
      {title:'Reduce a four-state Moore machine',prompt:'Use the table above. Determine which states can be merged.',steps:['Mark (A,D), (B,D) and (C,D): their present outputs differ.','Pair (A,B) implies (B,B) for X=0 and (C,D) for X=1. Since (C,D) is marked, mark (A,B).','Pair (A,C) implies (B,C) for X=0 and (C,D) for X=1, so mark (A,C).','Pair (B,C) implies itself for X=0 and (D,D) for X=1, so it remains unmarked.'],answer:'Merge B and C. The reduced states are {A}, {B,C} and {D}.'},
      {title:'Show why same output is insufficient',prompt:'States A and B both output 0. Explain why they are still distinguishable.',steps:['Apply input X=1.','A moves to C, whose output is 0.','B moves to D, whose output is 1.'],answer:'The one-symbol input sequence 1 distinguishes A from B on the following state interval.'}
    ],
    practice:[
      {q:'Which pairs are marked before considering successor states?',hint:'Compare the output column.',a:'(A,D), (B,D) and (C,D).'},
      {q:'What is the reduced transition from {B,C} when X=0?',hint:'Check both B and C destinations.',a:'Both destinations remain in {B,C}, so the reduced transition is a self-loop.'}
    ],
    transfer:['List all unordered pairs and mark immediate output conflicts.','Record successor-pair implications for each remaining pair and propagate marks to a fixed point.','Merge only unmarked equivalence classes and rebuild the transition table.'],
    pitfalls:['An unmarked pair after the first pass is only provisionally compatible.','Merging states changes representation, not the externally observed input/output behavior.'],
    teach:['Stop after the first pass and ask whether A and B can now be merged.','Advance the propagation pass and trace the single distinguishing input.','Have students rebuild the reduced table from equivalence classes.']
  },
  {
    id:'09', title:'Partitions and state assignment', short:'Partitions and encoding', reading:'Ch. 9 §§9.2–9.4, online chapter pp. 9-10–9-28', clo:'State reduction and state assignment', time:'50 min',
    question:'How do we separate behavioral reduction from binary coding?',
    outcomes:['Refine an output partition to stability','Assign codes after reduction','Compare binary and one-hot implementation costs'],
    concepts:[
      ['Partition refinement','Begin with states grouped by output. Within each block, compare the destination block reached under every input. Split states with different destination signatures. Repeat until no block splits.'],
      ['Reduce, then encode','Reduction finds behaviorally equivalent symbolic states. Assignment gives distinct binary codes to the remaining states. Reordering codes cannot change the abstract state graph.'],
      ['Cost criteria','The number of flip-flops is only one cost. Next-state logic, output decoding, available device resources, reset behavior and timing also matter.']
    ],
    table:{heads:['Pass','Partition'],rows:[['P₀ (output)','{A,B,C} | {D}'],['P₁ (successor signatures)','{A} | {B,C} | {D}'],['P₂','No further split: stable']]},
    widgets:[{type:'partition',title:'Partition refinement and encoding',caption:'Advance from output grouping to the stable partition. Then compare binary and one-hot state codes.'}],
    worked:[
      {title:'Refine the four-state example',prompt:'Use the state table from Lesson 08. Start with groups of equal Moore output.',steps:['P₀={{A,B,C},{D}}.','Within {A,B,C}, inspect destination blocks for X=0 and X=1.','A has signature ({A,B,C},{A,B,C}); B and C have ({A,B,C},{D}).','Split A from {B,C}. Repeating produces no further split.'],answer:'Stable classes are {A}, {B,C}, {D}.'},
      {title:'Assign codes to three reduced states',prompt:'Compare binary and one-hot codes for {A}, {B,C}, {D}.',steps:['Binary needs two flip-flops. One assignment is 00, 01, 10.','One-hot needs three flip-flops. One assignment is 001, 010, 100.','Write the complete next-state table under each assignment.','Compare resulting logic and required recovery from invalid codes.'],answer:'The assignment is an implementation choice; both must preserve the three-state transition behavior.'}
    ],
    practice:[
      {q:'How many flip-flops does binary encoding require for seven states?',hint:'Find the smallest n with 2ⁿ≥7.',a:'Three.'},
      {q:'Could A and B share one code if they have the same present output?',hint:'Use the stable partition, not only P₀.',a:'No. They occupy different stable classes because input 1 leads to different output behavior.'}
    ],
    transfer:['Partition states by observable output, then calculate destination-block signatures.','Split blocks with unequal signatures until the partition stops changing.','Assign codes to stable classes and compare complete logic and reset costs.'],
    pitfalls:['Do not choose a state code before proving which symbolic states can merge.','A low Hamming distance between selected transitions is only a heuristic for logic cost.'],
    teach:['Reveal P₀ and ask students to predict the first split.','Use destination signatures to justify the split.','Switch the displayed codes and emphasize that transitions stay the same.']
  },
  {
    id:'10', title:'Integrated sequential design workshop', short:'Design workshop', reading:'Review Ch. 6–9 and Ch. 5 §5.6', clo:'All three stated sequential and memory-device CLOs', time:'50–75 min',
    question:'Can one design be traced from behavior to registers, state equations and a memory implementation?',
    outcomes:['Model a small serial transmitter as an FSM','Trace parallel load and serial shift timing','Map a controller table to ROM or product terms'],
    concepts:[
      ['System specification','A four-bit transmitter waits in IDLE. On start it enters LOAD, captures input word, then SHIFT emits the rightmost bit each edge. After four shifted bits it enters DONE for one cycle and returns to IDLE.'],
      ['Datapath and control','The data register stores the word; a two-bit count tracks remaining shifts; the FSM chooses load, shift and done actions. The register and controller update together on the clock.'],
      ['Implementation audit','Enumerate each state/input row, assign codes, derive next-state and control outputs, and inspect unused states. A ROM may store the next-state/control word addressed by state and conditions.']
    ],
    table:{heads:['State','Condition','Next state','Action'],rows:[['IDLE','start=0','IDLE','wait'],['IDLE','start=1','LOAD','accept request'],['LOAD','any','SHIFT','parallel load; count←4'],['SHIFT','count>1','SHIFT','emit bit; shift; decrement'],['SHIFT','count=1','DONE','emit final bit'],['DONE','any','IDLE','done pulse']]},
    widgets:[{type:'transmitter',title:'Serial transmitter walkthrough',caption:'Load a four-bit word, start the controller and advance each clock edge. State, count, data and emitted bits animate together.'}],
    worked:[
      {title:'Trace transmission of 1011',prompt:'The transmitter emits the rightmost bit first. Give the emitted sequence and number of SHIFT edges.',steps:['Start causes IDLE→LOAD; no bit is emitted yet.','LOAD captures 1011 and sets count to 4.','Four SHIFT edges emit 1,1,0,1.','After the fourth emission, state becomes DONE and count becomes 0.'],answer:'The serial sequence is 1101 over four SHIFT edges.'},
      {title:'Estimate a ROM for the controller',prompt:'Use a two-bit state code and two condition bits (start, last) as a conceptual controller address. Store two next-state bits and three action bits.',steps:['There are 2⁴=16 possible addresses.','Each word contains 2+3=5 output bits.','The conceptual ROM organization is 16×5.','Specify all unused address words, including invalid state encodings if any, for safe behavior.'],answer:'The organization is 16×5, or 80 stored output bits. Conditions must be defined for every address.'}
    ],
    practice:[
      {q:'If a PISO register holds 0110 and emits the rightmost bit first, what is the output sequence?',hint:'Read bits from right to left.',a:'0,1,1,0.'},
      {q:'Why does the controller need a count as well as the data register?',hint:'The data pattern itself may contain zeros and ones.',a:'The count records how many bits remain; data bits alone do not indicate whether four transfers have occurred.'}
    ],
    transfer:['Separate controller state, datapath registers, inputs, and observable outputs.','Trace one clock edge at a time with state, count, data and output columns.','Build a complete controller table, specify invalid cases, then select gates or ROM/PLA/PAL implementation.'],
    pitfalls:['Specify whether an action happens during a state interval or on the edge leaving that state.','Define control values for unused ROM addresses and reset conditions.'],
    teach:['Invite students to predict the next state before every edge.','Write emitted bits on the board and compare with the changing register.','End by asking learners to map the controller table to a ROM word format.']
  }
];
