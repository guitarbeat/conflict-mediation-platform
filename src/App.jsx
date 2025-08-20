import React, { useEffect } from "react";
import DarkModeToggle from "./components/DarkModeToggle";
import ParticleBackground from "./components/ParticleBackground";
import ProgressHeader from "./components/ProgressHeader";
import NavigationButtons from "./components/NavigationButtons";
import CardStack from "./components/CardStack";
import StepContent from "./components/StepContent";
import PremiumUXPrototype from "./components/PremiumUXPrototype";
import { useFormData } from "./hooks/useFormData";
import { useNavigation } from "./hooks/useNavigation";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import logo from "./assets/logo.png";
import "./App.css";
import "./styles/design-system.css";
import "./styles/interactions.css";

function App() {
  // Form data management
  const { formData, updateFormData, updateMultipleFields, isStepComplete, loadedFromStorage, resetFormData } = useFormData();

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
        if (isStepComplete(currentStep)) navigateToStep("next");
        else toast.error("Please complete the required fields before continuing.");
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
        toast.error("Please complete the required fields before continuing.");
        return;
      }
    }
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
      />
    );
  };

  const canGoNext = isStepComplete(currentStep);

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
              <h1 className="text-heading-lg sm:text-display-xl font-bold">
                Conflict Mediation
              </h1>
              <p className="text-body-sm sm:text-body-md opacity-90">
                Professional conflict resolution services
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <ProgressHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          isStepComplete={isStepComplete}
        />

        <CardStack
          currentStep={currentStep}
          dragOffset={dragOffset}
          animatingCard={animatingCard}
          animationType={animationType}
          isDragging={isDragging}
          isAnimating={isAnimating}
          onInputStart={handleInputStart}
          onInputMove={handleInputMove}
          onInputEnd={handleInputEnd}
          onMouseLeave={handleMouseLeave}
        >
          {renderStepContent(currentStep)}
        </CardStack>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          canGoNext={canGoNext}
          onNavigate={handleNavigate}
          isAnimating={isAnimating}
        />
      </div>

      {/* Premium UX Prototype Section */}
      <div className="border-t border-border mt-16 pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-display-xl text-primary-700 mb-4">
              Enhanced User Experience
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              Experience our premium design system with enhanced interactions, 
              accessibility features, and optimized user flows.
            </p>
          </div>
          
          <PremiumUXPrototype />
        </div>
      </div>
    </div>
  );
}

export default App;
