import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

const InputValidation = ({
  value,
  rules = [],
  onValidationChange,
  className = "",
  showIcon = true,
  showMessage = true,
}) => {
  const [validationState, setValidationState] = useState({
    isValid: true,
    isChecking: false,
    errors: [],
    warnings: [],
  });

  const validateValue = async (val) => {
    setValidationState(prev => ({ ...prev, isChecking: true }));

    const errors = [];
    const warnings = [];

    for (const rule of rules) {
      try {
        const result = await rule.validate(val);
        if (!result.isValid) {
          if (rule.severity === 'warning') {
            warnings.push(result.message);
          } else {
            errors.push(result.message);
          }
        }
      } catch (error) {
        console.error('Validation error:', error);
        errors.push('Validation error occurred');
      }
    }

    const newState = {
      isValid: errors.length === 0,
      isChecking: false,
      errors,
      warnings,
    };

    setValidationState(newState);
    onValidationChange?.(newState);
  };

  useEffect(() => {
    if (value !== undefined && value !== null) {
      validateValue(value);
    }
  }, [value, rules]);

  const getValidationIcon = () => {
    if (!showIcon) return null;

    if (validationState.isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (validationState.errors.length > 0) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }

    if (validationState.warnings.length > 0) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }

    if (validationState.isValid && value && value.toString().trim() !== '') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    return null;
  };

  const getValidationMessage = () => {
    if (!showMessage) return null;

    if (validationState.errors.length > 0) {
      return (
        <div className="space-y-1">
          {validationState.errors.map((error, index) => (
            <p key={index} className="text-red-600 text-xs flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {error}
            </p>
          ))}
        </div>
      );
    }

    if (validationState.warnings.length > 0) {
      return (
        <div className="space-y-1">
          {validationState.warnings.map((warning, index) => (
            <p key={index} className="text-yellow-600 text-xs flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {warning}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cn("space-y-1", className)}>
      {getValidationIcon()}
      {getValidationMessage()}
    </div>
  );
};

// Predefined validation rules
export const validationRules = {
  required: (message = "This field is required") => ({
    validate: (value) => ({
      isValid: value && value.toString().trim() !== "",
      message,
    }),
    severity: 'error',
  }),

  minLength: (min, message) => ({
    validate: (value) => ({
      isValid: !value || value.toString().length >= min,
      message: message || `Must be at least ${min} characters long`,
    }),
    severity: 'error',
  }),

  maxLength: (max, message) => ({
    validate: (value) => ({
      isValid: !value || value.toString().length <= max,
      message: message || `Must be no more than ${max} characters long`,
    }),
    severity: 'error',
  }),

  email: (message = "Please enter a valid email address") => ({
    validate: (value) => {
      if (!value) return { isValid: true, message: "" };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        isValid: emailRegex.test(value),
        message,
      };
    },
    severity: 'error',
  }),

  phone: (message = "Please enter a valid phone number") => ({
    validate: (value) => {
      if (!value) return { isValid: true, message: "" };
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return {
        isValid: phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')),
        message,
      };
    },
    severity: 'error',
  }),

  url: (message = "Please enter a valid URL") => ({
    validate: (value) => {
      if (!value) return { isValid: true, message: "" };
      try {
        new URL(value);
        return { isValid: true, message: "" };
      } catch {
        return { isValid: false, message };
      }
    },
    severity: 'error',
  }),

  pattern: (regex, message) => ({
    validate: (value) => ({
      isValid: !value || regex.test(value),
      message,
    }),
    severity: 'error',
  }),

  custom: (validator, message) => ({
    validate: validator,
    severity: 'error',
  }),

  // Conflict mediation specific rules
  conflictDescription: () => ({
    validate: (value) => {
      if (!value) return { isValid: true, message: "" };
      const wordCount = value.trim().split(/\s+/).length;
      return {
        isValid: wordCount >= 10,
        message: wordCount < 10 ? "Please provide a more detailed description (at least 10 words)" : "",
      };
    },
    severity: 'warning',
  }),

  assertiveApproach: () => ({
    validate: (value) => {
      if (!value) return { isValid: true, message: "" };
      const hasIStatement = /I\s+(think|feel|believe|want|need)/i.test(value);
      const hasRespectfulTone = !/(you\s+(always|never|should|must)|stupid|idiot|wrong)/i.test(value);
      
      if (!hasIStatement) {
        return {
          isValid: false,
          message: "Try using 'I' statements to express your needs respectfully",
        };
      }
      
      if (!hasRespectfulTone) {
        return {
          isValid: false,
          message: "Please use respectful language and avoid blaming statements",
        };
      }
      
      return { isValid: true, message: "" };
    },
    severity: 'error',
  }),

  actionStep: () => ({
    validate: (value) => {
      if (!value) return { isValid: true, message: "" };
      const hasDeadline = /\b(by|before|on|until)\b|\d{1,2}\/\d{1,2}|\d{4}/.test(value);
      const isSpecific = value.length > 20;
      
      if (!isSpecific) {
        return {
          isValid: false,
          message: "Please be more specific about the action to be taken",
        };
      }
      
      if (!hasDeadline) {
        return {
          isValid: false,
          message: "Consider adding a deadline or timeline for this action",
        };
      }
      
      return { isValid: true, message: "" };
    },
    severity: 'warning',
  }),
};

export default InputValidation;