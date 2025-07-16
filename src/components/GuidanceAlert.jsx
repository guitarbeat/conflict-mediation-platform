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
          bgColor: "bg-blue-50 dark:bg-blue-950/30",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-800 dark:text-blue-200",
          iconColor: "text-blue-600 dark:text-blue-400"
        };
      case 2:
        return {
          icon: User,
          title: "Individual Reflection",
          message: `${partyAName}, please complete this section individually. ${partyBName} should not look at these responses yet.`,
          type: "partyA",
          bgColor: "bg-orange-50 dark:bg-orange-950/30",
          borderColor: "border-orange-200 dark:border-orange-800",
          textColor: "text-orange-800 dark:text-orange-200",
          iconColor: "text-orange-600 dark:text-orange-400"
        };
      case 3:
        return {
          icon: User,
          title: "Individual Reflection",
          message: `${partyBName}, please complete this section individually. ${partyAName} should not look at these responses yet.`,
          type: "partyB",
          bgColor: "bg-purple-50 dark:bg-purple-950/30",
          borderColor: "border-purple-200 dark:border-purple-800",
          textColor: "text-purple-800 dark:text-purple-200",
          iconColor: "text-purple-600 dark:text-purple-400"
        };
      case 4:
        return {
          icon: Users,
          title: "Shared Discussion",
          message: "Both parties, please discuss and fill out this section together using the ABCDE model.",
          type: "both",
          bgColor: "bg-green-50 dark:bg-green-950/30",
          borderColor: "border-green-200 dark:border-green-800",
          textColor: "text-green-800 dark:text-green-200",
          iconColor: "text-green-600 dark:text-green-400"
        };
      case 5:
        return {
          icon: Users,
          title: "Solution Development",
          message: "Both parties, please work together to develop solutions and explore possibilities.",
          type: "both",
          bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
          borderColor: "border-indigo-200 dark:border-indigo-800",
          textColor: "text-indigo-800 dark:text-indigo-200",
          iconColor: "text-indigo-600 dark:text-indigo-400"
        };
      case 6:
        return {
          icon: Users,
          title: "Agreement & Action Steps",
          message: "Both parties, finalize your agreement and create actionable next steps.",
          type: "both",
          bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
          borderColor: "border-emerald-200 dark:border-emerald-800",
          textColor: "text-emerald-800 dark:text-emerald-200",
          iconColor: "text-emerald-600 dark:text-emerald-400"
        };
      default:
        return {
          icon: Info,
          title: "Guidance",
          message: "Please follow the instructions for this step.",
          type: "general",
          bgColor: "bg-gray-50 dark:bg-gray-950/30",
          borderColor: "border-gray-200 dark:border-gray-800",
          textColor: "text-gray-800 dark:text-gray-200",
          iconColor: "text-gray-600 dark:text-gray-400"
        };
    }
  };

  const guidance = getGuidanceInfo(step);
  const IconComponent = guidance.icon;

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 ${guidance.borderColor} ${guidance.bgColor} p-6 mb-6 shadow-sm`}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px), radial-gradient(circle at 80% 50%, currentColor 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative flex items-start gap-4">
        <div className={`flex-shrink-0 p-2 rounded-lg ${guidance.bgColor} border ${guidance.borderColor}`}>
          <IconComponent className={`h-6 w-6 ${guidance.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={`text-lg font-semibold ${guidance.textColor} mb-2`}>
            {guidance.title}
          </div>
          <div className={`text-base ${guidance.textColor} leading-relaxed`}>
            {guidance.message}
          </div>
          
          {/* Privacy notice for individual sections */}
          {(guidance.type === "partyA" || guidance.type === "partyB") && (
            <div className={`mt-3 text-sm ${guidance.textColor} opacity-75 italic`}>
              🔒 This is a private reflection space. The other party should not view these responses until the shared discussion phase.
            </div>
          )}
        </div>
        
        {/* Step indicator */}
        <div className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${guidance.bgColor} border ${guidance.borderColor} ${guidance.textColor}`}>
          Step {step}
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
        guidance.type === "partyA" ? "from-orange-400 to-orange-600" :
        guidance.type === "partyB" ? "from-purple-400 to-purple-600" :
        guidance.type === "both" ? "from-blue-400 via-green-400 to-blue-400" :
        "from-gray-400 to-gray-600"
      }`}></div>
    </div>
  );
};

export default GuidanceAlert;

