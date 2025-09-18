# Survey Organization Guide

The conflict mediation survey has been reorganized into logical categories to improve user experience and navigation.

## Category Structure

### 1. 📋 Setup & Information
- **Steps**: 1
- **Purpose**: Gather basic information about the conflict and parties
- **Content**: Party names, conflict description, dates, location

### 2. 🤔 Individual Reflection  
- **Steps**: 2-3
- **Purpose**: Each party reflects on their thoughts, emotions, and communication approaches
- **Content**: 
  - Step 2: Party A individual reflection
  - Step 3: Party B individual reflection
- **Features**: Private reflection space, emotion mapping, communication approaches

### 3. 🔍 Analysis & Understanding
- **Steps**: 4
- **Purpose**: Use the ABCDE model to analyze the conflict together
- **Content**: ABCDE cognitive behavioral model discussion
- **Features**: Joint analysis, belief challenging, perspective taking

### 4. 💡 Solution Development
- **Steps**: 5
- **Purpose**: Explore solutions and develop compromise approaches
- **Content**: Miracle questions, solution brainstorming, perspective understanding
- **Features**: Collaborative solution finding, compromise development

### 5. 🤝 Agreement & Planning
- **Steps**: 6
- **Purpose**: Finalize agreements and create actionable next steps
- **Content**: Unmet needs, action steps, follow-up planning
- **Features**: Concrete action planning, accountability measures

### 6. 📤 Export & Summary
- **Steps**: 7
- **Purpose**: Save and share mediation session results
- **Content**: PDF/JSON export, session summary
- **Features**: Data export, session restoration

## New Features

### Category Navigation
- **Overview Panel**: Shows all categories with progress indicators
- **Expandable Sections**: Click to see steps within each category
- **Progress Tracking**: Visual progress bars for each category
- **Quick Navigation**: Jump to completed or next available step

### Enhanced Progress Header
- **Category Context**: Shows current category with icon and description
- **Overall Progress**: Displays completion across all categories
- **Step Context**: Maintains existing step-specific guidance

### Category Headers
- **Visual Identity**: Each step now shows its category with icon and description
- **Consistent Design**: Unified header design across all steps
- **Context Awareness**: Users always know which category they're in

## Benefits

1. **Better Organization**: Related steps are grouped logically
2. **Improved Navigation**: Users can see overall progress and jump between sections
3. **Clearer Context**: Each step shows its purpose within the larger process
4. **Enhanced UX**: Visual progress indicators and category-based navigation
5. **Maintainability**: Easier to add new steps or reorganize existing ones

## Technical Implementation

- **Configuration**: `src/config/surveyCategories.js` - Centralized category definitions
- **Navigation**: `src/components/CategoryNavigation.jsx` - Category overview component
- **Headers**: `src/components/StepContent.jsx` - Category headers in each step
- **Progress**: `src/components/ProgressHeader.jsx` - Enhanced progress display

The refactoring maintains all existing functionality while adding these organizational improvements.