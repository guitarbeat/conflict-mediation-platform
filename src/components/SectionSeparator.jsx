import React from 'react';

const SectionSeparator = ({ title, icon: Icon, className = "" }) => {
  return (
    <div className={`relative my-8 ${className}`}>
      {/* Animated background line */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 shimmer"></div>
        </div>
      </div>
      
      {/* Central content with enhanced styling */}
      <div className="relative flex justify-center">
        <div className="glass-card px-6 py-3 rounded-full shadow-enhanced hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 pulse-glow">
                <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
            )}
            {title && (
              <h2 className="text-lg font-semibold text-foreground tracking-wide group-hover:text-primary transition-colors duration-300">
                {title}
              </h2>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 flex gap-2">
        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-primary/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-8 bg-primary/5 rounded-full blur-xl"></div>
    </div>
  );
};

export default SectionSeparator;

