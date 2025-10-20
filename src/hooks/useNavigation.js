import { useState } from "react";

// Constants
const TOTAL_STEPS = 7;
const MIN_SWIPE_DISTANCE = 50;
const MAX_DRAG_OFFSET = 200;
const ANIMATION_DURATION = 400;

/**
 * Custom hook for managing step navigation and card animations
 * @returns {Object} Navigation state and functions
 */
export const useNavigation = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [animatingCard, setAnimatingCard] = useState(null);
    const [animationType, setAnimationType] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    // Computed values
    const isAnimating = animatingCard !== null;

    /**
     * Navigate to the next or previous step
     * @param {string} direction - 'next' or 'prev'
     */
    const navigateToStep = (target) => {
        if (isAnimating) return;

        if (typeof target === "number") {
            const clampedTarget = Math.max(1, Math.min(TOTAL_STEPS, target));

            if (clampedTarget === currentStep) {
                return;
            }

            setCurrentStep(clampedTarget);
            setAnimatingCard(null);
            setAnimationType("");
            setDragOffset(0);
            return;
        }

        if (target === "next" && currentStep < TOTAL_STEPS) {
            setAnimatingCard(currentStep);
            setAnimationType("flyOut");
            setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
                setAnimatingCard(null);
                setAnimationType("");
                setDragOffset(0);
            }, ANIMATION_DURATION);
        } else if (target === "prev" && currentStep > 1) {
            setAnimatingCard(currentStep - 1);
            setAnimationType("slideIn");
            setTimeout(() => {
                setCurrentStep((prev) => prev - 1);
                setAnimatingCard(null);
                setAnimationType("");
                setDragOffset(0);
            }, ANIMATION_DURATION);
        }
    };

    /**
     * Get client X coordinate from touch or mouse event
     * @param {Event} e - Touch or mouse event
     * @returns {number} Client X coordinate
     */
    const getClientX = (e) => {
        return e.touches ? e.touches[0].clientX : e.clientX;
    };

    /**
     * Handle input start (touch/mouse down)
     * @param {Event} e - Touch or mouse event
     */
    const handleInputStart = (e) => {
        if (isAnimating) return;

        // Check if the drag started on an interactive element
        const target = e.target;
        const isFormElement = target.closest(
            "input, textarea, button, select, label, [role='button'], [role='tab'], [contenteditable], .form-field, .form-input, .form-textarea"
        );
        const isBadgeElement = target.closest('.badge, [class*="badge"], [data-slot="badge"]');
        const isEmojiElement = target.closest(
            '[data-interactive-component="emoji-mapper"]'
        );
        const isClickableElement = target.closest(
            "a, button, [onclick], [data-clickable]"
        );
        const isProgressElement = target.closest(
            '[class*="progress"], [class*="step"]'
        );

        // Don't start card dragging for form elements, badges, emoji components, clickable elements, or progress elements
        if (
            isFormElement ||
            isBadgeElement ||
            isEmojiElement ||
            isClickableElement ||
            isProgressElement
        ) {
            return; // Don't preventDefault here to allow normal form interaction
        }

        e.preventDefault();
        setIsDragging(true);
        setTouchEnd(null);
        setTouchStart(getClientX(e));
        setDragOffset(0);
    };

    /**
     * Handle input move (touch/mouse move)
     * @param {Event} e - Touch or mouse event
     */
    const handleInputMove = (e) => {
        if (!touchStart || isAnimating || !isDragging) return;

        // Don't prevent default on move to allow text selection
        const currentX = getClientX(e);
        setTouchEnd(currentX);

        // Allow dragging in both directions, but limit right drag
        const offset = currentX - touchStart;
        const clampedOffset = Math.max(-MAX_DRAG_OFFSET, Math.min(50, offset));
        setDragOffset(clampedOffset);
    };

    /**
     * Handle input end (touch/mouse up)
     */
    const handleInputEnd = () => {
        if (!isDragging) return;

        // Don't prevent default to allow normal form interactions
        setIsDragging(false);

        if (!touchStart || !touchEnd || isAnimating) {
            setDragOffset(0);
            return;
        }

        const swipeDistance = touchStart - touchEnd;
        const isLeftSwipe = swipeDistance > MIN_SWIPE_DISTANCE;
        const isRightSwipe = swipeDistance < -MIN_SWIPE_DISTANCE;

        if (isLeftSwipe) {
            navigateToStep("next");
        } else if (isRightSwipe) {
            navigateToStep("prev");
        } else {
            setDragOffset(0);
        }
    };

    /**
     * Handle mouse leave to stop dragging
     */
    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setDragOffset(0);
        }
    };

    return {
        // State
        currentStep,
        touchStart,
        touchEnd,
        dragOffset,
        animatingCard,
        animationType,
        isDragging,
        isAnimating,

        // Constants
        TOTAL_STEPS,
        ANIMATION_DURATION,

        // Functions
        navigateToStep,
        handleInputStart,
        handleInputMove,
        handleInputEnd,
        handleMouseLeave,
    };
}; 