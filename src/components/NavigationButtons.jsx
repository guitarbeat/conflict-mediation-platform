import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

const NavigationButton = ({
  onClick,
  disabled,
  ariaDisabled = false,
  className,
  ariaLabel,
  children,
  tooltip,
  tooltipSide = "top",
}) => {
  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      className={cn(
        "w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm border border-border",
        "hover:bg-card transition-all duration-normal flex items-center justify-center",
        "shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        ariaDisabled && "opacity-60",
        className,
      )}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );

  if (tooltip && !disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onNavigate,
  isAnimating,
  canGoNext = true,
  currentSubStep = 0,
  subStepCount = 0,
}) => {
  const canGoPrev = currentStep > 1 || currentSubStep > 0;
  const hasNextStep = currentStep < totalSteps || currentSubStep < subStepCount - 1;

  const buttonConfig = {
    prev: {
      direction: "left",
      className: "hidden sm:block fixed top-1/2 transform -translate-y-1/2 left-4 z-50",
      ariaLabel: "Previous step",
      svgPath: "M15 19l-7-7 7-7",
      condition: canGoPrev,
      disabled: isAnimating,
      onClick: () => onNavigate("prev"),
      tooltip: "Previous step",
      tooltipSide: "right",
    },
    next: {
      direction: "right",
      className: "hidden sm:block fixed top-1/2 transform -translate-y-1/2 right-4 z-50",
      ariaLabel: "Next step",
      svgPath: "M9 5l7 7-7 7",
      condition: hasNextStep,
      disabled: isAnimating || !hasNextStep,
      ariaDisabled: !canGoNext,
      onClick: () => onNavigate("next"),
      tooltip: "Next step",
      tooltipSide: "left",
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
                ariaDisabled={config.ariaDisabled}
                className=""
                ariaLabel={config.ariaLabel}
                tooltip={config.tooltip}
                tooltipSide={config.tooltipSide}
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

      {/* Mobile bottom navigation */}
      {(canGoPrev || hasNextStep) && (
        <div
          className={cn(
            "sm:hidden fixed bottom-0 left-0 right-0 px-4 z-50",
            "pb-[env(safe-area-inset-bottom,1rem)] pt-3 pointer-events-none",
          )}
        >
          <div
            className="pointer-events-auto bg-card border border-border shadow-xl rounded-xl px-4 py-3 flex items-center gap-3 backdrop-blur-sm"
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => onNavigate("prev")}
              disabled={!canGoPrev || isAnimating}
              aria-label="Go to previous step"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
              <span className="font-medium">Back</span>
            </Button>
            <Button
              type="button"
              size="lg"
              className="flex-1"
              onClick={() => onNavigate("next")}
              disabled={!hasNextStep || isAnimating || !canGoNext}
              aria-label={
                currentStep === 1
                  ? "Start Mediation"
                  : hasNextStep
                    ? "Go to next step"
                    : "Next step unavailable"
              }
              data-testid="next-button"
            >
              <span className="font-medium">
                {currentStep === 1 && currentSubStep === 0
                  ? "Start Mediation"
                  : hasNextStep
                    ? "Next"
                    : "Done"}
              </span>
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationButtons;
