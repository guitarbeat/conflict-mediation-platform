import React from "react";

const NavigationButton = ({
  direction,
  onClick,
  disabled,
  className,
  ariaLabel,
  children,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background/90 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onNavigate,
  isAnimating,
}) => {
  const buttonConfig = {
    prev: {
      direction: "left",
      className: "hidden sm:block fixed top-1/2 transform -translate-y-1/2 left-4 z-50",
      ariaLabel: "Previous step",
      svgPath: "M15 19l-7-7 7-7",
      condition: currentStep > 1,
    },
    next: {
      direction: "right", 
      className: "hidden sm:block fixed top-1/2 transform -translate-y-1/2 right-4 z-50",
      ariaLabel: "Next step",
      svgPath: "M9 5l7 7-7 7",
      condition: currentStep < totalSteps,
    },
  };

  return (
    <>
      {Object.entries(buttonConfig).map(([direction, config]) => (
        config.condition && (
          <div key={direction} className={config.className}>
            <NavigationButton
              direction={config.direction}
              onClick={() => onNavigate(direction)}
              disabled={isAnimating}
              className=""
              ariaLabel={config.ariaLabel}
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
                  d={config.svgPath}
                />
              </svg>
            </NavigationButton>
          </div>
        )
      ))}
    </>
  );
};

export default NavigationButtons;
