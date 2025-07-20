import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Card, CardContent } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { Download, FileText } from "lucide-react";
import EmojiGridMapper from "./components/EmojiGridMapper";
import SectionSeparator from "./components/SectionSeparator";
import DarkModeToggle from "./components/DarkModeToggle";
import GuidanceAlert from "./components/GuidanceAlert";
import ParticleBackground from "./components/ParticleBackground";
import DebugPanel from "./components/DebugPanel";
import { generateEnhancedPDF } from "./utils/pdfGenerator";
import { useFormFieldDebug, useFormStats } from "./hooks/use-form-debug";
import logo from "./assets/logo.png";
import "./App.css";

// Constants
const TOTAL_STEPS = 6;
const MIN_SWIPE_DISTANCE = 50;
const MAX_DRAG_OFFSET = 200;
const ANIMATION_DURATION = 400;

const STEPS = [
  "Setup",
  "Individual Reflection - Party A",
  "Individual Reflection - Party B",
  "Shared Discussion (ABCDE)",
  "Solution Development",
  "Agreement & Action Steps",
];

function App() {
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [animatingCard, setAnimatingCard] = useState(null);
  const [animationType, setAnimationType] = useState("");

  const [formData, setFormData] = useState({
    partyAName: "",
    partyBName: "",
    dateOfIncident: "",
    dateOfMediation: "",
    locationOfConflict: "",
    conflictDescription: "",
    // Individual Reflection A
    partyAThoughts: "",
    partyASelectedEmotionWords: [],
    partyAEmotionChartPosition: null,
    partyAAggressiveApproach: "",
    partyAPassiveApproach: "",
    partyAAssertiveApproach: "",
    partyAWhyBecause: "",
    // Individual Reflection B
    partyBThoughts: "",
    partyBSelectedEmotionWords: [],
    partyBEmotionChartPosition: null,
    partyBAggressiveApproach: "",
    partyBPassiveApproach: "",
    partyBAssertiveApproach: "",
    partyBWhyBecause: "",
    // ABCDE Model
    activatingEvent: "",
    partyABeliefs: "",
    partyBBeliefs: "",
    partyAConsequences: "",
    partyBConsequences: "",
    partyADisputations: "",
    partyBDisputations: "",
    effectsReflections: "",
    // Solution Development
    partyAMiracle: "",
    partyBMiracle: "",
    partyATop3Solutions: "",
    partyBTop3Solutions: "",
    partyAPerspective: "",
    partyBPerspective: "",
    compromiseSolutions: "",
    // Agreement & Action Steps
    partyAUnmetNeeds: "",
    partyBUnmetNeeds: "",
    partyANeedsInPractice: "",
    partyBNeedsInPractice: "",
    actionSteps: "",
    followUpDate: "",
    additionalSupport: "",
  });

  // Computed values
  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);
  const isAnimating = animatingCard !== null;

  // * Add form debugging and statistics
  useFormStats(formData, { logLevel: "info" });

  // Helper functions
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const navigateToStep = (direction) => {
    if (isAnimating) return;

    if (direction === "next" && currentStep < TOTAL_STEPS) {
      setAnimatingCard(currentStep);
      setAnimationType("flyOut");
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setAnimatingCard(null);
        setAnimationType("");
        setDragOffset(0);
      }, ANIMATION_DURATION);
    } else if (direction === "prev" && currentStep > 1) {
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

  // Unified input handling (touch + mouse)
  const [isDragging, setIsDragging] = useState(false);

  const getClientX = (e) => {
    return e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleInputStart = (e) => {
    if (isAnimating) return;

    // Check if the drag started on an interactive element
    const target = e.target;
    const isFormElement = target.closest(
      "input, textarea, button, select, label, [role='button'], [role='tab']"
    );
    const isBadgeElement = target.closest('.badge, [class*="badge"]');
    const isEmojiElement = target.closest(
      '[data-interactive-component="emoji-mapper"]'
    );
    const isClickableElement = target.closest(
      "a, button, [onclick], [data-clickable]"
    );

    // Don't start card dragging for form elements, badges, emoji components, or clickable elements
    if (
      isFormElement ||
      isBadgeElement ||
      isEmojiElement ||
      isClickableElement
    ) {
      return; // Don't preventDefault here to allow normal form interaction
    }

    e.preventDefault();
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart(getClientX(e));
    setDragOffset(0);
  };

  const handleInputMove = (e) => {
    if (!touchStart || isAnimating || !isDragging) return;
    e.preventDefault();
    const currentX = getClientX(e);
    setTouchEnd(currentX);

    // Allow dragging in both directions, but limit right drag
    const offset = currentX - touchStart;
    const clampedOffset = Math.max(-MAX_DRAG_OFFSET, Math.min(50, offset));
    setDragOffset(clampedOffset);
  };

  const handleInputEnd = (e) => {
    if (!isDragging) return;
    e.preventDefault();
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

  // Add mouse leave handler to stop dragging if mouse leaves the card
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  // Reusable form components
  const FormField = ({
    id,
    label,
    placeholder,
    value,
    onChange,
    type = "input",
    rows = 3,
    className = "",
  }) => {
    // * Add form debugging
    const debugHandlers = useFormFieldDebug(id, value);

    return (
      <div className="space-y-2">
        <Label htmlFor={id} className={className}>
          {label}
        </Label>
        {type === "textarea" ? (
          <Textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            {...debugHandlers}
          />
        ) : (
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            {...debugHandlers}
          />
        )}
      </div>
    );
  };

  const CommunicationApproaches = ({ prefix }) => (
    <div className="space-y-4 sm:space-y-6">
      <Label>I want... (Communication Approaches)</Label>
      <FormField
        id={`${prefix}AggressiveApproach`}
        label="Aggressive Approach (Not Recommended)"
        placeholder="What would you want to say if you were being aggressive?"
        value={formData[`${prefix}AggressiveApproach`]}
        onChange={(value) =>
          updateFormData(`${prefix}AggressiveApproach`, value)
        }
        type="textarea"
        className="text-red-600"
      />
      <FormField
        id={`${prefix}PassiveApproach`}
        label="Passive Approach"
        placeholder="What would you want if you were being passive?"
        value={formData[`${prefix}PassiveApproach`]}
        onChange={(value) => updateFormData(`${prefix}PassiveApproach`, value)}
        type="textarea"
        className="text-blue-600"
      />
      <FormField
        id={`${prefix}AssertiveApproach`}
        label="Assertive Approach (Recommended)"
        placeholder="What would you want to say if you were being assertive and respectful?"
        value={formData[`${prefix}AssertiveApproach`]}
        onChange={(value) =>
          updateFormData(`${prefix}AssertiveApproach`, value)
        }
        type="textarea"
        className="text-green-600"
      />
      <FormField
        id={`${prefix}WhyBecause`}
        label="Why/Because..."
        placeholder="Explain your reasoning..."
        value={formData[`${prefix}WhyBecause`]}
        onChange={(value) => updateFormData(`${prefix}WhyBecause`, value)}
        type="textarea"
      />
    </div>
  );

  const IndividualReflection = ({ party, prefix }) => (
    <div className="space-y-4 sm:space-y-6">
      <GuidanceAlert
        step={currentStep}
        partyAName={formData.partyAName}
        partyBName={formData.partyBName}
      />

      <SectionSeparator title="Thoughts & Beliefs" />
      <FormField
        id={`${prefix}Thoughts`}
        label="I think..."
        placeholder="Explain what you think or believe to be true about the conflict..."
        value={formData[`${prefix}Thoughts`]}
        onChange={(value) => updateFormData(`${prefix}Thoughts`, value)}
        type="textarea"
        rows={4}
      />

      <SectionSeparator title="Emotions & Feelings" />
      <div className="space-y-3 sm:space-y-4">
        <Label>I feel... (Use both methods to express your emotions)</Label>
        <EmojiGridMapper
          onEmotionWordsChange={(words) =>
            updateFormData(`${prefix}SelectedEmotionWords`, words)
          }
          onChartPositionChange={(position) =>
            updateFormData(`${prefix}EmotionChartPosition`, position)
          }
          selectedEmotionWords={formData[`${prefix}SelectedEmotionWords`]}
          chartPosition={formData[`${prefix}EmotionChartPosition`]}
        />
      </div>

      <SectionSeparator title="Communication Approaches" />
      <CommunicationApproaches party={party} prefix={prefix} />
    </div>
  );

  const TwoColumnFields = ({ fields }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {fields.map((field) => (
        <FormField key={field.id} {...field} />
      ))}
    </div>
  );

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

  const exportToPDF = () => {
    generateEnhancedPDF(formData);
  };

  // Card rendering
  const renderCardStack = () => {
    return Array.from({ length: TOTAL_STEPS }, (_, index) => {
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
          className={`absolute inset-0 draggable-card-container ${
            isActive ? "cursor-pointer" : ""
          } ${
            isThisCardAnimating && animationType === "slideIn"
              ? "slide-in-animation"
              : "transition-all duration-[400ms] ease-out"
          }`}
          style={cardStyle}
          onTouchStart={isActive ? handleInputStart : undefined}
          onTouchMove={isActive ? handleInputMove : undefined}
          onTouchEnd={isActive ? handleInputEnd : undefined}
          onMouseDown={isActive ? handleInputStart : undefined}
          onMouseMove={isActive ? handleInputMove : undefined}
          onMouseUp={isActive ? handleInputEnd : undefined}
          onMouseLeave={isActive ? handleMouseLeave : undefined}
        >
          <Card className="w-full h-auto">
            <CardContent className="p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
              <div className="fixed-content">
                {renderStepContent(stepNumber)}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert
              step={currentStep}
              partyAName={formData.partyAName}
              partyBName={formData.partyBName}
            />

            <SectionSeparator title="Party Information" />
            <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Let's start by gathering some basic information about the conflict
              and the parties involved.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                id="partyAName"
                label="Party A Name"
                placeholder="Enter first person's name"
                value={formData.partyAName}
                onChange={(value) => updateFormData("partyAName", value)}
              />
              <FormField
                id="partyBName"
                label="Party B Name"
                placeholder="Enter second person's name"
                value={formData.partyBName}
                onChange={(value) => updateFormData("partyBName", value)}
              />
            </div>

            <SectionSeparator title="Conflict Details" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <FormField
                id="dateOfIncident"
                label="Date of Incident"
                type="date"
                value={formData.dateOfIncident}
                onChange={(value) => updateFormData("dateOfIncident", value)}
              />
              <FormField
                id="dateOfMediation"
                label="Date of Mediation"
                type="date"
                value={formData.dateOfMediation}
                onChange={(value) => updateFormData("dateOfMediation", value)}
              />
              <FormField
                id="locationOfConflict"
                label="Location of Conflict"
                placeholder="Where did this happen?"
                value={formData.locationOfConflict}
                onChange={(value) =>
                  updateFormData("locationOfConflict", value)
                }
              />
            </div>

            <FormField
              id="conflictDescription"
              label="Agreed Upon Description of Conflict"
              placeholder="Both parties should agree on this description of what happened..."
              value={formData.conflictDescription}
              onChange={(value) => updateFormData("conflictDescription", value)}
              type="textarea"
              rows={4}
            />
          </div>
        );

      case 2:
        return <IndividualReflection party="A" prefix="partyA" />;

      case 3:
        return <IndividualReflection party="B" prefix="partyB" />;

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert
              step={currentStep}
              partyAName={formData.partyAName}
              partyBName={formData.partyBName}
            />

            <SectionSeparator title="ABCDE Model Discussion" />
            <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Work through this cognitive behavioral model together to
              understand the conflict better.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <Label
                  htmlFor="activatingEvent"
                  className="text-base font-semibold"
                >
                  A - Activating Event
                </Label>
                <p className="text-sm text-muted-foreground">
                  What actually happened? Stick to observable facts.
                </p>
                <Textarea
                  id="activatingEvent"
                  placeholder="Describe the factual events that triggered this conflict..."
                  value={formData.activatingEvent}
                  onChange={(e) =>
                    updateFormData("activatingEvent", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyABeliefs"
                    className="text-base font-semibold"
                  >
                    B - {formData.partyAName || "Party A"} Beliefs
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    What thoughts or beliefs do you have about this event?
                  </p>
                  <Textarea
                    id="partyABeliefs"
                    placeholder="Your thoughts and beliefs about what happened..."
                    value={formData.partyABeliefs}
                    onChange={(e) =>
                      updateFormData("partyABeliefs", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyBBeliefs"
                    className="text-base font-semibold"
                  >
                    B - {formData.partyBName || "Party B"} Beliefs
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    What thoughts or beliefs do you have about this event?
                  </p>
                  <Textarea
                    id="partyBBeliefs"
                    placeholder="Your thoughts and beliefs about what happened..."
                    value={formData.partyBBeliefs}
                    onChange={(e) =>
                      updateFormData("partyBBeliefs", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyAConsequences"
                    className="text-base font-semibold"
                  >
                    C - {formData.partyAName || "Party A"} Consequences
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    How did your beliefs make you feel and behave?
                  </p>
                  <Textarea
                    id="partyAConsequences"
                    placeholder="Your emotional and behavioral responses..."
                    value={formData.partyAConsequences}
                    onChange={(e) =>
                      updateFormData("partyAConsequences", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyBConsequences"
                    className="text-base font-semibold"
                  >
                    C - {formData.partyBName || "Party B"} Consequences
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    How did your beliefs make you feel and behave?
                  </p>
                  <Textarea
                    id="partyBConsequences"
                    placeholder="Your emotional and behavioral responses..."
                    value={formData.partyBConsequences}
                    onChange={(e) =>
                      updateFormData("partyBConsequences", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyADisputations"
                    className="text-base font-semibold"
                  >
                    D - {formData.partyAName || "Party A"} Disputations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Challenge your beliefs. Are they helpful? Accurate?
                    Realistic?
                  </p>
                  <Textarea
                    id="partyADisputations"
                    placeholder="Question and challenge your initial beliefs..."
                    value={formData.partyADisputations}
                    onChange={(e) =>
                      updateFormData("partyADisputations", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyBDisputations"
                    className="text-base font-semibold"
                  >
                    D - {formData.partyBName || "Party B"} Disputations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Challenge your beliefs. Are they helpful? Accurate?
                    Realistic?
                  </p>
                  <Textarea
                    id="partyBDisputations"
                    placeholder="Question and challenge your initial beliefs..."
                    value={formData.partyBDisputations}
                    onChange={(e) =>
                      updateFormData("partyBDisputations", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label
                  htmlFor="effectsReflections"
                  className="text-base font-semibold"
                >
                  E - Effects & Reflections
                </Label>
                <p className="text-sm text-muted-foreground">
                  What new insights have emerged? How do you both feel now?
                </p>
                <Textarea
                  id="effectsReflections"
                  placeholder="Reflect on new perspectives and feelings that have emerged..."
                  value={formData.effectsReflections}
                  onChange={(e) =>
                    updateFormData("effectsReflections", e.target.value)
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert
              step={currentStep}
              partyAName={formData.partyAName}
              partyBName={formData.partyBName}
            />

            <SectionSeparator title="Solution Development" />
            <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Now let's explore possibilities and develop solutions together.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyAMiracle"
                    className="text-base font-semibold"
                  >
                    {formData.partyAName || "Party A"} - Miracle Question
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    If you woke up tomorrow and this conflict was completely
                    resolved, what would be different?
                  </p>
                  <Textarea
                    id="partyAMiracle"
                    placeholder="Describe your ideal resolution..."
                    value={formData.partyAMiracle}
                    onChange={(e) =>
                      updateFormData("partyAMiracle", e.target.value)
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyBMiracle"
                    className="text-base font-semibold"
                  >
                    {formData.partyBName || "Party B"} - Miracle Question
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    If you woke up tomorrow and this conflict was completely
                    resolved, what would be different?
                  </p>
                  <Textarea
                    id="partyBMiracle"
                    placeholder="Describe your ideal resolution..."
                    value={formData.partyBMiracle}
                    onChange={(e) =>
                      updateFormData("partyBMiracle", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyATop3Solutions"
                    className="text-base font-semibold"
                  >
                    {formData.partyAName || "Party A"} - Top 3 Solutions
                  </Label>
                  <Textarea
                    id="partyATop3Solutions"
                    placeholder="List your top 3 preferred solutions..."
                    value={formData.partyATop3Solutions}
                    onChange={(e) =>
                      updateFormData("partyATop3Solutions", e.target.value)
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyBTop3Solutions"
                    className="text-base font-semibold"
                  >
                    {formData.partyBName || "Party B"} - Top 3 Solutions
                  </Label>
                  <Textarea
                    id="partyBTop3Solutions"
                    placeholder="List your top 3 preferred solutions..."
                    value={formData.partyBTop3Solutions}
                    onChange={(e) =>
                      updateFormData("partyBTop3Solutions", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </div>

              <SectionSeparator title="Understanding Each Other" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyAPerspective"
                    className="text-base font-semibold"
                  >
                    {formData.partyAName || "Party A"} - Other's Perspective
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Try to understand the other person's point of view.
                  </p>
                  <Textarea
                    id="partyAPerspective"
                    placeholder="What might the other person be thinking or feeling?"
                    value={formData.partyAPerspective}
                    onChange={(e) =>
                      updateFormData("partyAPerspective", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyBPerspective"
                    className="text-base font-semibold"
                  >
                    {formData.partyBName || "Party B"} - Other's Perspective
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Try to understand the other person's point of view.
                  </p>
                  <Textarea
                    id="partyBPerspective"
                    placeholder="What might the other person be thinking or feeling?"
                    value={formData.partyBPerspective}
                    onChange={(e) =>
                      updateFormData("partyBPerspective", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label
                  htmlFor="compromiseSolutions"
                  className="text-base font-semibold"
                >
                  Compromise Solutions
                </Label>
                <p className="text-sm text-muted-foreground">
                  What solutions can you both agree on? What compromises are you
                  willing to make?
                </p>
                <Textarea
                  id="compromiseSolutions"
                  placeholder="Describe the solutions you both can accept..."
                  value={formData.compromiseSolutions}
                  onChange={(e) =>
                    updateFormData("compromiseSolutions", e.target.value)
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert
              step={currentStep}
              partyAName={formData.partyAName}
              partyBName={formData.partyBName}
            />

            <SectionSeparator title="Agreement & Action Steps" />
            <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Finalize your agreement and create actionable next steps.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyAUnmetNeeds"
                    className="text-base font-semibold"
                  >
                    {formData.partyAName || "Party A"} - Unmet Needs
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    What needs of yours weren't being met in this situation?
                  </p>
                  <Textarea
                    id="partyAUnmetNeeds"
                    placeholder="Describe your unmet needs..."
                    value={formData.partyAUnmetNeeds}
                    onChange={(e) =>
                      updateFormData("partyAUnmetNeeds", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyBUnmetNeeds"
                    className="text-base font-semibold"
                  >
                    {formData.partyBName || "Party B"} - Unmet Needs
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    What needs of yours weren't being met in this situation?
                  </p>
                  <Textarea
                    id="partyBUnmetNeeds"
                    placeholder="Describe your unmet needs..."
                    value={formData.partyBUnmetNeeds}
                    onChange={(e) =>
                      updateFormData("partyBUnmetNeeds", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyANeedsInPractice"
                    className="text-base font-semibold"
                  >
                    {formData.partyAName || "Party A"} - Needs in Practice
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    How can these needs be met going forward?
                  </p>
                  <Textarea
                    id="partyANeedsInPractice"
                    placeholder="Practical ways to meet your needs..."
                    value={formData.partyANeedsInPractice}
                    onChange={(e) =>
                      updateFormData("partyANeedsInPractice", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="partyBNeedsInPractice"
                    className="text-base font-semibold"
                  >
                    {formData.partyBName || "Party B"} - Needs in Practice
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    How can these needs be met going forward?
                  </p>
                  <Textarea
                    id="partyBNeedsInPractice"
                    placeholder="Practical ways to meet your needs..."
                    value={formData.partyBNeedsInPractice}
                    onChange={(e) =>
                      updateFormData("partyBNeedsInPractice", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label
                  htmlFor="actionSteps"
                  className="text-base font-semibold"
                >
                  Specific Action Steps
                </Label>
                <p className="text-sm text-muted-foreground">
                  What specific actions will each person take? Include deadlines
                  and accountability measures.
                </p>
                <Textarea
                  id="actionSteps"
                  placeholder="List specific, measurable action steps with deadlines..."
                  value={formData.actionSteps}
                  onChange={(e) =>
                    updateFormData("actionSteps", e.target.value)
                  }
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="followUpDate"
                    className="text-base font-semibold"
                  >
                    Follow-up Date
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When should you check in on progress?
                  </p>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) =>
                      updateFormData("followUpDate", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label
                    htmlFor="additionalSupport"
                    className="text-base font-semibold"
                  >
                    Additional Support Needed
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    What additional resources or support might be helpful?
                  </p>
                  <Textarea
                    id="additionalSupport"
                    placeholder="Describe any additional support needed..."
                    value={formData.additionalSupport}
                    onChange={(e) =>
                      updateFormData("additionalSupport", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                <SectionSeparator title="Export Your Session" />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    onClick={exportToJSON}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export as JSON
                  </Button>
                  <Button
                    onClick={exportToPDF}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Export as PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <DarkModeToggle />
      <DebugPanel />

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

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <div className="mb-4 sm:mb-8">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium">
              Step {currentStep} of {TOTAL_STEPS}: {STEPS[currentStep - 1]}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {progressPercentage}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          <div className="flex justify-between mt-2 sm:mt-4">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  index + 1 < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index + 1 === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Card Stack Container */}
        <div
          className="relative mb-4 sm:mb-8 min-h-[500px]"
          style={{ height: "auto" }}
        >
          {renderCardStack()}
        </div>

        {/* Desktop Navigation Buttons - Outside Container */}
        <div className="hidden sm:block fixed top-1/2 transform -translate-y-1/2 left-4 z-50">
          {/* Previous Button */}
          {currentStep > 1 && (
            <button
              onClick={() => navigateToStep("prev")}
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

        <div className="hidden sm:block fixed top-1/2 transform -translate-y-1/2 right-4 z-50">
          {/* Next Button */}
          {currentStep < TOTAL_STEPS && (
            <button
              onClick={() => navigateToStep("next")}
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

        {/* Step indicator at bottom */}
        <div className="text-center text-sm text-muted-foreground mt-4">
          Step {currentStep} of {TOTAL_STEPS}
        </div>
      </div>
    </div>
  );
}

export default App;
