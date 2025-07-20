import React from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "./ui/button";
import FormField from "./FormField";
import SectionSeparator from "./SectionSeparator";
import EmojiGridMapper from "./EmojiGridMapper";
import { generateEnhancedPDF } from "../utils/pdfGenerator";

// * Communication Approaches component - moved outside to prevent recreation
const CommunicationApproaches = ({ prefix, formData, updateFormData }) => (
  <div className="space-y-4 sm:space-y-6">
    <label className="form-label">I want... (Communication Approaches)</label>
    <FormField
      id={`${prefix}AggressiveApproach`}
      label="Aggressive Approach (Not Recommended)"
      placeholder="What would you want to say if you were being aggressive?"
      value={formData[`${prefix}AggressiveApproach`]}
      onChange={(value) => updateFormData(`${prefix}AggressiveApproach`, value)}
      type="textarea"
      className="text-red-600"
    />
    <FormField
      id={`${prefix}PassiveApproach`}
      label="Passive Approach"
      placeholder="What would you want if you were being passive?"
      value={formData[`${prefix}PassiveApproach`]}
      onChange={(value) => updateFormData(`${prefix}PassiveApproach`, value)}
      type="textarea"
      className="text-blue-600"
    />
    <FormField
      id={`${prefix}AssertiveApproach`}
      label="Assertive Approach (Recommended)"
      placeholder="What would you want to say if you were being assertive and respectful?"
      value={formData[`${prefix}AssertiveApproach`]}
      onChange={(value) => updateFormData(`${prefix}AssertiveApproach`, value)}
      type="textarea"
      className="text-green-600"
    />
    <FormField
      id={`${prefix}WhyBecause`}
      label="Why/Because..."
      placeholder="Explain your reasoning..."
      value={formData[`${prefix}WhyBecause`]}
      onChange={(value) => updateFormData(`${prefix}WhyBecause`, value)}
      type="textarea"
    />
  </div>
);

// * Individual Reflection component - moved outside to prevent recreation
const IndividualReflection = ({ party, prefix, formData, updateFormData }) => (
  <div className="space-y-4 sm:space-y-6">
    <SectionSeparator title="Thoughts & Beliefs" />
    <FormField
      id={`${prefix}Thoughts`}
      label="I think..."
      placeholder="Explain what you think or believe to be true about the conflict..."
      value={formData[`${prefix}Thoughts`]}
      onChange={(value) => updateFormData(`${prefix}Thoughts`, value)}
      type="textarea"
      rows={4}
    />

    <SectionSeparator title="Emotions & Feelings" />
    <div className="space-y-3 sm:space-y-4">
      <label className="form-label">
        I feel... (Use both methods to express your emotions)
      </label>
      <EmojiGridMapper
        onEmotionWordsChange={(words) =>
          updateFormData(`${prefix}SelectedEmotionWords`, words)
        }
        onChartPositionChange={(position) =>
          updateFormData(`${prefix}EmotionChartPosition`, position)
        }
        selectedEmotionWords={formData[`${prefix}SelectedEmotionWords`]}
        chartPosition={formData[`${prefix}EmotionChartPosition`]}
      />
    </div>

    <SectionSeparator title="Communication Approaches" />
    <CommunicationApproaches
      party={party}
      prefix={prefix}
      formData={formData}
      updateFormData={updateFormData}
    />
  </div>
);

