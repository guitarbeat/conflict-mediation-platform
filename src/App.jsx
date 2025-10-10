import React, { useEffect, useState } from "react";
import DarkModeToggle from "./components/DarkModeToggle";
import CategoryNavigation from "./components/CategoryNavigation";
import NavigationButtons from "./components/NavigationButtons";
import CardStack from "./components/CardStack";
import StepContent from "./components/StepContent";
import { useFormData } from "./hooks/useFormData";
import { useNavigation } from "./hooks/useNavigation";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { ERROR_MESSAGES, createValidationError, logError } from "./utils/errorMessages";
import { Analytics } from "@vercel/analytics/react";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  // Form data management
  const { formData, updateFormData, updateMultipleFields, isStepComplete, loadedFromStorage, resetFormData, getRequiredFieldsForStep } = useFormData();

  const [showStepErrors, setShowStepErrors] = useState(false);

  // Navigation management
  const {
    currentStep,
    dragOffset,
    animatingCard,
    animationType,
    isDragging,
    isAnimating,
    TOTAL_STEPS,
    navigateToStep,
    handleInputStart,
    handleInputMove,
    handleInputEnd,
    handleMouseLeave,
  } = useNavigation();

  // Keyboard navigation: Left/Right arrows
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isAnimating) return;
      const target = e.target;
      const isFormElement = target && (target.closest?.("input, textarea, select, [contenteditable=true]"));
      if (isFormElement) return;
      if (e.key === "ArrowRight") {
        if (isStepComplete(currentStep)) {
          setShowStepErrors(false);
          navigateToStep("next");
        } else {
          setShowStepErrors(true);
          const missingFields = getMissingFieldsForStep(currentStep);
          const errorMessage = missingFields.length > 0 
            ? `Please complete the following required fields: ${missingFields.join(', ')}`
            : ERROR_MESSAGES.VALIDATION.STEP_INCOMPLETE(currentStep);
          toast.error(errorMessage);
        }
      } else if (e.key === "ArrowLeft") {
        navigateToStep("prev");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAnimating, navigateToStep, isStepComplete, currentStep]);

  const handleNavigate = (direction) => {
    if (direction === "next") {
      if (!isStepComplete(currentStep)) {
        setShowStepErrors(true);
        const missingFields = getMissingFieldsForStep(currentStep);
        const errorMessage = missingFields.length > 0 
          ? `Please complete the following required fields: ${missingFields.join(', ')}`
          : ERROR_MESSAGES.VALIDATION.STEP_INCOMPLETE(currentStep);
        toast.error(errorMessage);
        return;
      }
    }
    setShowStepErrors(false);
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
        showErrors={showStepErrors}
        getRequiredFieldsForStep={getRequiredFieldsForStep}
      />
    );
  };

  const canGoNext = isStepComplete(currentStep);


  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <DarkModeToggle />


      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-4xl">
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
            if (step <= currentStep + 1) {
              navigateToStep(step);
            }
          }}
        />


        {/* Card Stack */}
        <CardStack
          totalSteps={TOTAL_STEPS}
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
          totalSteps={TOTAL_STEPS}
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
