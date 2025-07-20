import React from "react";
import DarkModeToggle from "./components/DarkModeToggle";
import ParticleBackground from "./components/ParticleBackground";
import ProgressHeader from "./components/ProgressHeader";
import NavigationButtons from "./components/NavigationButtons";
import CardStack from "./components/CardStack";
import StepContent from "./components/StepContent";
import { useFormData } from "./hooks/useFormData";
import { useNavigation } from "./hooks/useNavigation";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  // Form data management
  const { formData, updateFormData } = useFormData();

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
        onExportJSON={exportToJSON}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
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
        {/* Progress Header */}
        <ProgressHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          formData={formData}
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
          onNavigate={navigateToStep}
          isAnimating={isAnimating}
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
