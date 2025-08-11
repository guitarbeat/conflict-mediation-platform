import React from "react";

const NavigationButton = ({
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
  canGoNext = true,
}) => {
  const buttonConfig = {
    prev: {
      direction: "left",
      className: "hidden sm:block fixed top-1/2 transform -translate-y-1/2 left-4 z-50",
      ariaLabel: "Previous step",
      svgPath: "M15 19l-7-7 7-7",
      condition: currentStep > 1,
      disabled: isAnimating,
      onClick: () => onNavigate("prev"),
    },
    next: {
      direction: "right",
      className: "hidden sm:block fixed top-1/2 transform -translate-y-1/2 right-4 z-50",
      ariaLabel: "Next step",
      svgPath: "M9 5l7 7-7 7",
      condition: currentStep < totalSteps,
      disabled: isAnimating || !canGoNext,
      onClick: () => onNavigate("next"),
    },
  };

  return (
    <>
      {Object.entries(buttonConfig).map(([key, config]) => (
        config.condition && (
          <div key={key} className={config.className}>
                          <NavigationButton
              onClick={config.onClick}
              disabled={config.disabled}
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
