import React, { useState, useEffect } from "react";
import { Lightbulb, Check, X, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

// Smart suggestions based on field type and content
export const SmartSuggestions = ({
  fieldType,
  currentValue = "",
  context = {},
  onSuggestionSelect,
  className = "",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate suggestions based on field type and context
  const generateSuggestions = async (type, value, ctx) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let generatedSuggestions = [];
    
    switch (type) {
      case "conflictDescription":
        generatedSuggestions = [
          "Communication breakdown between team members",
          "Disagreement over project priorities and deadlines",
          "Personality clash affecting work collaboration",
          "Misunderstanding about roles and responsibilities",
          "Conflict over resource allocation and budget",
          "Different working styles causing friction",
          "Disagreement about decision-making process",
          "Conflict arising from unclear expectations",
        ];
        break;
        
      case "thoughts":
        generatedSuggestions = [
          "I feel like my concerns aren't being heard",
          "I believe we have different priorities and goals",
          "I think there's a misunderstanding about expectations",
          "I feel frustrated because I'm not getting the support I need",
          "I believe we need better communication protocols",
          "I think we should focus on finding common ground",
          "I feel like we're not working as a team",
          "I believe we need to clarify our roles and responsibilities",
        ];
        break;
        
      case "assertiveApproach":
        generatedSuggestions = [
          "I would like to discuss this issue openly and find a solution together",
          "I understand your perspective, and I'd like to share mine as well",
          "I believe we can work through this by focusing on our common goals",
          "I'd appreciate it if we could find a compromise that works for both of us",
          "I think we should take some time to understand each other's needs better",
          "I would like to establish clear communication guidelines going forward",
          "I believe we can resolve this by being honest about our concerns",
          "I'd like to work together to prevent this issue from happening again",
        ];
        break;
        
      case "activatingEvent":
        generatedSuggestions = [
          "During the team meeting on [date], there was a disagreement about...",
          "The incident occurred when [person] said/did [specific action]",
          "The conflict started when we received conflicting instructions about...",
          "The issue arose during a project review when [specific event] happened",
          "The disagreement began when [person] made a decision without consulting...",
          "The conflict started during a discussion about [topic] when [specific action]",
          "The incident occurred in [location] when [specific event] took place",
          "The disagreement began when we had different interpretations of...",
        ];
        break;
        
      case "miracleQuestion":
        generatedSuggestions = [
          "We would be communicating openly and honestly with each other",
          "We would have clear expectations and roles defined",
          "We would be working together as a cohesive team",
          "We would have regular check-ins to prevent future conflicts",
          "We would respect each other's perspectives and working styles",
          "We would have established protocols for handling disagreements",
          "We would be focused on our shared goals and objectives",
          "We would have a positive and collaborative working relationship",
        ];
        break;
        
      case "solutions":
        generatedSuggestions = [
          "Establish weekly check-in meetings to discuss progress and concerns",
          "Create a shared document outlining roles and responsibilities",
          "Implement a conflict resolution protocol for future disagreements",
          "Schedule regular team-building activities to improve relationships",
          "Set up a communication channel for immediate issue resolution",
          "Create a feedback system for ongoing improvement",
          "Establish clear decision-making processes and criteria",
          "Develop a shared understanding of project goals and priorities",
        ];
        break;
        
      case "actionSteps":
        generatedSuggestions = [
          "Schedule a follow-up meeting in 2 weeks to review progress",
          "Create a shared action plan document with specific deadlines",
          "Assign specific responsibilities to each party with clear timelines",
          "Establish a communication protocol for ongoing updates",
          "Set up regular check-ins to monitor progress and address issues",
          "Create a feedback mechanism for continuous improvement",
          "Document lessons learned to prevent future conflicts",
          "Establish accountability measures and success metrics",
        ];
        break;
        
      default:
        generatedSuggestions = [];
    }
    
    // Filter suggestions based on current value
    if (value && value.trim()) {
      generatedSuggestions = generatedSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase()) ||
        value.toLowerCase().includes(suggestion.toLowerCase())
      );
    }
    
    // Add context-specific suggestions
    if (ctx.partyAName && ctx.partyBName) {
      generatedSuggestions = generatedSuggestions.map(suggestion =>
        suggestion.replace("[person]", ctx.partyAName || "the other person")
      );
    }
    
    setSuggestions(generatedSuggestions.slice(0, 5)); // Limit to 5 suggestions
    setIsLoading(false);
  };

  useEffect(() => {
    if (fieldType && currentValue.length > 2) {
      generateSuggestions(fieldType, currentValue, context);
    } else {
      setSuggestions([]);
    }
  }, [fieldType, currentValue, context]);

  const handleSuggestionClick = (suggestion) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
  };

  const handleRefresh = () => {
    generateSuggestions(fieldType, currentValue, context);
  };

  if (suggestions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          <span>Smart Suggestions</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh suggestions"
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
          </button>
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            title={showSuggestions ? "Hide suggestions" : "Show suggestions"}
          >
            {showSuggestions ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {showSuggestions && (
        <div className="space-y-1">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
              <span>Generating suggestions...</span>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-2 text-sm bg-muted/50 hover:bg-muted rounded-md transition-colors"
              >
                {suggestion}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Context-aware help text
export const ContextualHelp = ({
  fieldType,
  step,
  context = {},
  className = "",
}) => {
  const getHelpText = (type, step, ctx) => {
    const helpTexts = {
      conflictDescription: {
        title: "Describing the Conflict",
        tips: [
          "Focus on observable facts, not interpretations",
          "Include when and where the conflict occurred",
          "Describe specific actions or events that happened",
          "Avoid blame or judgmental language",
          "Ensure both parties agree on this description"
        ]
      },
      thoughts: {
        title: "Expressing Your Thoughts",
        tips: [
          "Be honest about your beliefs and assumptions",
          "Use 'I think' or 'I believe' statements",
          "Avoid making assumptions about the other person's intentions",
          "Focus on your own perspective and feelings",
          "Be specific about what you think happened"
        ]
      },
      assertiveApproach: {
        title: "Assertive Communication",
        tips: [
          "Use 'I' statements to express your needs",
          "Be respectful and considerate of the other person",
          "Focus on finding solutions, not assigning blame",
          "Be clear about what you want to achieve",
          "Listen actively to the other person's response"
        ]
      },
      miracleQuestion: {
        title: "The Miracle Question",
        tips: [
          "Imagine waking up tomorrow with the conflict completely resolved",
          "Describe what would be different in your relationship",
          "Focus on positive changes and improvements",
          "Be specific about what you would see, hear, or experience",
          "Think about how both parties would feel and behave"
        ]
      },
      solutions: {
        title: "Finding Solutions",
        tips: [
          "Focus on solutions that work for both parties",
          "Be creative and open to new ideas",
          "Consider both short-term and long-term solutions",
          "Think about what each person can do differently",
          "Aim for win-win outcomes whenever possible"
        ]
      }
    };

    return helpTexts[type] || null;
  };

  const helpInfo = getHelpText(fieldType, step, context);

  if (!helpInfo) return null;

  return (
    <div className={cn("p-4 bg-muted/30 rounded-lg space-y-3", className)}>
      <h4 className="font-medium text-sm">{helpInfo.title}</h4>
      <ul className="space-y-1">
        {helpInfo.tips.map((tip, index) => (
          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Progress indicator for form completion
export const FormProgressIndicator = ({
  currentStep,
  totalSteps,
  completedFields = 0,
  totalFields = 0,
  className = "",
}) => {
  const stepProgress = (currentStep / totalSteps) * 100;
  const fieldProgress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Step Progress</span>
        <span>{currentStep}/{totalSteps}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${stepProgress}%` }}
        />
      </div>
      
      {totalFields > 0 && (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Field Progress</span>
            <span>{completedFields}/{totalFields}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="bg-green-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${fieldProgress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
};