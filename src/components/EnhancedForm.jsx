import React, { useState, useEffect, useRef } from 'react';

const EnhancedForm = ({ onSubmit, initialData = {}, fields, autoSave = true }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // idle, saving, saved, error
  const [currentStep, setCurrentStep] = useState(0);
  const autoSaveTimeoutRef = useRef(null);
  const formRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && Object.keys(formData).length > 0) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }
  }, [formData, autoSave]);

  // Handle auto-save
  const handleAutoSave = async () => {
    try {
      setAutoSaveStatus('saving');
      // Simulate auto-save API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutoSaveStatus('saved');
      
      // Hide saved status after 3 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 5000);
    }
  };

  // Handle field changes
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }

    // Mark field as touched
    if (!touched[fieldName]) {
      setTouched(prev => ({ ...prev, [fieldName]: true }));
    }
  };

  // Handle field blur (for validation)
  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName]);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field || !field.validation) return;

    const validation = field.validation;
    let error = null;

    // Required validation
    if (validation.required && (!value || value.trim() === '')) {
      error = `${field.label} is required`;
    }
    // Min length validation
    else if (validation.minLength && value && value.length < validation.minLength) {
      error = `${field.label} must be at least ${validation.minLength} characters`;
    }
    // Max length validation
    else if (validation.maxLength && value && value.length > validation.maxLength) {
      error = `${field.label} must be no more than ${validation.maxLength} characters`;
    }
    // Pattern validation
    else if (validation.pattern && value && !validation.pattern.test(value)) {
      error = validation.patternMessage || `${field.label} format is invalid`;
    }
    // Custom validation
    else if (validation.custom && typeof validation.custom === 'function') {
      error = validation.custom(value, formData);
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      validateField(field.name, formData[field.name]);
      if (errors[field.name]) {
        newErrors[field.name] = errors[field.name];
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Show success feedback
      setAutoSaveStatus('saved');
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < fields.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Render field based on type
  const renderField = (field) => {
    const { name, type, label, placeholder, options, validation, helpText } = field;
    const value = formData[name] || '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = error && isTouched;

    const baseInputClasses = `
      input input-md w-full transition-all duration-200
      ${hasError ? 'input-error error-shake' : ''}
      ${!hasError && isTouched && value ? 'input-success' : ''}
      focus-ring
    `;

    const baseFieldClasses = `
      form-field mb-6
      ${hasError ? 'error-shake' : ''}
    `;

    switch (type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div className={baseFieldClasses}>
            <label className="form-label" htmlFor={name}>
              {label}
              {validation?.required && <span className="text-error-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(e) => handleFieldChange(name, e.target.value)}
                onBlur={() => handleFieldBlur(name)}
                placeholder={placeholder}
                className={baseInputClasses}
                aria-describedby={`${name}-help ${name}-error`}
                aria-invalid={hasError}
              />
              {/* Validation Icon */}
              {isTouched && (
                <div className={`validation-icon ${hasError ? 'error' : value ? 'success' : ''}`}>
                  {hasError ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : value ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : null}
                </div>
              )}
            </div>
            {/* Help Text */}
            {helpText && (
              <p id={`${name}-help`} className="form-description">
                {helpText}
              </p>
            )}
            {/* Error Message */}
            {hasError && (
              <p id={`${name}-error`} className="text-error-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className={baseFieldClasses}>
            <label className="form-label" htmlFor={name}>
              {label}
              {validation?.required && <span className="text-error-500 ml-1">*</span>}
            </label>
            <textarea
              id={name}
              name={name}
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              onBlur={() => handleFieldBlur(name)}
              placeholder={placeholder}
              rows={4}
              className={baseInputClasses}
              aria-describedby={`${name}-help ${name}-error`}
              aria-invalid={hasError}
            />
            {helpText && (
              <p id={`${name}-help`} className="form-description">
                {helpText}
              </p>
            )}
            {hasError && (
              <p id={`${name}-error`} className="text-error-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div className={baseFieldClasses}>
            <label className="form-label" htmlFor={name}>
              {label}
              {validation?.required && <span className="text-error-500 ml-1">*</span>}
            </label>
            <select
              id={name}
              name={name}
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              onBlur={() => handleFieldBlur(name)}
              className={baseInputClasses}
              aria-describedby={`${name}-help ${name}-error`}
              aria-invalid={hasError}
            >
              <option value="">{placeholder || 'Select an option'}</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {helpText && (
              <p id={`${name}-help`} className="form-description">
                {helpText}
              </p>
            )}
            {hasError && (
              <p id={`${name}-error`} className="text-error-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className={baseFieldClasses}>
            <label className="form-label">
              {label}
              {validation?.required && <span className="text-error-500 ml-1">*</span>}
            </label>
            <div className="space-y-2 mt-2">
              {options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleFieldChange(name, e.target.value)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-body-md">{option.label}</span>
                </label>
              ))}
            </div>
            {helpText && (
              <p className="form-description">
                {helpText}
              </p>
            )}
            {hasError && (
              <p className="text-error-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className={baseFieldClasses}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name={name}
                checked={value || false}
                onChange={(e) => handleFieldChange(name, e.target.checked)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="form-label">
                {label}
                {validation?.required && <span className="text-error-500 ml-1">*</span>}
              </span>
            </label>
            {helpText && (
              <p className="form-description">
                {helpText}
              </p>
            )}
            {hasError && (
              <p className="text-error-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-transition">
      {/* Auto-save Status */}
      {autoSave && (
        <div className="mb-6 p-3 rounded-lg border border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {autoSaveStatus === 'saving' && (
                <>
                  <div className="spinner w-4 h-4"></div>
                  <span className="text-sm text-muted-foreground">Auto-saving...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-success-600">Auto-saved</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <svg className="w-4 h-4 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-error-600">Auto-save failed</span>
                </>
              )}
              {autoSaveStatus === 'idle' && (
                <span className="text-sm text-muted-foreground">Changes will be auto-saved</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {fields.length > 1 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {fields.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / fields.length) * 100)}% Complete
            </span>
          </div>
          <div className="progress-bar h-2">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / fields.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Current Step Fields */}
        {fields.length > 1 ? (
          <div className="space-y-6">
            {renderField(fields[currentStep])}
          </div>
        ) : (
          /* All Fields at Once */
          <div className="space-y-6">
            {fields.map((field) => renderField(field))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          {fields.length > 1 ? (
            <>
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="btn btn-secondary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {currentStep < fields.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary btn-md"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-md btn-press"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            /* Single Step Form */
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-md btn-press ml-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedForm;