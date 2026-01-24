/**
 * Dependencies configuration for StepContent memoization.
 * Defines which fields each step depends on to prevent unnecessary re-renders.
 */

export const GLOBAL_DEPENDENCIES = [
  "partyAName",
  "partyBName",
  "partyAColor",
  "partyBColor",
];

export const STEP_DEPENDENCIES = {
  1: [
    ...GLOBAL_DEPENDENCIES,
    "conflictDescription",
    "dateOfIncident",
    "dateOfMediation",
    "locationOfConflict",
  ],
  2: [
    ...GLOBAL_DEPENDENCIES,
    "partyAThoughts",
    "partyASelectedEmotionWords",
    "partyAEmotionChartPosition",
    "partyAAggressiveApproach",
    "partyAPassiveApproach",
    "partyAAssertiveApproach",
    "partyAWhyBecause",
  ],
  3: [
    ...GLOBAL_DEPENDENCIES,
    "partyBThoughts",
    "partyBSelectedEmotionWords",
    "partyBEmotionChartPosition",
    "partyBAggressiveApproach",
    "partyBPassiveApproach",
    "partyBAssertiveApproach",
    "partyBWhyBecause",
  ],
  4: [
    ...GLOBAL_DEPENDENCIES,
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
    ...GLOBAL_DEPENDENCIES,
    "partyAMiracle",
    "partyBMiracle",
    "partyATop3Solutions",
    "partyBTop3Solutions",
    "partyAPerspective",
    "partyBPerspective",
    "compromiseSolutions",
  ],
  6: [
    ...GLOBAL_DEPENDENCIES,
    "partyAUnmetNeeds",
    "partyBUnmetNeeds",
    "partyANeedsInPractice",
    "partyBNeedsInPractice",
    "actionSteps",
    "followUpDate",
    "additionalSupport",
  ],
};
