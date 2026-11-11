# ELEC 335 interactive sequential circuits

Student website: https://shujaansari.github.io/elec335-sequential/

Open `index.html` in a current browser. The lessons also work offline when the HTML files, `assets`, and slide folders remain together. No installation or build step is required for viewing.

## Teaching sequence

1. Lecture 15: State, latches and flip-flops.
2. Lecture 16: Sequential circuit analysis.
3. Lecture 17: Flip-flop excitation and synchronous counters.
4. Lecture 18: Ripple counters and asynchronous behavior.
5. Lecture 19: Registers and counter families.
6. Lecture 20: Finite-state machines and 101 detectors.
7. Lecture 21: ASM charts with Mealy and Moore detectors (`lesson-07.html`).
8. Lecture 22: ROM implementation of digital circuits (`lesson-08.html`).
9. Lecture 23: PLA and PAL design across the course (`lesson-09.html`).

The final three lessons match the concluding PowerPoint decks. They reuse the overlapping 101 detectors, synchronous MOD-6 counter, register functions, sequence generators, ripple terminal decoder and four-bit register controller. Each includes worked examples, revealable solutions, practice questions and “What should stay with you.”

The earlier state-reduction and state-assignment lessons remain available as optional extensions. The integrated workshop is also optional. `lesson-10.html` remains a working alias for that workshop, with no scheduled Lecture 24 label.

## Animations and timing

Use Next event, Previous event, Play/Pause and Reset. Detector and controller animations separate input or control preparation from the active clock edge. State, next-state data, raw outputs and recorded events use explicit observation conventions. ROM tables and decoder/OR matrices highlight the selected address. The ROM lesson includes Marcovitz Example 5.8 with its full 16×3 program. It supports decoder and expanded fixed-AND views, programmed dots or crosses, and staged address/decode/connection/output reads. PLA/PAL explorers reveal literal selection, AND products and OR outputs, and compare local PAL budgets with shared PLA products.

The universal-register laboratory prepares a D word before Clock stores it. Ripple animations show transient codes, asynchronous clear assertion and release. Waveform spacing is conceptual rather than measured device timing. Circuit and timing diagrams can be scrolled horizontally on small screens.

Use Present to show one section at a time. Left/right arrow keys change sections, and Escape exits. Worked answers remain concealed until revealed.

## Editing

- Lectures 15–20: main lesson data in `assets/lessons.js`, general rendering in `assets/app.js`, and the detailed Lecture 20 lesson in `assets/lesson06.js`.
- Lectures 21–23: lesson text, worked examples, SVG circuit views and controls in `assets/final-course.js`.
- Shared final-lecture logic and programmed tables: `assets/final-models.js`.
- Textbook ROM decoder/OR matrices, connection symbols and expanded fixed AND plane: `assets/rom-array.js`.
- New-lesson layout: `assets/final-course.css`; shared layout: `assets/style.css`.
- Final slide downloads: `Slides_Final_2026/`. Earlier slide downloads remain in `Slides_Course_Continuation_2026/`.

The models specify bit order, recovery policy, output polarity and clock convention. Keep those assumptions consistent when changing an example. The original examples align with Marcovitz, *Introduction to Logic Design*, third edition. Primary device references appear beside the PAL device example.

## Publishing

The deployment copy is the `ELEC335_Sequential_GitHub_Pages` repository. GitHub Pages publishes its `main` branch and root folder at the student URL above. A new commit updates the same URL. For a small text change away from the office, edit the corresponding file on GitHub and commit it to `main`.

Keep the `.nojekyll` file, HTML files and assets together. The source folder also has `build_pages.py` for regenerating the common HTML wrappers; it preserves the nine-lecture sequence and optional extension routes.
