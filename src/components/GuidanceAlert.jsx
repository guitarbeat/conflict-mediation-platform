import React from 'react';
import { Info, Users, User } from 'lucide-react';

const GuidanceAlert = ({ step, partyAName = "Party A", partyBName = "Party B" }) => {
  const getGuidanceInfo = (step) => {
    switch (step) {
      case 1:
        return {
          icon: Users,
          title: "Setup Phase",
          message: "Both parties, please fill out this section together.",
          type: "both",
          bgColor: "bg-muted",
          borderColor: "border-primary/30",
          textColor: "text-foreground",
          iconColor: "text-primary",
          accentColor: "primary"
        };
      case 2:
        return {
          icon: User,
          title: "Individual Reflection",
          message: `${partyAName ? `${partyAName}, please` : 'Please'} complete this section individually. ${partyBName || 'The other party'} should not look at these responses yet.`,
          type: "partyA",
          bgColor: "bg-muted",
          borderColor: "border-accent/30",
          textColor: "text-foreground",
          iconColor: "text-accent",
          accentColor: "accent"
        };
      case 3:
        return {
          icon: User,
          title: "Individual Reflection",
          message: `${partyBName ? `${partyBName}, please` : 'Please'} complete this section individually. ${partyAName || 'The other party'} should not look at these responses yet.`,
          type: "partyB",
          bgColor: "bg-muted",
          borderColor: "border-secondary/30",
          textColor: "text-foreground",
          iconColor: "text-secondary",
          accentColor: "secondary"
        };
      case 4:
        return {
          icon: Users,
          title: "Shared Discussion",
          message: "Both parties, please discuss and fill out this section together using the ABCDE model.",
          type: "both",
          bgColor: "bg-muted",
          borderColor: "border-primary/30",
          textColor: "text-foreground",
          iconColor: "text-primary",
          accentColor: "primary"
        };
      case 5:
        return {
          icon: Users,
          title: "Solution Development",
          message: "Both parties, please work together to develop solutions and explore possibilities.",
          type: "both",
          bgColor: "bg-muted",
          borderColor: "border-accent/30",
          textColor: "text-foreground",
          iconColor: "text-accent",
          accentColor: "accent"
        };
      case 6:
        return {
          icon: Users,
          title: "Agreement & Action Steps",
          message: "Both parties, finalize your agreement and create actionable next steps.",
          type: "both",
          bgColor: "bg-muted",
          borderColor: "border-primary/30",
          textColor: "text-foreground",
          iconColor: "text-primary",
          accentColor: "primary"
        };
      default:
        return {
          icon: Info,
          title: "Guidance",
          message: "Please follow the instructions for this step.",
          type: "general",
          bgColor: "bg-muted",
          borderColor: "border-border",
          textColor: "text-foreground",
          iconColor: "text-muted-foreground",
          accentColor: "muted"
        };
    }
  };

  const guidance = getGuidanceInfo(step);
  const IconComponent = guidance.icon;

  return (
    <div className={`card-natural-elevated no-hover-effects ${guidance.borderColor} ${guidance.bgColor} p-6 mb-6 animate-natural-fade-in-disabled`}>
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--${guidance.accentColor}) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative flex items-start gap-4">
        <div className={`flex-shrink-0 p-3 rounded-natural-md bg-background border ${guidance.borderColor} shadow-natural-sm`}>
          <IconComponent className={`h-6 w-6 ${guidance.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={`text-lg font-semibold ${guidance.textColor} mb-2`}>
            {guidance.title}
          </div>
          <div className={`text-base ${guidance.textColor} leading-relaxed opacity-90`}>
            {guidance.message}
          </div>
          
          {/* Privacy notice for individual sections */}
          {(guidance.type === "partyA" || guidance.type === "partyB") && (
            <div className={`mt-3 text-sm ${guidance.textColor} opacity-70 italic flex items-center gap-2`}>
              <span>🔒</span>
              <span>This is a private reflection space. The other party should not view these responses until the shared discussion phase.</span>
            </div>
          )}
        </div>
        
        {/* Step indicator */}
        <div className={`badge-natural-${guidance.accentColor} flex-shrink-0`}>
          Step {step}
        </div>
      </div>
      

    </div>
  );
};

export default GuidanceAlert;

