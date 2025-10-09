import React, { useEffect, useState } from "react";
import DarkModeToggle from "./components/DarkModeToggle";
import ParticleBackground from "./components/ParticleBackground";
import ProgressHeader from "./components/ProgressHeader";
import CategoryNavigation from "./components/CategoryNavigation";
import NavigationButtons from "./components/NavigationButtons";
import CardStack from "./components/CardStack";
import StepContent from "./components/StepContent";
import { useFormData } from "./hooks/useFormData";
import { useNavigation } from "./hooks/useNavigation";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { ERROR_MESSAGES, createValidationError, logError } from "./utils/errorMessages";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  // Form data management
  const { formData, updateFormData, updateMultipleFields, isStepComplete, loadedFromStorage, resetFormData, getRequiredFieldsForStep, getMissingFieldsForStep } = useFormData();

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
  }, [isAnimating, navigateToStep, isStepComplete, currentStep, getMissingFieldsForStep]);

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

  // Calculate field completion statistics
  const getCompletedFieldsCount = () => {
    const allFields = Object.keys(formData);
    return allFields.filter(field => {
      const value = formData[field];
      if (Array.isArray(value)) {
        return value.length > 0 && value.every(item => 
          typeof item === 'string' ? item.trim() !== '' : 
          typeof item === 'object' ? item.text && item.text.trim() !== '' : false
        );
      }
      return value && value.toString().trim() !== "";
    }).length;
  };

  const getTotalFieldsCount = () => {
    return Object.keys(formData).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <ParticleBackground />
      <DarkModeToggle />

      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
            <img src={logo} alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12" />
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Co-op Conflict Resolution Platform
              </h1>
              <p className="text-primary-foreground/80 mt-1 sm:mt-2 text-sm sm:text-base">
                A structured approach to resolving interpersonal conflicts
              </p>
            </div>
          </div>
        </div>
      </div>

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

        {/* Progress Header */}
        <ProgressHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          formData={formData}
          completedFields={getCompletedFieldsCount()}
          totalFields={getTotalFieldsCount()}
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

        {/* Navigation instructions */}
        <div className="text-center text-xs text-muted-foreground mt-4 space-y-1">
          <div className="hidden sm:block">
            💡 Desktop: Use arrow keys ← →, click navigation buttons, or drag
            cards to navigate
          </div>
          <div className="sm:hidden">
            💡 Mobile: Swipe left/right to navigate
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
