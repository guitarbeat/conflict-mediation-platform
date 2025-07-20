import { useEffect, useRef, useCallback } from 'react';
import logger from '../utils/logger';

// * Hook to log state changes for debugging
export function useDebugState(state, context, options = {}) {
    const { enabled = import.meta.env.DEV, logLevel = 'debug' } = options;
    const prevStateRef = useRef();

    useEffect(() => {
        if (!enabled) return;

        const prevState = prevStateRef.current;
        if (prevState !== undefined && prevState !== state) {
            logger[logLevel](context, 'State changed', {
                previous: prevState,
                current: state,
                diff: getStateDiff(prevState, state),
            });
        }
        prevStateRef.current = state;
    }, [state, context, enabled, logLevel]);
}

// * Hook to debug effect dependencies
export function useDebugEffect(effect, deps, context, options = {}) {
    const { enabled = import.meta.env.DEV, logLevel = 'debug' } = options;
    const prevDepsRef = useRef();

    useEffect(() => {
        if (!enabled) return;

        const prevDeps = prevDepsRef.current;
        if (prevDeps !== undefined) {
            const changedDeps = deps.map((dep, index) => ({
                index,
                previous: prevDeps[index],
                current: dep,
                changed: prevDeps[index] !== dep,
            })).filter(dep => dep.changed);

            if (changedDeps.length > 0) {
                logger[logLevel](context, 'Effect dependencies changed', {
                    changedDeps,
                    allDeps: deps,
                });
            }
        }
        prevDepsRef.current = deps;
    }, deps);

    useEffect(() => {
        if (enabled) {
            logger[logLevel](context, 'Effect running', { deps });
        }
        return effect();
    }, deps);
}

// * Hook to debug callback stability
export function useDebugCallback(callback, deps, context, options = {}) {
    const { enabled = import.meta.env.DEV, logLevel = 'debug' } = options;
    const callbackRef = useRef();
    const depsRef = useRef();

    useEffect(() => {
        if (!enabled) return;

        const prevDeps = depsRef.current;
        if (prevDeps !== undefined) {
            const changedDeps = deps.map((dep, index) => ({
                index,
                previous: prevDeps[index],
                current: dep,
                changed: prevDeps[index] !== dep,
            })).filter(dep => dep.changed);

            if (changedDeps.length > 0) {
                logger[logLevel](context, 'Callback dependencies changed', {
                    changedDeps,
                    allDeps: deps,
                });
            }
        }
        depsRef.current = deps;
    }, deps);

    const wrappedCallback = useCallback((...args) => {
        if (enabled) {
            logger[logLevel](context, 'Callback called', { args });
        }
        return callback(...args);
    }, [callback, context, enabled, logLevel]);

    return wrappedCallback;
}

// * Hook to debug component lifecycle
export function useDebugLifecycle(componentName, options = {}) {
    const { enabled = import.meta.env.DEV, logLevel = 'debug' } = options;

    useEffect(() => {
        if (enabled) {
            logger[logLevel](componentName, 'Component mounted');
        }
        return () => {
            if (enabled) {
                logger[logLevel](componentName, 'Component unmounted');
            }
        };
    }, [componentName, enabled, logLevel]);
}

// * Hook to debug performance
export function useDebugPerformance(context, options = {}) {
    const { enabled = import.meta.env.DEV, logLevel = 'debug' } = options;
    const renderCountRef = useRef(0);
    const lastRenderTimeRef = useRef(Date.now());

    useEffect(() => {
        if (!enabled) return;

        renderCountRef.current += 1;
        const now = Date.now();
        const timeSinceLastRender = now - lastRenderTimeRef.current;
        lastRenderTimeRef.current = now;

        logger[logLevel](context, 'Component rendered', {
            renderCount: renderCountRef.current,
            timeSinceLastRender,
            timestamp: now,
        });
    });
}

// * Hook to debug async operations
export function useDebugAsync(context, options = {}) {
    const { enabled = import.meta.env.DEV, logLevel = 'debug' } = options;

    const debugAsync = useCallback(async (asyncFn, operationName) => {
        if (!enabled) return asyncFn();

        const startTime = Date.now();
        logger[logLevel](context, `${operationName} started`);

        try {
            const result = await asyncFn();
            const duration = Date.now() - startTime;
            logger[logLevel](context, `${operationName} completed`, {
                duration,
                success: true,
            });
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            logger.error(context, `${operationName} failed`, {
                duration,
                error,
            });
            throw error;
        }
    }, [context, enabled, logLevel]);

    return debugAsync;
}

// * Utility function to get state differences
function getStateDiff(prevState, currentState) {
    if (typeof prevState !== 'object' || typeof currentState !== 'object') {
        return { type: 'primitive', changed: prevState !== currentState };
    }

    if (prevState === null || currentState === null) {
        return { type: 'null', changed: prevState !== currentState };
    }

    const diff = {};
    const allKeys = new Set([...Object.keys(prevState), ...Object.keys(currentState)]);
    let hasChanges = false;

    for (const key of allKeys) {
        const prevValue = prevState[key];
        const currentValue = currentState[key];

        if (prevValue !== currentValue) {
            diff[key] = {
                previous: prevValue,
                current: currentValue,
            };
            hasChanges = true;
        }
    }

    return hasChanges ? diff : null;
}

// * Hook to debug form state
export function useDebugForm(formData, context, options = {}) {
    const { enabled = import.meta.env.DEV, logLevel = 'debug' } = options;
    const prevFormDataRef = useRef();

    useEffect(() => {
        if (!enabled) return;

        const prevFormData = prevFormDataRef.current;
        if (prevFormData !== undefined) {
            const changedFields = Object.keys(formData).filter(
                key => prevFormData[key] !== formData[key]
            );

            if (changedFields.length > 0) {
                logger[logLevel](context, 'Form data changed', {
                    changedFields,
                    changes: changedFields.reduce((acc, field) => {
                        acc[field] = {
                            previous: prevFormData[field],
                            current: formData[field],
                        };
                        return acc;
                    }, {}),
                });
            }
        }
        prevFormDataRef.current = { ...formData };
    }, [formData, context, enabled, logLevel]);
} 