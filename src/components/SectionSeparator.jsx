import React from 'react';

const SectionSeparator = ({ title, icon, className = "" }) => {
  return (
    <div className={`relative my-8 ${className}`}>
      {/* Natural background line */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-60"></div>
      </div>
      
      {/* Central content with natural styling */}
      <div className="relative flex justify-center">
        <div className="bg-background border border-border px-6 py-3 rounded-natural-lg shadow-natural hover:shadow-natural-md transition-all duration-300 group">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-muted rounded-natural group-hover:bg-primary/10 transition-all duration-300">
                <span className="text-xl">{icon}</span>
              </div>
            )}
            {title && (
              <h2 className="text-base font-medium text-foreground tracking-wide group-hover:text-natural-primary transition-colors duration-300">
                {title}
              </h2>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtle decorative elements */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 flex gap-1">
        <div className="w-1 h-1 bg-primary/40 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full"></div>
        <div className="w-1 h-1 bg-primary/40 rounded-full"></div>
      </div>
    </div>
  );
};

export default SectionSeparator;

