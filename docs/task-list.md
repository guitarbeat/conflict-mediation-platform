### Task List — Enhancements Implemented

- [x] Error handling
  - [x] Added `src/components/ErrorBoundary.jsx`
  - [x] Wrapped `<App />` with `ErrorBoundary` in `src/main.jsx`

- [x] Testing setup
  - [x] Added Vitest + React Testing Library + jsdom dev dependencies
  - [x] Configured tests in `vite.config.js` (`test` block)
  - [x] Created `src/test/setupTests.js` with `jest-dom` and `matchMedia` mock
  - [x] Added `src/App.test.jsx` smoke test for the app heading
  - [x] Hardened `src/components/ParticleBackground.jsx` against missing canvas context for tests

- [x] Linting and code health
  - [x] Disabled noisy `react-refresh/only-export-components` rule in `eslint.config.js`
  - [x] Verified ESLint passes cleanly

- [x] PWA & SEO
  - [x] Created `public/manifest.webmanifest`
  - [x] Added `public/favicon.svg`
  - [x] Updated `index.html` with SEO meta tags (description, Open Graph), Apple touch icon, and SVG favicon
  - [x] Added `public/robots.txt`

- [x] CI & docs
  - [x] Added GitHub Actions workflow `.github/workflows/ci.yml` (install, lint, build, test)
  - [x] Added MIT `LICENSE`
  - [x] Updated `README.md` with test commands

- [x] Package scripts
  - [x] Added `test`, `test:watch`, `coverage` scripts to `package.json`

- [x] Verification
  - [x] Lint: clean
  - [x] Tests: passing
  - [x] Build: successful

- [x] Git workflow
  - [x] Pushed feature work
  - [x] Deleted feature branch remotely and locally
  - [x] Merged updates into `main` and pushed
  - [x] Checked rebase status: local `main` is in sync with `origin/main`

### Next suggestions (optional)
- [ ] Add more unit tests for components and hooks; set coverage thresholds
- [ ] Add Lighthouse/axe checks to CI for accessibility and performance
- [ ] Provide multiple app icons (192/512 PNG) for richer PWA install experience
- [ ] Add `sitemap.xml` and update `robots.txt` with the sitemap path