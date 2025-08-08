import React from "react";
import { Users } from "lucide-react";

const STEPS = [
  "Setup",
  "Individual Reflection - Party A",
  "Individual Reflection - Party B",
  "Shared Discussion (ABCDE)",
  "Solution Development",
  "Agreement & Action Steps",
  "Export & Save",
];

const ProgressHeader = ({ currentStep, totalSteps, formData }) => {
  const getStepDescription = (step) => {
    switch (step) {
      case 1:
        return "Both parties, please fill out this section together.";
      case 2:
        return `${
          formData.partyAName || "Party A"
        }, please complete this section individually.`;
      case 3:
        return `${
          formData.partyBName || "Party B"
        }, please complete this section individually.`;
      case 4:
        return "Both parties, please discuss and fill out this section together using the ABCDE model.";
      case 5:
        return "Both parties, please work together to develop solutions and explore possibilities.";
      case 6:
        return "Both parties, finalize your agreement and create actionable next steps.";
      case 7:
        return "Export a PDF or JSON, or import a previous session to continue.";
      default:
        return "";
    }
  };

  const isIndividualStep = currentStep === 2 || currentStep === 3;

  return (
    <div className="mb-3">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {STEPS[currentStep - 1]}
            </h2>
            <p className="text-sm text-muted-foreground">
              {getStepDescription(currentStep)}
            </p>
          </div>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
          {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Privacy notice for individual sections */}
      {isIndividualStep && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
          <span>🔒</span>
          <span>
            Private reflection space - other party should not view until shared
            discussion.
          </span>
        </div>
      )}

      {/* Elegant Progress Bar */}
      <div className="relative mt-3">
        <div className="flex items-center">
          {STEPS.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  index + 1 <= currentStep
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-2 relative">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-primary rounded-full transition-all duration-700 ease-out ${
                        index + 1 < currentStep ? "w-full" : "w-0"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
