import { useEffect, useRef } from 'react';
import logger from '../utils/logger';

// * Hook to debug form field interactions
export function useFormFieldDebug(fieldName, value, options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'debug',
        trackFocus = true,
        trackChanges = true
    } = options;

    const prevValueRef = useRef(value);
    const focusCountRef = useRef(0);
    const changeCountRef = useRef(0);

    useEffect(() => {
        if (!enabled) return;

        // * Track value changes
        if (trackChanges && prevValueRef.current !== value) {
            const prevValue = prevValueRef.current;
            const newValue = value;

            logger[logLevel]('FormField', `${fieldName} value changed`, {
                fieldName,
                previousValue: prevValue,
                newValue,
                changeCount: ++changeCountRef.current,
                valueLength: newValue?.length || 0,
                isEmpty: !newValue || newValue.trim() === '',
                timestamp: new Date().toISOString()
            });

            prevValueRef.current = value;
        }
    }, [value, fieldName, enabled, logLevel, trackChanges]);

    const debugHandlers = {
        onFocus: (event) => {
            if (enabled && trackFocus) {
                logger[logLevel]('FormField', `${fieldName} focused`, {
                    fieldName,
                    focusCount: ++focusCountRef.current,
                    currentValue: event.target.value,
                    valueLength: event.target.value?.length || 0,
                    timestamp: new Date().toISOString()
                });
            }
        },

        onBlur: (event) => {
            if (enabled && trackFocus) {
                logger[logLevel]('FormField', `${fieldName} blurred`, {
                    fieldName,
                    finalValue: event.target.value,
                    valueLength: event.target.value?.length || 0,
                    isEmpty: !event.target.value || event.target.value.trim() === '',
                    timestamp: new Date().toISOString()
                });
            }
        },

        onChange: (event) => {
            if (enabled && trackChanges) {
                const newValue = event.target.value;
                logger[logLevel]('FormField', `${fieldName} onChange triggered`, {
                    fieldName,
                    newValue,
                    valueLength: newValue?.length || 0,
                    eventType: event.type,
                    timestamp: new Date().toISOString()
                });
            }
        },

        onKeyDown: (event) => {
            if (enabled) {
                logger[logLevel]('FormField', `${fieldName} key pressed`, {
                    fieldName,
                    key: event.key,
                    keyCode: event.keyCode,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                    altKey: event.altKey,
                    currentValue: event.target.value,
                    timestamp: new Date().toISOString()
                });
            }
        },

        onPaste: (event) => {
            if (enabled) {
                const pastedText = event.clipboardData?.getData('text') || '';
                logger[logLevel]('FormField', `${fieldName} text pasted`, {
                    fieldName,
                    pastedText,
                    pastedLength: pastedText.length,
                    currentValue: event.target.value,
                    timestamp: new Date().toISOString()
                });
            }
        },

        onCopy: (event) => {
            if (enabled) {
                const selectedText = window.getSelection()?.toString() || '';
                logger[logLevel]('FormField', `${fieldName} text copied`, {
                    fieldName,
                    selectedText,
                    selectedLength: selectedText.length,
                    currentValue: event.target.value,
                    timestamp: new Date().toISOString()
                });
            }
        }
    };

    return debugHandlers;
}

// * Hook to debug form validation
export function useFormValidationDebug(formData, validationErrors, options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'warn'
    } = options;

    const prevErrorsRef = useRef(validationErrors);

    useEffect(() => {
        if (!enabled) return;

        const currentErrors = validationErrors || {};
        const prevErrors = prevErrorsRef.current || {};

        // * Check for new errors
        const newErrors = Object.keys(currentErrors).filter(
            field => currentErrors[field] && !prevErrors[field]
        );

        // * Check for resolved errors
        const resolvedErrors = Object.keys(prevErrors).filter(
            field => !currentErrors[field] && prevErrors[field]
        );

        if (newErrors.length > 0) {
            logger[logLevel]('FormValidation', 'New validation errors', {
                newErrors: newErrors.map(field => ({
                    field,
                    error: currentErrors[field]
                })),
                totalErrors: Object.keys(currentErrors).length,
                timestamp: new Date().toISOString()
            });
        }

        if (resolvedErrors.length > 0) {
            logger[logLevel]('FormValidation', 'Validation errors resolved', {
                resolvedErrors,
                remainingErrors: Object.keys(currentErrors).length,
                timestamp: new Date().toISOString()
            });
        }

        prevErrorsRef.current = validationErrors;
    }, [validationErrors, enabled, logLevel]);
}

// * Hook to debug form submission
export function useFormSubmissionDebug(options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'info'
    } = options;

    const debugSubmit = (formData, submitHandler) => {
        if (!enabled) return submitHandler;

        return async (...args) => {
            const startTime = performance.now();

            logger[logLevel]('FormSubmission', 'Form submission started', {
                formData,
                fieldCount: Object.keys(formData).length,
                filledFields: Object.keys(formData).filter(key =>
                    formData[key] && formData[key].toString().trim() !== ''
                ).length,
                timestamp: new Date().toISOString()
            });

            try {
                const result = await submitHandler(...args);
                const duration = performance.now() - startTime;

                logger[logLevel]('FormSubmission', 'Form submission successful', {
                    duration: Math.round(duration * 100) / 100,
                    result,
                    timestamp: new Date().toISOString()
                });

                return result;
            } catch (error) {
                const duration = performance.now() - startTime;

                logger.error('FormSubmission', 'Form submission failed', {
                    duration: Math.round(duration * 100) / 100,
                    error: {
                        message: error.message,
                        stack: error.stack
                    },
                    timestamp: new Date().toISOString()
                });

                throw error;
            }
        };
    };

    return debugSubmit;
}

// * Hook to track form field statistics
export function useFormStats(formData, options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'debug',
        interval = 5000 // Log stats every 5 seconds
    } = options;

    useEffect(() => {
        if (!enabled) return;

        const logFormStats = () => {
            const fields = Object.keys(formData);
            const filledFields = fields.filter(key =>
                formData[key] && formData[key].toString().trim() !== ''
            );
            const emptyFields = fields.filter(key =>
                !formData[key] || formData[key].toString().trim() === ''
            );

            const totalCharacters = fields.reduce((total, key) => {
                const value = formData[key];
                return total + (value ? value.toString().length : 0);
            }, 0);

            logger[logLevel]('FormStats', 'Form statistics', {
                totalFields: fields.length,
                filledFields: filledFields.length,
                emptyFields: emptyFields.length,
                completionPercentage: Math.round((filledFields.length / fields.length) * 100),
                totalCharacters,
                averageCharactersPerField: Math.round(totalCharacters / fields.length),
                longestField: fields.reduce((longest, key) => {
                    const value = formData[key];
                    const length = value ? value.toString().length : 0;
                    return length > longest.length ? { field: key, length } : longest;
                }, { field: '', length: 0 }),
                timestamp: new Date().toISOString()
            });
        };

        const intervalId = setInterval(logFormStats, interval);
        return () => clearInterval(intervalId);
    }, [formData, enabled, logLevel, interval]);
} 