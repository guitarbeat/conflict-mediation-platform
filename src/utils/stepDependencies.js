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
    "partyAThoughts",
    "partyASelectedEmotionWords",
    "partyAEmotionChartPosition",
    "partyAAggressiveApproach",
    "partyAPassiveApproach",
    "partyAAssertiveApproach",
    "partyAWhyBecause",
  ],
  3: [
    "partyBThoughts",
    "partyBSelectedEmotionWords",
    "partyBEmotionChartPosition",
    "partyBAggressiveApproach",
    "partyBPassiveApproach",
    "partyBAssertiveApproach",
    "partyBWhyBecause",
  ],
  4: [
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
    "partyAMiracle",
    "partyBMiracle",
    "partyATop3Solutions",
    "partyBTop3Solutions",
    "partyAPerspective",
    "partyBPerspective",
    "compromiseSolutions",
  ],
  6: [
    "partyAUnmetNeeds",
    "partyBUnmetNeeds",
    "partyANeedsInPractice",
    "partyBNeedsInPractice",
    "actionSteps",
    "followUpDate",
    "additionalSupport",
  ],
  7: [], // Step 7 handles its dependencies via strict equality check or implicit full re-render logic
};
