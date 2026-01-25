// Defines which formData fields are relevant for each step.
// This is used to optimize re-renders in StepContent.

export const GLOBAL_DEPENDENCIES = [
  "partyAName",
  "partyBName",
  "partyAColor",
  "partyBColor",
];

export const STEP_DEPENDENCIES = {
  1: [
    "conflictDescription",
    "dateOfIncident",
    "dateOfMediation",
    "locationOfConflict",
  ],
  2: [
    // Party A Reflection
    "partyAThoughts",
    "partyASelectedEmotionWords",
    "partyAEmotionChartPosition",
    "partyAAggressiveApproach",
    "partyAPassiveApproach",
    "partyAAssertiveApproach",
    "partyAWhyBecause",
  ],
  3: [
    // Party B Reflection
    "partyBThoughts",
    "partyBSelectedEmotionWords",
    "partyBEmotionChartPosition",
    "partyBAggressiveApproach",
    "partyBPassiveApproach",
    "partyBAssertiveApproach",
    "partyBWhyBecause",
  ],
  4: [
    // Analysis
    "activatingEvent",
    "partyABeliefs",
    "partyBBeliefs",
    "partyAConsequences",
    "partyBConsequences",
    "partyADisputations",
    "partyBDisputations",
    "effectsReflections",
  ],
  5: [
    // Solutions
    "partyAMiracle",
    "partyBMiracle",
    "partyATop3Solutions",
    "partyBTop3Solutions",
    "partyAPerspective",
    "partyBPerspective",
    "compromiseSolutions",
  ],
  6: [
    // Agreements
    "partyAUnmetNeeds",
    "partyBUnmetNeeds",
    "partyANeedsInPractice",
    "partyBNeedsInPractice",
    "actionSteps",
    "followUpDate",
    "additionalSupport",
  ],
  7: [
    // Export - needs everything potentially, but mainly summary info
    // However, export functionality uses the stable callback.
    // The UI only shows names and date.
    // Date of Mediation is in Step 1 deps, but also used here.
    "dateOfMediation",
  ],
};
