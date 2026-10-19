# ELEC 335 Sequential Circuits

Student website for Lectures 15–24. Open `index.html` to browse the interactive lessons. Each lesson includes circuit views, timing traces, worked examples, and practice questions. The index also links to the matching lecture slides.

## Edit and publish

The site is plain HTML, CSS, and JavaScript. No build step is required. After GitHub Pages is enabled for the repository's `main` branch and root folder, every commit pushed to `main` publishes an updated site at the same URL.

- Edit lesson text, examples, and questions in `assets/lessons.js`.
- Edit the main interactive circuit views in `assets/visuals.js`.
- Edit worked-example circuit and timing views in `assets/example-visuals.js`.
- Edit layout and colours in `assets/style.css`.
- Replace a file in `Slides_Course_Continuation_2026/` to update a downloadable deck while retaining its filename.

Keep `index.html`, all `lesson-*.html` files, and the `assets/` directory together. The empty `.nojekyll` file tells GitHub Pages to publish these static files directly.
