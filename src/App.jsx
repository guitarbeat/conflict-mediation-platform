import React, { useCallback, useEffect, useMemo, useState } from "react";
import DarkModeToggle from "./components/DarkModeToggle";
import CategoryNavigation from "./components/CategoryNavigation";
import NavigationButtons from "./components/NavigationButtons";
import CardStack from "./components/CardStack";
import StepContent from "./components/StepContent";
import { useFormData } from "./hooks/useFormData";
import { useNavigation } from "./hooks/useNavigation";
import { Toaster } from "./components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { toast } from "sonner";
import logo from "./assets/logo.png";
import { SURVEY_CATEGORIES } from "./config/surveyCategories";
import "./App.css";

const TOTAL_SURVEY_STEPS =
  Object.values(SURVEY_CATEGORIES)
    .flatMap((category) => category.steps)
    .reduce((highest, step) => Math.max(highest, step), 0) || 1;

const FIELD_LABELS = {
  partyAName: "Party A Name",
  partyBName: "Party B Name",
  conflictDescription: "Conflict Description",
  partyAThoughts: "Party A - Thoughts",
  partyAAssertiveApproach: "Party A - Assertive Approach",
  partyBThoughts: "Party B - Thoughts",
  partyBAssertiveApproach: "Party B - Assertive Approach",
  activatingEvent: "Activating Event",
  partyABeliefs: "Party A - Beliefs",
  partyBBeliefs: "Party B - Beliefs",
  partyAMiracle: "Party A - Miracle Response",
  partyBMiracle: "Party B - Miracle Response",
  compromiseSolutions: "Compromise Solutions",
  partyATop3Solutions: "Party A - Top Solutions",
  partyBTop3Solutions: "Party B - Top Solutions",
  actionSteps: "Action Steps",
  followUpDate: "Follow-up Date",
};

function App() {
  // Form data management
  const {
    formData,
    updateFormData,
    updateMultipleFields,
    loadedFromStorage,
    resetFormData,
    getRequiredFieldsForStep,
    isStepComplete,
    getMissingFieldsForStep,
  } = useFormData();

  const [errorStep, setErrorStep] = useState(null);

  const navigationGuard = useCallback(
    ({ currentStep: step, direction }) => {
      if (direction === "forward" && !isStepComplete(step)) {
        setErrorStep(step);
        const missingFields = getMissingFieldsForStep(step);
        if (missingFields.length > 0) {
          const fieldNames = missingFields
            .map((field) => FIELD_LABELS[field] ?? field)
            .join(", ");
          toast.error(
            `Complete the required fields before continuing: ${fieldNames}`,
          );
        } else {
          toast.error("Complete the required fields before continuing.");
        }
        return false;
      }

      if (direction === "backward") {
        setErrorStep(null);
      }

      return true;
    },
    [getMissingFieldsForStep, isStepComplete],
  );

  // Navigation management
  const {
    currentStep,
    dragOffset,
    animatingCard,
    animationType,
    isDragging,
    isAnimating,
    totalSteps,
    navigateToStep,
    handleInputStart,
    handleInputMove,
    handleInputEnd,
    handleMouseLeave,
  } = useNavigation({
    canNavigateToStep: navigationGuard,
    totalSteps: TOTAL_SURVEY_STEPS,
  });

  const canGoNext = useMemo(
    () => isStepComplete(currentStep),
    [currentStep, isStepComplete],
  );

  useEffect(() => {
    if (canGoNext && errorStep === currentStep) {
      setErrorStep(null);
    }
  }, [canGoNext, currentStep, errorStep]);

  // Keyboard navigation: Left/Right arrows
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isAnimating) return;
      const target = e.target;
      const isFormElement = target && (target.closest?.("input, textarea, select, [contenteditable=true]"));
      if (isFormElement) return;
      if (e.key === "ArrowRight") {
        navigateToStep("next");
      } else if (e.key === "ArrowLeft") {
        navigateToStep("prev");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAnimating, navigateToStep]);

  const handleNavigate = (direction) => {
    navigateToStep(direction);
  };

  // Export functions
  const exportToJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `conflict-mediation-${
      new Date().toISOString().split("T")[0]
    }.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const renderStepContent = (step) => {
    return (
      <StepContent
        step={step}
        formData={formData}
        updateFormData={updateFormData}
        updateMultipleFields={updateMultipleFields}
        onExportJSON={exportToJSON}
        showErrors={errorStep === step}
        getRequiredFieldsForStep={getRequiredFieldsForStep}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <DarkModeToggle />

      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 px-3 sm:px-6 py-4 max-w-4xl">
          <img
            src={logo}
            alt="Co-op logo"
            className="h-12 w-12 rounded-md border border-border bg-background object-contain"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
              Co-op Conflict Resolution Platform
            </h1>
            <p className="text-sm text-muted-foreground">
              Guide teams through mediation steps and capture agreements with confidence.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full px-3 sm:px-4 py-2 sm:py-4 pb-28 sm:pb-6 max-w-4xl">
        {loadedFromStorage && (
          <div className="mb-3 px-3 py-2 rounded-md bg-muted/40 border border-border text-xs sm:text-sm flex items-center justify-between">
            <span>Resumed a previously saved session from this device.</span>
            <button onClick={resetFormData} className="underline text-primary">Reset</button>
          </div>
        )}

        {/* Category Navigation */}
        <CategoryNavigation
          formData={formData}
          currentStep={currentStep}
          onNavigateToStep={(step) => {
            navigateToStep(step);
          }}
        />


        {/* Card Stack */}
        <CardStack
          totalSteps={totalSteps}
          currentStep={currentStep}
          dragOffset={dragOffset}
          animatingCard={animatingCard}
          animationType={animationType}
          isDragging={isDragging}
          onInputStart={handleInputStart}
          onInputMove={handleInputMove}
          onInputEnd={handleInputEnd}
          onMouseLeave={handleMouseLeave}
          renderStepContent={renderStepContent}
        />

        {/* Navigation Buttons */}
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNavigate={handleNavigate}
          isAnimating={isAnimating}
          canGoNext={canGoNext}
        />

      </div>
      <Analytics />
    </div>
  );
}

export default App;