const StepContent = ({ step, formData, updateFormData, onExportJSON }) => {
  const TwoColumnFields = ({ fields }) => (
    <div className="form-grid form-grid-2">
      {fields.map((field) => (
        <FormField key={field.id} {...field} />
      ))}
    </div>
  );

  switch (step) {
    case 1:
      return (
        <div className="space-y-2 sm:space-y-3">
          <SectionSeparator title="Party Information" />
          <p className="text-center text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base">
            Let's start by gathering some basic information about the conflict
            and the parties involved.
          </p>
          <div className="form-grid form-grid-2">
            <FormField
              id="partyAName"
              label="Party A Name"
              placeholder="Enter first person's name"
              value={formData.partyAName}
              onChange={(value) => updateFormData("partyAName", value)}
            />
            <FormField
              id="partyBName"
              label="Party B Name"
              placeholder="Enter second person's name"
              value={formData.partyBName}
              onChange={(value) => updateFormData("partyBName", value)}
            />
          </div>

          <SectionSeparator title="Conflict Details" />
          <div className="form-grid form-grid-3">
            <FormField
              id="dateOfIncident"
              label="Date of Incident"
              type="date"
              value={formData.dateOfIncident}
              onChange={(value) => updateFormData("dateOfIncident", value)}
            />
            <FormField
              id="dateOfMediation"
              label="Date of Mediation"
              type="date"
              value={formData.dateOfMediation}
              onChange={(value) => updateFormData("dateOfMediation", value)}
            />
            <FormField
              id="locationOfConflict"
              label="Location of Conflict"
              placeholder="Where did this happen?"
              value={formData.locationOfConflict}
              onChange={(value) => updateFormData("locationOfConflict", value)}
            />
          </div>

          <FormField
            id="conflictDescription"
            label="Agreed Upon Description of Conflict"
            placeholder="Both parties should agree on this description of what happened..."
            value={formData.conflictDescription}
            onChange={(value) => updateFormData("conflictDescription", value)}
            type="textarea"
            rows={4}
          />
        </div>
      );

    case 2:
      return (
        <IndividualReflection
          party="A"
          prefix="partyA"
          formData={formData}
          updateFormData={updateFormData}
        />
      );

    case 3:
      return (
        <IndividualReflection
          party="B"
          prefix="partyB"
          formData={formData}
          updateFormData={updateFormData}
        />
      );

    case 4:
      return (
        <div className="space-y-4 sm:space-y-6">
          <SectionSeparator title="ABCDE Model Discussion" />
          <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Work through this cognitive behavioral model together to understand
            the conflict better.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <FormField
              id="activatingEvent"
              label="A - Activating Event"
              description="What actually happened? Stick to observable facts."
              placeholder="Describe the factual events that triggered this conflict..."
              value={formData.activatingEvent}
              onChange={(value) => updateFormData("activatingEvent", value)}
              type="textarea"
              rows={3}
            />

            <div className="form-grid form-grid-2">
              <FormField
                id="partyABeliefs"
                label={`B - ${formData.partyAName || "Party A"} Beliefs`}
                description="What thoughts or beliefs do you have about this event?"
                placeholder="Your thoughts and beliefs about what happened..."
                value={formData.partyABeliefs}
                onChange={(value) => updateFormData("partyABeliefs", value)}
                type="textarea"
                rows={3}
              />
              <FormField
                id="partyBBeliefs"
                label={`B - ${formData.partyBName || "Party B"} Beliefs`}
                description="What thoughts or beliefs do you have about this event?"
                placeholder="Your thoughts and beliefs about what happened..."
                value={formData.partyBBeliefs}
                onChange={(value) => updateFormData("partyBBeliefs", value)}
                type="textarea"
                rows={3}
              />
            </div>

            <div className="form-grid form-grid-2">
              <FormField
                id="partyAConsequences"
                label={`C - ${formData.partyAName || "Party A"} Consequences`}
                description="How did your beliefs make you feel and behave?"
                placeholder="Your emotional and behavioral responses..."
                value={formData.partyAConsequences}
                onChange={(value) =>
                  updateFormData("partyAConsequences", value)
                }
                type="textarea"
                rows={3}
              />
              <FormField
                id="partyBConsequences"
                label={`C - ${formData.partyBName || "Party B"} Consequences`}
                description="How did your beliefs make you feel and behave?"
                placeholder="Your emotional and behavioral responses..."
                value={formData.partyBConsequences}
                onChange={(value) =>
                  updateFormData("partyBConsequences", value)
                }
                type="textarea"
                rows={3}
              />
            </div>

            <div className="form-grid form-grid-2">
              <FormField
                id="partyADisputations"
                label={`D - ${formData.partyAName || "Party A"} Disputations`}
                description="Challenge your beliefs. Are they helpful? Accurate? Realistic?"
                placeholder="Question and challenge your initial beliefs..."
                value={formData.partyADisputations}
                onChange={(value) =>
                  updateFormData("partyADisputations", value)
                }
                type="textarea"
                rows={3}
              />
              <FormField
                id="partyBDisputations"
                label={`D - ${formData.partyBName || "Party B"} Disputations`}
                description="Challenge your beliefs. Are they helpful? Accurate? Realistic?"
                placeholder="Question and challenge your initial beliefs..."
                value={formData.partyBDisputations}
                onChange={(value) =>
                  updateFormData("partyBDisputations", value)
                }
                type="textarea"
                rows={3}
              />
            </div>

            <FormField
              id="effectsReflections"
              label="E - Effects & Reflections"
              description="What new insights have emerged? How do you both feel now?"
              placeholder="Reflect on new perspectives and feelings that have emerged..."
              value={formData.effectsReflections}
              onChange={(value) => updateFormData("effectsReflections", value)}
              type="textarea"
              rows={4}
            />
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-4 sm:space-y-6">
          <SectionSeparator title="Solution Development" />
          <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Now let's explore possibilities and develop solutions together.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div className="form-grid form-grid-2">
              <FormField
                id="partyAMiracle"
                label={`${formData.partyAName || "Party A"} - Miracle Question`}
                description="If you woke up tomorrow and this conflict was completely resolved, what would be different?"
                placeholder="Describe your ideal resolution..."
                value={formData.partyAMiracle}
                onChange={(value) => updateFormData("partyAMiracle", value)}
                type="textarea"
                rows={4}
              />
              <FormField
                id="partyBMiracle"
                label={`${formData.partyBName || "Party B"} - Miracle Question`}
                description="If you woke up tomorrow and this conflict was completely resolved, what would be different?"
                placeholder="Describe your ideal resolution..."
                value={formData.partyBMiracle}
                onChange={(value) => updateFormData("partyBMiracle", value)}
                type="textarea"
                rows={4}
              />
            </div>

            <div className="form-grid form-grid-2">
              <FormField
                id="partyATop3Solutions"
                label={`${formData.partyAName || "Party A"} - Top 3 Solutions`}
                placeholder="List your top 3 preferred solutions..."
                value={formData.partyATop3Solutions}
                onChange={(value) =>
                  updateFormData("partyATop3Solutions", value)
                }
                type="textarea"
                rows={4}
              />
              <FormField
                id="partyBTop3Solutions"
                label={`${formData.partyBName || "Party B"} - Top 3 Solutions`}
                placeholder="List your top 3 preferred solutions..."
                value={formData.partyBTop3Solutions}
                onChange={(value) =>
                  updateFormData("partyBTop3Solutions", value)
                }
                type="textarea"
                rows={4}
              />
            </div>

            <SectionSeparator title="Understanding Each Other" />

            <div className="form-grid form-grid-2">
              <FormField
                id="partyAPerspective"
                label={`${
                  formData.partyAName || "Party A"
                } - Other's Perspective`}
                description="Try to understand the other person's point of view."
                placeholder="What might the other person be thinking or feeling?"
                value={formData.partyAPerspective}
                onChange={(value) => updateFormData("partyAPerspective", value)}
                type="textarea"
                rows={3}
              />
              <FormField
                id="partyBPerspective"
                label={`${
                  formData.partyBName || "Party B"
                } - Other's Perspective`}
                description="Try to understand the other person's point of view."
                placeholder="What might the other person be thinking or feeling?"
                value={formData.partyBPerspective}
                onChange={(value) => updateFormData("partyBPerspective", value)}
                type="textarea"
                rows={3}
              />
            </div>

            <FormField
              id="compromiseSolutions"
              label="Compromise Solutions"
              description="What solutions can you both agree on? What compromises are you willing to make?"
              placeholder="Describe the solutions you both can accept..."
              value={formData.compromiseSolutions}
              onChange={(value) => updateFormData("compromiseSolutions", value)}
              type="textarea"
              rows={4}
            />
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-4 sm:space-y-6">
          <SectionSeparator title="Agreement & Action Steps" />
          <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Finalize your agreement and create actionable next steps.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div className="form-grid form-grid-2">
              <FormField
                id="partyAUnmetNeeds"
                label={`${formData.partyAName || "Party A"} - Unmet Needs`}
                description="What needs of yours weren't being met in this situation?"
                placeholder="Describe your unmet needs..."
                value={formData.partyAUnmetNeeds}
                onChange={(value) => updateFormData("partyAUnmetNeeds", value)}
                type="textarea"
                rows={3}
              />
              <FormField
                id="partyBUnmetNeeds"
                label={`${formData.partyBName || "Party B"} - Unmet Needs`}
                description="What needs of yours weren't being met in this situation?"
                placeholder="Describe your unmet needs..."
                value={formData.partyBUnmetNeeds}
                onChange={(value) => updateFormData("partyBUnmetNeeds", value)}
                type="textarea"
                rows={3}
              />
            </div>

            <div className="form-grid form-grid-2">
              <FormField
                id="partyANeedsInPractice"
                label={`${
                  formData.partyAName || "Party A"
                } - Needs in Practice`}
                description="How can these needs be met going forward?"
                placeholder="Practical ways to meet your needs..."
                value={formData.partyANeedsInPractice}
                onChange={(value) =>
                  updateFormData("partyANeedsInPractice", value)
                }
                type="textarea"
                rows={3}
              />
              <FormField
                id="partyBNeedsInPractice"
                label={`${
                  formData.partyBName || "Party B"
                } - Needs in Practice`}
                description="How can these needs be met going forward?"
                placeholder="Practical ways to meet your needs..."
                value={formData.partyBNeedsInPractice}
                onChange={(value) =>
                  updateFormData("partyBNeedsInPractice", value)
                }
                type="textarea"
                rows={3}
              />
            </div>

            <FormField
              id="actionSteps"
              label="Specific Action Steps"
              description="What specific actions will each person take? Include deadlines and accountability measures."
              placeholder="List specific, measurable action steps with deadlines..."
              value={formData.actionSteps}
              onChange={(value) => updateFormData("actionSteps", value)}
              type="textarea"
              rows={5}
            />

            <div className="form-grid form-grid-2">
              <FormField
                id="followUpDate"
                label="Follow-up Date"
                description="When should you check in on progress?"
                type="date"
                value={formData.followUpDate}
                onChange={(value) => updateFormData("followUpDate", value)}
              />
              <FormField
                id="additionalSupport"
                label="Additional Support Needed"
                description="What additional resources or support might be helpful?"
                placeholder="Describe any additional support needed..."
                value={formData.additionalSupport}
                onChange={(value) => updateFormData("additionalSupport", value)}
                type="textarea"
                rows={3}
              />
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-4 sm:space-y-6">
          <SectionSeparator title="Export Your Session" />
          <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Congratulations! You've completed the conflict mediation process.
            Export your session data to save your work and share with others.
          </p>

          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                Session Summary
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your mediation session included{" "}
                {formData.partyAName || "Party A"} and{" "}
                {formData.partyBName || "Party B"}
              </p>
              {formData.dateOfMediation && (
                <p className="text-sm sm:text-base text-muted-foreground">
                  Mediation Date:{" "}
                  {new Date(formData.dateOfMediation).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <h4 className="text-base font-semibold">Export Options</h4>
                <div className="space-y-3">
                  <Button
                    onClick={onExportJSON}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-12"
                  >
                    <Download className="h-4 w-4" />
                    Export as JSON
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Download all session data in JSON format for backup or
                    import into other systems.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-semibold">Generate Report</h4>
                <div className="space-y-3">
                  <Button
                    onClick={() => generateEnhancedPDF(formData)}
                    className="w-full flex items-center justify-center gap-2 h-12"
                  >
                    <FileText className="h-4 w-4" />
                    Export as PDF
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Create a professional PDF report of your mediation session
                    for sharing or documentation.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
              <div className="text-center space-y-3">
                <h4 className="text-base font-semibold">What's Next?</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Review your action steps and follow-up date</p>
                  <p>• Schedule your follow-up meeting</p>
                  <p>• Continue open communication between parties</p>
                  <p>• Consider additional support if needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return <div>Invalid step</div>;
  }
};

export default StepContent;
