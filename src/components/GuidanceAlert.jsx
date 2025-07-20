import React from "react";
import { Info, Users, User } from "lucide-react";

const GuidanceAlert = ({
  step,
  partyAName = "Party A",
  partyBName = "Party B",
}) => {
  const getGuidanceInfo = (step) => {
    switch (step) {
      case 1:
        return {
          icon: Users,
          title: "Setup Phase",
          message: "Both parties, please fill out this section together.",
          type: "both",
          bgColor: "bg-muted/30",
          borderColor: "border-primary/20",
          textColor: "text-foreground",
          iconColor: "text-primary/70",
          accentColor: "primary",
        };
      case 2:
        return {
          icon: User,
          title: "Individual Reflection",
          message: `${
            partyAName ? `${partyAName}, please` : "Please"
          } complete this section individually. ${
            partyBName || "The other party"
          } should not look at these responses yet.`,
          type: "partyA",
          bgColor: "bg-muted/30",
          borderColor: "border-accent/20",
          textColor: "text-foreground",
          iconColor: "text-accent/70",
          accentColor: "accent",
        };
      case 3:
        return {
          icon: User,
          title: "Individual Reflection",
          message: `${
            partyBName ? `${partyBName}, please` : "Please"
          } complete this section individually. ${
            partyAName || "The other party"
          } should not look at these responses yet.`,
          type: "partyB",
          bgColor: "bg-muted/30",
          borderColor: "border-secondary/20",
          textColor: "text-foreground",
          iconColor: "text-secondary/70",
          accentColor: "secondary",
        };
      case 4:
        return {
          icon: Users,
          title: "Shared Discussion",
          message:
            "Both parties, please discuss and fill out this section together using the ABCDE model.",
          type: "both",
          bgColor: "bg-muted/30",
          borderColor: "border-primary/20",
          textColor: "text-foreground",
          iconColor: "text-primary/70",
          accentColor: "primary",
        };
      case 5:
        return {
          icon: Users,
          title: "Solution Development",
          message:
            "Both parties, please work together to develop solutions and explore possibilities.",
          type: "both",
          bgColor: "bg-muted/30",
          borderColor: "border-accent/20",
          textColor: "text-foreground",
          iconColor: "text-accent/70",
          accentColor: "accent",
        };
      case 6:
        return {
          icon: Users,
          title: "Agreement & Action Steps",
          message:
            "Both parties, finalize your agreement and create actionable next steps.",
          type: "both",
          bgColor: "bg-muted/30",
          borderColor: "border-primary/20",
          textColor: "text-foreground",
          iconColor: "text-primary/70",
          accentColor: "primary",
        };
      default:
        return {
          icon: Info,
          title: "Guidance",
          message: "Please follow the instructions for this step.",
          type: "general",
          bgColor: "bg-muted/30",
          borderColor: "border-border/20",
          textColor: "text-foreground",
          iconColor: "text-muted-foreground/70",
          accentColor: "muted",
        };
    }
  };

  const guidance = getGuidanceInfo(step);
  const IconComponent = guidance.icon;

  return (
    <div
      className={`relative ${guidance.borderColor} ${guidance.bgColor} p-2 sm:p-3 mb-2 rounded-lg border-l-4 border-l-${guidance.accentColor}/40`}
    >
      {/* Content */}
      <div className="flex items-start gap-1.5 sm:gap-2">
        <div
          className={`flex-shrink-0 p-1.5 sm:p-2 rounded-md bg-background/50 border ${guidance.borderColor}`}
        >
          <IconComponent
            className={`h-4 w-4 sm:h-5 sm:w-5 ${guidance.iconColor}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={`text-sm sm:text-base font-medium ${guidance.textColor} mb-1`}
          >
            {guidance.title}
          </div>
          <div
            className={`text-xs sm:text-sm ${guidance.textColor} leading-relaxed opacity-80`}
          >
            {guidance.message}
          </div>

          {/* Privacy notice for individual sections */}
          {(guidance.type === "partyA" || guidance.type === "partyB") && (
            <div
              className={`mt-2 text-xs ${guidance.textColor} opacity-60 italic flex items-start gap-1.5`}
            >
              <span className="text-xs">🔒</span>
              <span>
                Private reflection space - other party should not view until
                shared discussion.
              </span>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div
          className={`text-xs px-2 py-1 rounded-md bg-${guidance.accentColor}/10 text-${guidance.accentColor}/70 border border-${guidance.accentColor}/20 flex-shrink-0`}
        >
          Step {step}
        </div>
      </div>
    </div>
  );
};

export default GuidanceAlert;
