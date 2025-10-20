import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  ChevronUp,
} from "lucide-react";
import {
  SURVEY_CATEGORIES,
  getCategoryProgress,
} from "../config/surveyCategories";

const CategoryNavigation = ({
  formData,
  currentStep,
  onNavigateToStep,
}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isOverviewCollapsed, setIsOverviewCollapsed] = useState(false);

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const toggleOverview = () => {
    setIsOverviewCollapsed((prev) => !prev);
  };

  const getStepInCategory = (category, step) => {
    const stepIndex = category.steps.indexOf(step);
    return stepIndex + 1; // 1-based index
  };

  const getStepName = (step) => {
    const stepNames = [
      "Setup & Information",
      "Party A Reflection",
      "Party B Reflection",
      "ABCDE Analysis",
      "Solution Development",
      "Agreement & Planning",
      "Export & Summary",
    ];

    return stepNames[step - 1] || `Step ${step}`;
  };

  const renderStepButton = (category, step, progress) => {
    const isCurrentStep = step === currentStep;
    const isCompleted =
      progress.completed >= getStepInCategory(category, step);
    return (
      <button
        key={step}
        type="button"
        onClick={() => onNavigateToStep(step)}
        className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-colors ${
          isCurrentStep
            ? "bg-primary/20 text-primary font-medium"
            : isCompleted
            ? "text-green-600 hover:bg-green-50"
            : "text-muted-foreground hover:bg-muted/50"
        } cursor-pointer`}
      >
        {isCompleted ? (
          <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
        ) : (
          <Circle className="h-4 w-4" aria-hidden="true" />
        )}
        <span>{getStepName(step)}</span>
        {isCurrentStep && (
          <span className="ml-auto text-xs px-2 py-1 bg-primary/20 rounded-full">
            Current
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <button
        type="button"
        onClick={toggleOverview}
        className="w-full text-left mb-4 flex items-center justify-between hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span role="img" aria-label="Survey overview">
            📊
          </span>
          Survey Progress Overview
        </h3>
        {isOverviewCollapsed ? (
          <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {!isOverviewCollapsed && (
        <div className="space-y-2">
          {Object.values(SURVEY_CATEGORIES).map((category) => {
            const progress = getCategoryProgress(formData, category);
            const isExpanded = expandedCategory === category.id;
            const isCurrentCategory = category.steps.includes(currentStep);

            return (
              <div
                key={category.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full p-3 text-left flex items-center justify-between transition-colors ${
                    isCurrentCategory
                      ? "bg-primary/10 border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg" aria-hidden="true">
                      {category.icon}
                    </span>
                    <div>
                      <h4 className="font-medium text-sm">{category.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {progress.completed} of {progress.total} steps completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          progress.percentage === 100
                            ? "bg-green-500"
                            : "bg-primary"
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>

                    {isExpanded ? (
                      <ChevronDown
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronRight
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground mb-3">
                      {category.description}
                    </p>

                    <div className="space-y-1">
                      {category.steps.map((step) =>
                        renderStepButton(category, step, progress)
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryNavigation;
