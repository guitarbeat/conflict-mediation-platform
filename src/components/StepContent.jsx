import React, { Suspense, useEffect } from "react";
import { Download, FileText, Upload } from "lucide-react";
import { Button } from "./ui/button";
import FormField from "./FormField";
import EnhancedFormField from "./EnhancedFormField";
import DatePickerField from "./DatePickerField";
import SectionSeparator from "./SectionSeparator";
import { MultiSelectInput, RatingInput, StructuredListInput, PriorityInput } from "./AdvancedInputs";
// Lazy-load heavy component
const EmojiGridMapper = React.lazy(() => import("./EmojiGridMapper"));
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getCategoryByStep } from "../config/surveyCategories";

// * Category Header component
const CategoryHeader = ({ step }) => {
  const category = getCategoryByStep(step);
  
  if (!category) return null;
  
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{category.icon}</span>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{category.name}</h2>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>
    </div>
  );
};

// * Communication Approaches component - moved outside to prevent recreation
const CommunicationApproaches = ({ prefix, formData, updateFormData, isFieldMissing, context }) => (
  <div className="space-y-4 sm:space-y-6">
    <label className="form-label">I want... (Communication Approaches)</label>
    <EnhancedFormField
      id={`${prefix}AggressiveApproach`}
      label="Aggressive Approach (Not Recommended)"
      placeholder="What would you want to say if you were being aggressive?"
      value={formData[`${prefix}AggressiveApproach`]}
      onChange={(value) => updateFormData(`${prefix}AggressiveApproach`, value)}
      type="textarea"
      className="text-red-600"
      description="This approach is not recommended as it can escalate conflict"
      showCharacterCount={true}
      maxLength={500}
    />
    <EnhancedFormField
      id={`${prefix}PassiveApproach`}
      label="Passive Approach"
      placeholder="What would you want if you were being passive?"
      value={formData[`${prefix}PassiveApproach`]}
      onChange={(value) => updateFormData(`${prefix}PassiveApproach`, value)}
      type="textarea"
      className="text-blue-600"
      description="This approach avoids conflict but may not address underlying issues"
      showCharacterCount={true}
      maxLength={500}
    />
    <EnhancedFormField
      id={`${prefix}AssertiveApproach`}
      label="Assertive Approach (Recommended)"
      placeholder="What would you want to say if you were being assertive and respectful?"
      value={formData[`${prefix}AssertiveApproach`]}
      onChange={(value) => updateFormData(`${prefix}AssertiveApproach`, value)}
      type="textarea"
      className="text-green-600"
      error={isFieldMissing(`${prefix}AssertiveApproach`) ? "Required" : ""}
      description="This approach is recommended for healthy conflict resolution"
      showCharacterCount={true}
      maxLength={500}
      smartSuggestions={true}
      fieldType="assertiveApproach"
      context={context}
      showContextualHelp={true}
    />
    <EnhancedFormField
      id={`${prefix}WhyBecause`}
      label="Why/Because..."
      placeholder="Explain your reasoning..."
      value={formData[`${prefix}WhyBecause`]}
      onChange={(value) => updateFormData(`${prefix}WhyBecause`, value)}
      type="textarea"
      description="Explain the reasoning behind your assertive approach"
      showCharacterCount={true}
      maxLength={300}
    />
  </div>
);

// * Individual Reflection component - moved outside to prevent recreation
const IndividualReflection = ({ party, prefix, formData, updateFormData, isFieldMissing, context }) => (
  <div className="space-y-4 sm:space-y-6">
    <SectionSeparator title="Thoughts & Beliefs" />
    <EnhancedFormField
      id={`${prefix}Thoughts`}
      label="I think..."
      placeholder="Explain what you think or believe to be true about the conflict..."
      value={formData[`${prefix}Thoughts`]}
      onChange={(value) => updateFormData(`${prefix}Thoughts`, value)}
      type="textarea"
      rows={4}
      error={isFieldMissing(`${prefix}Thoughts`) ? "Required" : ""}
      description="Be honest about your beliefs and assumptions about the situation"
      showCharacterCount={true}
      maxLength={1000}
      smartSuggestions={true}
      fieldType="thoughts"
      context={context}
      showContextualHelp={true}
    />

    <SectionSeparator title="Emotions & Feelings" />
    <div className="space-y-3 sm:space-y-4">
      <label className="form-label">
        I feel... (Use both methods to express your emotions)
      </label>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading emotion mapper…</div>}>
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
      </Suspense>
    </div>

    <SectionSeparator title="Communication Approaches" />
    <CommunicationApproaches
      party={party}
      prefix={prefix}
      formData={formData}
      updateFormData={updateFormData}
      isFieldMissing={isFieldMissing}
      context={context}
    />
  </div>
);

