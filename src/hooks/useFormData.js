import { useState } from "react";

/**
 * Custom hook for managing conflict mediation form data
 * @returns {Object} Form data state and operations
 */
export const useFormData = () => {
    const [formData, setFormData] = useState({
        partyAName: "",
        partyBName: "",
        dateOfIncident: "",
        dateOfMediation: "",
        locationOfConflict: "",
        conflictDescription: "",
        // Individual Reflection A
        partyAThoughts: "",
        partyASelectedEmotionWords: [],
        partyAEmotionChartPosition: null,
        partyAAggressiveApproach: "",
        partyAPassiveApproach: "",
        partyAAssertiveApproach: "",
        partyAWhyBecause: "",
        // Individual Reflection B
        partyBThoughts: "",
        partyBSelectedEmotionWords: [],
        partyBEmotionChartPosition: null,
        partyBAggressiveApproach: "",
        partyBPassiveApproach: "",
        partyBAssertiveApproach: "",
        partyBWhyBecause: "",
        // ABCDE Model
        activatingEvent: "",
        partyABeliefs: "",
        partyBBeliefs: "",
        partyAConsequences: "",
        partyBConsequences: "",
        partyADisputations: "",
        partyBDisputations: "",
        effectsReflections: "",
        // Solution Development
        partyAMiracle: "",
        partyBMiracle: "",
        partyATop3Solutions: "",
        partyBTop3Solutions: "",
        partyAPerspective: "",
        partyBPerspective: "",
        compromiseSolutions: "",
        // Agreement & Action Steps
        partyAUnmetNeeds: "",
        partyBUnmetNeeds: "",
        partyANeedsInPractice: "",
        partyBNeedsInPractice: "",
        actionSteps: "",
        followUpDate: "",
        additionalSupport: "",
    });

    /**
     * Update a single form field
     * @param {string} field - The field name to update
     * @param {any} value - The new value for the field
     */
    const updateFormData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Update multiple form fields at once
     * @param {Object} updates - Object containing field-value pairs
     */
    const updateMultipleFields = (updates) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    /**
     * Reset form data to initial state
     */
    const resetFormData = () => {
        setFormData({
            partyAName: "",
            partyBName: "",
            dateOfIncident: "",
            dateOfMediation: "",
            locationOfConflict: "",
            conflictDescription: "",
            partyAThoughts: "",
            partyASelectedEmotionWords: [],
            partyAEmotionChartPosition: null,
            partyAAggressiveApproach: "",
            partyAPassiveApproach: "",
            partyAAssertiveApproach: "",
            partyAWhyBecause: "",
            partyBThoughts: "",
            partyBSelectedEmotionWords: [],
            partyBEmotionChartPosition: null,
            partyBAggressiveApproach: "",
            partyBPassiveApproach: "",
            partyBAssertiveApproach: "",
            partyBWhyBecause: "",
            activatingEvent: "",
            partyABeliefs: "",
            partyBBeliefs: "",
            partyAConsequences: "",
            partyBConsequences: "",
            partyADisputations: "",
            partyBDisputations: "",
            effectsReflections: "",
            partyAMiracle: "",
            partyBMiracle: "",
            partyATop3Solutions: "",
            partyBTop3Solutions: "",
            partyAPerspective: "",
            partyBPerspective: "",
            compromiseSolutions: "",
            partyAUnmetNeeds: "",
            partyBUnmetNeeds: "",
            partyANeedsInPractice: "",
            partyBNeedsInPractice: "",
            actionSteps: "",
            followUpDate: "",
            additionalSupport: "",
        });
    };

    /**
     * Get form data for a specific step
     * @param {number} step - The step number
     * @returns {Object} Relevant form data for the step
     */
    const getStepData = (step) => {
        switch (step) {
            case 1:
                return {
                    partyAName: formData.partyAName,
                    partyBName: formData.partyBName,
                    dateOfIncident: formData.dateOfIncident,
                    dateOfMediation: formData.dateOfMediation,
                    locationOfConflict: formData.locationOfConflict,
                    conflictDescription: formData.conflictDescription,
                };
            case 2:
                return {
                    partyAThoughts: formData.partyAThoughts,
                    partyASelectedEmotionWords: formData.partyASelectedEmotionWords,
                    partyAEmotionChartPosition: formData.partyAEmotionChartPosition,
                    partyAAggressiveApproach: formData.partyAAggressiveApproach,
                    partyAPassiveApproach: formData.partyAPassiveApproach,
                    partyAAssertiveApproach: formData.partyAAssertiveApproach,
                    partyAWhyBecause: formData.partyAWhyBecause,
                };
            case 3:
                return {
                    partyBThoughts: formData.partyBThoughts,
                    partyBSelectedEmotionWords: formData.partyBSelectedEmotionWords,
                    partyBEmotionChartPosition: formData.partyBEmotionChartPosition,
                    partyBAggressiveApproach: formData.partyBAggressiveApproach,
                    partyBPassiveApproach: formData.partyBPassiveApproach,
                    partyBAssertiveApproach: formData.partyBAssertiveApproach,
                    partyBWhyBecause: formData.partyBWhyBecause,
                };
            case 4:
                return {
                    activatingEvent: formData.activatingEvent,
                    partyABeliefs: formData.partyABeliefs,
                    partyBBeliefs: formData.partyBBeliefs,
                    partyAConsequences: formData.partyAConsequences,
                    partyBConsequences: formData.partyBConsequences,
                    partyADisputations: formData.partyADisputations,
                    partyBDisputations: formData.partyBDisputations,
                    effectsReflections: formData.effectsReflections,
                };
            case 5:
                return {
                    partyAMiracle: formData.partyAMiracle,
                    partyBMiracle: formData.partyBMiracle,
                    partyATop3Solutions: formData.partyATop3Solutions,
                    partyBTop3Solutions: formData.partyBTop3Solutions,
                    partyAPerspective: formData.partyAPerspective,
                    partyBPerspective: formData.partyBPerspective,
                    compromiseSolutions: formData.compromiseSolutions,
                };
            case 6:
                return {
                    partyAUnmetNeeds: formData.partyAUnmetNeeds,
                    partyBUnmetNeeds: formData.partyBUnmetNeeds,
                    partyANeedsInPractice: formData.partyANeedsInPractice,
                    partyBNeedsInPractice: formData.partyBNeedsInPractice,
                    actionSteps: formData.actionSteps,
                    followUpDate: formData.followUpDate,
                    additionalSupport: formData.additionalSupport,
                };
            case 7:
                return {
                    // Export step - no specific form data needed
                    // All form data is available for export
                };
            default:
                return {};
        }
    };

    /**
     * Check if a step has required data filled
     * @param {number} step - The step number
     * @returns {boolean} Whether the step has required data
     */
    const isStepComplete = (step) => {
        const stepData = getStepData(step);
        const requiredFields = getRequiredFieldsForStep(step);

        return requiredFields.every(field => {
            const value = stepData[field];
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value && value.toString().trim() !== "";
        });
    };

    /**
     * Get required fields for a specific step
     * @param {number} step - The step number
     * @returns {string[]} Array of required field names
     */
    const getRequiredFieldsForStep = (step) => {
        switch (step) {
            case 1:
                return ["partyAName", "partyBName", "conflictDescription"];
            case 2:
                return ["partyAThoughts", "partyAAssertiveApproach"];
            case 3:
                return ["partyBThoughts", "partyBAssertiveApproach"];
            case 4:
                return ["activatingEvent", "partyABeliefs", "partyBBeliefs"];
            case 5:
                return ["partyAMiracle", "partyBMiracle", "compromiseSolutions"];
            case 6:
                return ["actionSteps", "followUpDate"];
            case 7:
                return []; // Export step - no required fields
            default:
                return [];
        }
    };

    return {
        formData,
        updateFormData,
        updateMultipleFields,
        resetFormData,
        getStepData,
        isStepComplete,
        getRequiredFieldsForStep,
    };
}; 