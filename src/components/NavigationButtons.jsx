import React from "react";

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onNavigate,
  isAnimating,
}) => {
  return (
    <>
      {/* Previous Button */}
      <div className="hidden sm:block fixed top-1/2 transform -translate-y-1/2 left-4 z-50">
        {currentStep > 1 && (
          <button
            onClick={() => onNavigate("prev")}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background/90 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous step"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Next Button */}
      <div className="hidden sm:block fixed top-1/2 transform -translate-y-1/2 right-4 z-50">
        {currentStep < totalSteps && (
          <button
            onClick={() => onNavigate("next")}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background/90 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next step"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default NavigationButtons;
