import React, { useEffect, useRef } from "react";
import StepCard from "./StepCard";

const CardStack = ({
  totalSteps,
  currentStep,
  dragOffset,
  animatingCard,
  animationType,
  isDragging,
  onInputStart,
  onInputMove,
  onInputEnd,
  onMouseLeave,
  stepElements,
}) => {
  const cardRefs = useRef({});

  // Add event listeners with proper passive options
  useEffect(() => {
    const currentCard = cardRefs.current[currentStep];
    if (!currentCard) return;

    const handleTouchStart = (e) => {
      if (onInputStart) onInputStart(e);
    };

    const handleTouchMove = (e) => {
      if (onInputMove) onInputMove(e);
    };

    const handleTouchEnd = (e) => {
      if (onInputEnd) onInputEnd(e);
    };

    const handleMouseDown = (e) => {
      if (onInputStart) onInputStart(e);
    };

    const handleMouseMove = (e) => {
      if (isDragging && onInputMove) onInputMove(e);
    };

    const handleMouseUp = (e) => {
      if (isDragging && onInputEnd) onInputEnd(e);
    };

    const handleMouseLeave = (e) => {
      if (onMouseLeave) onMouseLeave(e);
    };

    // Add event listeners with passive: false for touch events
    currentCard.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    currentCard.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    currentCard.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
    currentCard.addEventListener("mousedown", handleMouseDown);
    currentCard.addEventListener("mousemove", handleMouseMove);
    currentCard.addEventListener("mouseup", handleMouseUp);
    currentCard.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      currentCard.removeEventListener("touchstart", handleTouchStart);
      currentCard.removeEventListener("touchmove", handleTouchMove);
      currentCard.removeEventListener("touchend", handleTouchEnd);
      currentCard.removeEventListener("mousedown", handleMouseDown);
      currentCard.removeEventListener("mousemove", handleMouseMove);
      currentCard.removeEventListener("mouseup", handleMouseUp);
      currentCard.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    currentStep,
    isDragging,
    onInputStart,
    onInputMove,
    onInputEnd,
    onMouseLeave,
  ]);
  const renderCardStack = () => {
    return Array.from({ length: totalSteps }, (_, index) => {
      const stepNumber = index + 1;
      const isThisCardAnimating = animatingCard === stepNumber;
      const isActive = stepNumber === currentStep;
      const isNext = stepNumber === currentStep + 1;
      const isPrevious = stepNumber === currentStep - 1;

      // Only render visible cards
      const isInVisibleRange =
        stepNumber >= currentStep - 1 && stepNumber <= currentStep + 1;
      if (!isThisCardAnimating && !isInVisibleRange) return null;

      // Determine card style
      let cardStyle = { transformOrigin: "center bottom" };

      if (isThisCardAnimating && animationType === "flyOut") {
        cardStyle = {
          ...cardStyle,
          transform: "translateX(-100vw) rotate(-15deg)",
          opacity: 0,
          zIndex: 30,
        };
      } else if (isThisCardAnimating && animationType === "slideIn") {
        // Previous card sliding in from left to cover current card
        cardStyle = {
          ...cardStyle,
          transform: "translateX(0) rotate(0deg)",
          opacity: 1,
          zIndex: 35,
        };
      } else if (isActive) {
        cardStyle = {
          ...cardStyle,
          transform: `translateX(${dragOffset}px) rotate(${
            dragOffset * 0.1
          }deg)`,
          opacity: 1,
          zIndex: 30,
        };
      } else if (isNext) {
        // Hide next card completely until dragging starts
        const shouldShowNext = dragOffset < -20; // Show when dragging left more than 20px
        cardStyle = {
          ...cardStyle,
          transform: "translateX(0) rotate(0deg)",
          opacity: shouldShowNext ? 1 : 0,
          zIndex: 20,
        };
      } else if (isPrevious) {
        // Previous card starts hidden to the left, ready to slide in
        if (isThisCardAnimating && animationType === "slideIn") {
          // This case is handled above, but just in case
          cardStyle = {
            ...cardStyle,
            transform: "translateX(0) rotate(0deg)",
            opacity: 1,
            zIndex: 35,
          };
        } else {
          cardStyle = {
            ...cardStyle,
            transform: "translateX(-100vw) rotate(0deg)",
            opacity: 1,
            zIndex: 10,
          };
        }
      } else {
        return null;
      }

      return (
        <div
          key={stepNumber}
          ref={(el) => {
            if (isActive) {
              cardRefs.current[stepNumber] = el;
            }
          }}
          className={`absolute inset-0 draggable-card-container ${
            isActive ? "cursor-pointer" : ""
          } ${
            isThisCardAnimating && animationType === "slideIn"
              ? "slide-in-animation"
              : "transition-all duration-[400ms] ease-out"
          }`}
          style={cardStyle}
          data-testid={isActive ? "current-card" : ""}
        >
          <StepCard>{stepElements[index]}</StepCard>
        </div>
      );
    });
  };

  return (
    <div
      className="relative min-h-[60vh] sm:min-h-[500px] pb-8"
      style={{ height: "auto" }}
    >
      {renderCardStack()}
    </div>
  );
};

export default CardStack;