const Step1Schema = z.object({
  partyAName: z.string().min(1, "Required"),
  partyBName: z.string().min(1, "Required"),
  conflictDescription: z.string().min(1, "Required"),
  dateOfIncident: z.string().optional(),
  dateOfMediation: z.string().optional(),
  locationOfConflict: z.string().optional(),
});

const StepContent = ({ step, formData, updateFormData, updateMultipleFields, onExportJSON, showErrors, getRequiredFieldsForStep }) => {
  // Create context for smart suggestions
  const context = {
    partyAName: formData.partyAName,
    partyBName: formData.partyBName,
    currentStep: step,
  };
  // react-hook-form for Step 1
  const step1Form = useForm({
    mode: "onChange",
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      partyAName: formData.partyAName,
      partyBName: formData.partyBName,
      conflictDescription: formData.conflictDescription,
      dateOfIncident: formData.dateOfIncident,
      dateOfMediation: formData.dateOfMediation,
      locationOfConflict: formData.locationOfConflict,
    },
  });

  const step1Errors = step1Form.formState.errors;

  useEffect(() => {
    if (showErrors && step === 1) {
      step1Form.trigger();
    }
  }, [showErrors, step, step1Form]);

  const requiredFields = getRequiredFieldsForStep(step);
  const isFieldMissing = (field) => {
    if (!showErrors || !requiredFields.includes(field)) return false;
    const value = formData[field];
    if (Array.isArray(value)) return value.length === 0;
    return !value || value.toString().trim() === "";
  };

  const TwoColumnFields = ({ fields }) => (
    <div className="form-grid form-grid-2">
      {fields.map((field) => (
        <FormField key={field.id} {...field} />
      ))}
    </div>
  );

  const handleImportJSON = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const allowedKeys = Object.keys(formData);
      const sanitized = Object.fromEntries(
        Object.entries(parsed).filter(([k]) => allowedKeys.includes(k))
      );
      updateMultipleFields(sanitized);
      toast.success("Session imported successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to import JSON. Please check the file format.");
    }
  };

  switch (step) {
    case 1:
      return (
        <div className="space-y-2 sm:space-y-3">
          <CategoryHeader step={step} />
          <SectionSeparator title="Party Information" />
          <p className="text-center text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base">
            Let's start by gathering some basic information about the conflict
            and the parties involved.
          </p>
          <div className="form-grid form-grid-2">
            <EnhancedFormField
              id="partyAName"
              label="Party A Name"
              placeholder="Enter first person's name"
              value={step1Form.watch("partyAName")}
              onChange={(value) => {
                step1Form.setValue("partyAName", value, { shouldValidate: true, shouldDirty: true });
                updateFormData("partyAName", value);
              }}
              error={step1Errors.partyAName?.message}
              required={true}
              description="The first person involved in the conflict"
              autoSave={true}
            />
            <EnhancedFormField
              id="partyBName"
              label="Party B Name"
              placeholder="Enter second person's name"
              value={step1Form.watch("partyBName")}
              onChange={(value) => {
                step1Form.setValue("partyBName", value, { shouldValidate: true, shouldDirty: true });
                updateFormData("partyBName", value);
              }}
              error={step1Errors.partyBName?.message}
              required={true}
              description="The second person involved in the conflict"
              autoSave={true}
            />
          </div>

          <SectionSeparator title="Conflict Details" />
          <div className="form-grid form-grid-3">
            <DatePickerField
              id="dateOfIncident"
              label="Date of Incident"
              value={step1Form.watch("dateOfIncident")}
              onChange={(value) => {
                step1Form.setValue("dateOfIncident", value, { shouldDirty: true });
                updateFormData("dateOfIncident", value);
              }}
            />
            <DatePickerField
              id="dateOfMediation"
              label="Date of Mediation"
              value={step1Form.watch("dateOfMediation")}
              onChange={(value) => {
                step1Form.setValue("dateOfMediation", value, { shouldDirty: true });
                updateFormData("dateOfMediation", value);
              }}
            />
            <FormField
              id="locationOfConflict"
              label="Location of Conflict"
              placeholder="Where did this happen?"
              value={step1Form.watch("locationOfConflict")}
              onChange={(value) => {
                step1Form.setValue("locationOfConflict", value, { shouldDirty: true });
                updateFormData("locationOfConflict", value);
              }}
            />
          </div>

          <EnhancedFormField
            id="conflictDescription"
            label="Agreed Upon Description of Conflict"
            placeholder="Both parties should agree on this description of what happened..."
            value={step1Form.watch("conflictDescription")}
            onChange={(value) => {
              step1Form.setValue("conflictDescription", value, { shouldValidate: true, shouldDirty: true });
              updateFormData("conflictDescription", value);
            }}
            type="textarea"
            rows={4}
            error={step1Errors.conflictDescription?.message}
            required={true}
            description="Both parties should agree on this factual description of the conflict"
            showCharacterCount={true}
            maxLength={2000}
            smartSuggestions={true}
            fieldType="conflictDescription"
            context={context}
            showContextualHelp={true}
            autoSave={true}
          />
        </div>
      );

    case 2:
      return (
        <div className="space-y-4 sm:space-y-6">
          <CategoryHeader step={step} />
          <IndividualReflection
            party="A"
            prefix="partyA"
            formData={formData}
            updateFormData={updateFormData}
            isFieldMissing={isFieldMissing}
            context={context}
          />
        </div>
      );

    case 3:
      return (
        <div className="space-y-4 sm:space-y-6">
          <CategoryHeader step={step} />
          <IndividualReflection
            party="B"
            prefix="partyB"
            formData={formData}
            updateFormData={updateFormData}
            isFieldMissing={isFieldMissing}
            context={context}
          />
        </div>
      );

    case 4:
      return (
        <div className="space-y-4 sm:space-y-6">
          <CategoryHeader step={step} />
          <SectionSeparator title="ABCDE Model Discussion" />
          <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Work through this cognitive behavioral model together to understand
            the conflict better.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <EnhancedFormField
              id="activatingEvent"
              label="A - Activating Event"
              description="What actually happened? Stick to observable facts."
              placeholder="Describe the factual events that triggered this conflict..."
              value={formData.activatingEvent}
              onChange={(value) => updateFormData("activatingEvent", value)}
              type="textarea"
              rows={3}
              required={true}
              showCharacterCount={true}
              maxLength={1000}
              smartSuggestions={true}
              fieldType="activatingEvent"
              context={context}
              showContextualHelp={true}
            />

            <div className="form-grid form-grid-2">
              <EnhancedFormField
                id="partyABeliefs"
                label={`B - ${formData.partyAName || "Party A"} Beliefs`}
                description="What thoughts or beliefs do you have about this event?"
                placeholder="Your thoughts and beliefs about what happened..."
                value={formData.partyABeliefs}
                onChange={(value) => updateFormData("partyABeliefs", value)}
                type="textarea"
                rows={3}
                required={true}
                showCharacterCount={true}
                maxLength={800}
                smartSuggestions={true}
                fieldType="thoughts"
                context={context}
              />
              <EnhancedFormField
                id="partyBBeliefs"
                label={`B - ${formData.partyBName || "Party B"} Beliefs`}
                description="What thoughts or beliefs do you have about this event?"
                placeholder="Your thoughts and beliefs about what happened..."
                value={formData.partyBBeliefs}
                onChange={(value) => updateFormData("partyBBeliefs", value)}
                type="textarea"
                rows={3}
                required={true}
                showCharacterCount={true}
                maxLength={800}
                smartSuggestions={true}
                fieldType="thoughts"
                context={context}
              />
            </div>

            <div className="form-grid form-grid-2">
              <EnhancedFormField
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
                showCharacterCount={true}
                maxLength={600}
              />
              <EnhancedFormField
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
                showCharacterCount={true}
                maxLength={600}
              />
            </div>

            <div className="form-grid form-grid-2">
              <EnhancedFormField
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
                showCharacterCount={true}
                maxLength={600}
              />
              <EnhancedFormField
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
                showCharacterCount={true}
                maxLength={600}
              />
            </div>

            <EnhancedFormField
              id="effectsReflections"
              label="E - Effects & Reflections"
              description="What new insights have emerged? How do you both feel now?"
              placeholder="Reflect on new perspectives and feelings that have emerged..."
              value={formData.effectsReflections}
              onChange={(value) => updateFormData("effectsReflections", value)}
              type="textarea"
              rows={4}
              showCharacterCount={true}
              maxLength={1000}
            />
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-4 sm:space-y-6">
          <CategoryHeader step={step} />
          <SectionSeparator title="Solution Development" />
          <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Now let's explore possibilities and develop solutions together.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div className="form-grid form-grid-2">
              <EnhancedFormField
                id="partyAMiracle"
                label={`${formData.partyAName || "Party A"} - Miracle Question`}
                description="If you woke up tomorrow and this conflict was completely resolved, what would be different?"
                placeholder="Describe your ideal resolution..."
                value={formData.partyAMiracle}
                onChange={(value) => updateFormData("partyAMiracle", value)}
                type="textarea"
                rows={4}
                required={true}
                showCharacterCount={true}
                maxLength={1000}
                smartSuggestions={true}
                fieldType="miracleQuestion"
                context={context}
                showContextualHelp={true}
              />
              <EnhancedFormField
                id="partyBMiracle"
                label={`${formData.partyBName || "Party B"} - Miracle Question`}
                description="If you woke up tomorrow and this conflict was completely resolved, what would be different?"
                placeholder="Describe your ideal resolution..."
                value={formData.partyBMiracle}
                onChange={(value) => updateFormData("partyBMiracle", value)}
                type="textarea"
                rows={4}
                required={true}
                showCharacterCount={true}
                maxLength={1000}
                smartSuggestions={true}
                fieldType="miracleQuestion"
                context={context}
                showContextualHelp={true}
              />
            </div>

            <div className="form-grid form-grid-2">
              <StructuredListInput
                id="partyATop3Solutions"
                label={`${formData.partyAName || "Party A"} - Top 3 Solutions`}
                placeholder="Add solution..."
                itemPlaceholder="Enter a solution..."
                value={formData.partyATop3Solutions || []}
                onChange={(value) => updateFormData("partyATop3Solutions", value)}
                maxItems={3}
                itemType="text"
                description="List your top 3 preferred solutions for resolving this conflict"
              />
              <StructuredListInput
                id="partyBTop3Solutions"
                label={`${formData.partyBName || "Party B"} - Top 3 Solutions`}
                placeholder="Add solution..."
                itemPlaceholder="Enter a solution..."
                value={formData.partyBTop3Solutions || []}
                onChange={(value) => updateFormData("partyBTop3Solutions", value)}
                maxItems={3}
                itemType="text"
                description="List your top 3 preferred solutions for resolving this conflict"
              />
            </div>

            <SectionSeparator title="Understanding Each Other" />

            <div className="form-grid form-grid-2">
              <EnhancedFormField
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
                showCharacterCount={true}
                maxLength={600}
              />
              <EnhancedFormField
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
                showCharacterCount={true}
                maxLength={600}
              />
            </div>

            <EnhancedFormField
              id="compromiseSolutions"
              label="Compromise Solutions"
              description="What solutions can you both agree on? What compromises are you willing to make?"
              placeholder="Describe the solutions you both can accept..."
              value={formData.compromiseSolutions}
              onChange={(value) => updateFormData("compromiseSolutions", value)}
              type="textarea"
              rows={4}
              required={true}
              showCharacterCount={true}
              maxLength={1000}
              smartSuggestions={true}
              fieldType="solutions"
              context={context}
              showContextualHelp={true}
            />
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-4 sm:space-y-6">
          <CategoryHeader step={step} />
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

            <StructuredListInput
              id="actionSteps"
              label="Specific Action Steps"
              description="What specific actions will each person take? Include deadlines and accountability measures."
              placeholder="Add action step..."
              itemPlaceholder="Enter action step with deadline..."
              value={formData.actionSteps || []}
              onChange={(value) => updateFormData("actionSteps", value)}
              itemType="textarea"
              allowReorder={true}
            />

            <div className="form-grid form-grid-2">
              <EnhancedFormField
                id="followUpDate"
                label="Follow-up Date"
                description="When should you check in on progress?"
                type="date"
                value={formData.followUpDate}
                onChange={(value) => updateFormData("followUpDate", value)}
                required={true}
              />
              <EnhancedFormField
                id="additionalSupport"
                label="Additional Support Needed"
                description="What additional resources or support might be helpful?"
                placeholder="Describe any additional support needed..."
                value={formData.additionalSupport}
                onChange={(value) => updateFormData("additionalSupport", value)}
                type="textarea"
                rows={3}
                showCharacterCount={true}
                maxLength={500}
              />
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-4 sm:space-y-6">
          <CategoryHeader step={step} />
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
                    onClick={async () => {
                      const { generateEnhancedPDF } = await import("../utils/pdfGenerator");
                      generateEnhancedPDF(formData);
                    }}
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

            <div className="space-y-4">
              <h4 className="text-base font-semibold">Import Session</h4>
              <div className="flex items-center gap-3">
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => handleImportJSON(e.target.files?.[0])}
                  />
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import from JSON
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground">
                  Load a previously saved JSON file to restore your session.
                </p>
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
