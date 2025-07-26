# Copy-Paste Detection Cleanup Tasks

Based on JSCPD analysis results, here are the tasks needed to clean up duplicate code:

## 🚨 High Priority - Remove Duplicate Files

### 1. Remove Entirely Duplicate Files
- [x] **Delete `manus-working/pdfGenerator.js`** - Identical to `src/utils/pdfGenerator.js` (139 lines, 1,475 tokens)
- [x] **Delete `manus-working/ParticleBackground.jsx`** - Identical to `src/components/ParticleBackground.jsx` (124 lines, 1,178 tokens)
- [x] **Delete `manus-working/DarkModeToggle.jsx`** - Identical to `src/components/DarkModeToggle.jsx` (52 lines, 435 tokens)
- [x] **Delete `manus-working/app_temp.jsx`** - Nearly identical to `manus-working/App.jsx` (760 lines, 7,255 tokens)

### 2. Consolidate CSS Files
- [x] **Merge `manus-working/App.css` into `src/App.css`** - Multiple duplicate sections found
- [x] **Remove duplicate CSS sections** after merging

### 3. Consolidate HTML Files
- [x] **Merge `manus-working/index.html` into root `index.html`** - 8 duplicate lines found

## 🔧 Medium Priority - Refactor Internal Duplications

### 4. Fix NavigationButtons Component
- [ ] **Refactor `src/components/NavigationButtons.jsx`** - Internal duplication at lines 18-30 and 44-56
- [ ] Extract common navigation logic into reusable functions

### 5. Fix EmojiGridMapper Component
- [ ] **Refactor `manus-working/EmojiGridMapper.jsx`** - Multiple internal duplications:
  - Lines 73-92 and 111-130 (19 lines each)
  - Lines 177-190 and 285-297 (13 lines each)
  - Lines 212-217 and 451-456 (5 lines each)
  - Lines 226-249 and 314-341 (23 lines each)
- [ ] Extract common emoji mapping logic into reusable functions

### 6. Fix App.jsx Internal Duplications
- [ ] **Refactor `manus-working/app_temp.jsx`** - Internal duplications:
  - Lines 190-197 and 269-276 (7 lines each)
  - Lines 199-223 and 278-302 (24 lines each)

## 📝 Low Priority - Documentation Cleanup

### 7. Clean Up Markdown Files
- [ ] **Review `manus-working/Copyof1.ExampleIntpersonalConflictMediationWorksheet.txt`** - Multiple duplicate sections
- [ ] Remove or consolidate duplicate content

## 🎯 Expected Outcomes

After completing these tasks:
- **Reduce total duplicated lines** from 2,030 (11.1%) to under 500 (2.5%)
- **Reduce total duplicated tokens** from 20,055 (15.41%) to under 5,000 (3.8%)
- **Eliminate 15+ duplicate files**
- **Improve code maintainability** by removing redundant code
- **Reduce bundle size** by eliminating duplicate CSS and JS

## 📊 Current Duplication Statistics
- **Total files analyzed**: 157
- **Total lines**: 18,291
- **Total tokens**: 130,169
- **Duplicated lines**: 2,030 (11.1%)
- **Duplicated tokens**: 20,055 (15.41%)
- **Clones found**: 23

## 🔍 Files to Keep (Source of Truth)
- `src/` directory - Main source code
- `src/utils/pdfGenerator.js` - Keep this version
- `src/components/` - Keep all components here
- Root `index.html` - Keep this version
- Root `src/App.css` - Keep this version

## 🗑️ Files to Delete
- `manus-working/pdfGenerator.js`
- `manus-working/ParticleBackground.jsx`
- `manus-working/DarkModeToggle.jsx`
- `manus-working/app_temp.jsx`
- `manus-working/App.css` (after merging unique content)
- `manus-working/index.html` (after merging unique content)

---
*Generated from JSCPD analysis on $(date)*