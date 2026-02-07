import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for managing step navigation and card animations
 * @param {Object} options
 * @param {(params: { currentStep: number, targetStep: number, direction: "forward"|"backward"|"none", type: "direct"|"step" }) => boolean} [options.canNavigateToStep]
 * Callback invoked before navigation. Return false to prevent the transition.
 * @param {number} [options.totalSteps=7] - Total number of steps available in the flow.
 * @param {number} [options.animationDuration=400] - Duration of card transition animations in milliseconds.
 * @returns {Object} Navigation state and functions
 */
export const useNavigation = (options = {}) => {
    const {
        canNavigateToStep,
        totalSteps = 7,
        animationDuration = 400,
    } = options;
    const [currentStep, setCurrentStep] = useState(1);
    const [animatingCard, setAnimatingCard] = useState(null);
    const [animationType, setAnimationType] = useState("");
    const animationTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
                animationTimeoutRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        setCurrentStep((prev) => {
            if (!Number.isFinite(totalSteps) || totalSteps <= 0) {
                return Math.max(1, prev);
            }
            return Math.max(1, Math.min(totalSteps, prev));
        });
    }, [totalSteps]);

    // Computed values
    const isAnimating = animatingCard !== null;

    const shouldNavigate = (targetStep, meta = {}) => {
        if (typeof canNavigateToStep === "function") {
            return canNavigateToStep({
                currentStep,
                targetStep,
                ...meta,
            });
        }
        return true;
    };

    const resetAnimationState = () => {
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
            animationTimeoutRef.current = null;
        }
        setAnimatingCard(null);
        setAnimationType("");
    };

    /**
     * Navigate to the next or previous step
     * @param {string|number} target - 'next', 'prev', or a direct step number
     */
    const navigateToStep = (target) => {
        if (isAnimating) return;

        if (typeof target === "number") {
            const clampedTarget = Math.max(1, Math.min(totalSteps, target));

            if (clampedTarget === currentStep) {
                return;
            }

            const direction =
                clampedTarget > currentStep
                    ? "forward"
                    : clampedTarget < currentStep
                    ? "backward"
                    : "none";

            if (!shouldNavigate(clampedTarget, { type: "direct", direction })) {
                return;
            }

            resetAnimationState();
            setCurrentStep(clampedTarget);
            return;
        }

        if (target === "next" && currentStep < totalSteps) {
            const targetStep = currentStep + 1;
            if (
                !shouldNavigate(targetStep, {
                    type: "step",
                    direction: "forward",
                })
            ) {
                return;
            }

            setAnimatingCard(currentStep);
            setAnimationType("flyOut");
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
            animationTimeoutRef.current = setTimeout(() => {
                setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
                resetAnimationState();
            }, animationDuration);
        } else if (target === "prev" && currentStep > 1) {
            const targetStep = currentStep - 1;
            if (
                !shouldNavigate(targetStep, {
                    type: "step",
                    direction: "backward",
                })
            ) {
                return;
            }

            setAnimatingCard(currentStep - 1);
            setAnimationType("slideIn");
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
            animationTimeoutRef.current = setTimeout(() => {
                setCurrentStep((prev) => Math.max(1, prev - 1));
                resetAnimationState();
            }, animationDuration);
        }
    };

    return {
        // State
        currentStep,
        animatingCard,
        animationType,
        isAnimating,

        // Configuration
        totalSteps,
        animationDuration,

        // Functions
        navigateToStep,
    };
};
