import { useEffect, useRef, useCallback } from 'react';
import logger from '../utils/logger';

// * Hook to monitor component render performance
export function useRenderPerformance(componentName, options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'debug',
        threshold = 16, // * 16ms = 60fps threshold
        trackMemory = false
    } = options;

    const renderCountRef = useRef(0);
    const lastRenderTimeRef = useRef(performance.now());
    const startTimeRef = useRef(performance.now());

    useEffect(() => {
        if (!enabled) return;

        const now = performance.now();
        const renderTime = now - lastRenderTimeRef.current;
        renderCountRef.current += 1;

        // * Log slow renders
        if (renderTime > threshold) {
            logger.warn(componentName, 'Slow render detected', {
                renderTime: Math.round(renderTime * 100) / 100,
                threshold,
                renderCount: renderCountRef.current,
                timeSinceMount: Math.round((now - startTimeRef.current) * 100) / 100,
            });
        }

        // * Log memory usage if enabled
        if (trackMemory && performance.memory) {
            const memory = performance.memory;
            logger[logLevel](componentName, 'Memory usage', {
                usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
                totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
                jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100,
            });
        }

        lastRenderTimeRef.current = now;
    });
}

// * Hook to monitor async operation performance
export function useAsyncPerformance(context, options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'debug',
        threshold = 1000 // * 1 second threshold
    } = options;

    const debugAsync = useCallback(async (asyncFn, operationName) => {
        if (!enabled) return asyncFn();

        const startTime = performance.now();
        logger[logLevel](context, `${operationName} started`);

        try {
            const result = await asyncFn();
            const duration = performance.now() - startTime;

            if (duration > threshold) {
                logger.warn(context, `${operationName} took longer than expected`, {
                    duration: Math.round(duration * 100) / 100,
                    threshold,
                });
            } else {
                logger[logLevel](context, `${operationName} completed`, {
                    duration: Math.round(duration * 100) / 100,
                });
            }

            return result;
        } catch (error) {
            const duration = performance.now() - startTime;
            logger.error(context, `${operationName} failed`, {
                duration: Math.round(duration * 100) / 100,
                error,
            });
            throw error;
        }
    }, [context, enabled, logLevel, threshold]);

    return debugAsync;
}

// * Hook to monitor event handler performance
export function useEventHandlerPerformance(context, options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'debug',
        threshold = 16 // * 16ms threshold for event handlers
    } = options;

    const debugEventHandler = useCallback((handler, eventName) => {
        if (!enabled) return handler;

        return (...args) => {
            const startTime = performance.now();

            try {
                const result = handler(...args);
                const duration = performance.now() - startTime;

                if (duration > threshold) {
                    logger.warn(context, `${eventName} handler took longer than expected`, {
                        duration: Math.round(duration * 100) / 100,
                        threshold,
                        args: args.length,
                    });
                } else {
                    logger[logLevel](context, `${eventName} handler executed`, {
                        duration: Math.round(duration * 100) / 100,
                    });
                }

                return result;
            } catch (error) {
                const duration = performance.now() - startTime;
                logger.error(context, `${eventName} handler failed`, {
                    duration: Math.round(duration * 100) / 100,
                    error,
                });
                throw error;
            }
        };
    }, [context, enabled, logLevel, threshold]);

    return debugEventHandler;
}

// * Hook to monitor state update performance
export function useStateUpdatePerformance(context, options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'debug',
        threshold = 16
    } = options;

    const updateCountRef = useRef(0);
    const lastUpdateTimeRef = useRef(performance.now());

    const debugStateUpdate = useCallback((updater, updateName = 'state') => {
        if (!enabled) return updater;

        return (...args) => {
            const startTime = performance.now();
            updateCountRef.current += 1;

            try {
                const result = updater(...args);
                const duration = performance.now() - startTime;
                const timeSinceLastUpdate = startTime - lastUpdateTimeRef.current;

                if (duration > threshold) {
                    logger.warn(context, `${updateName} update took longer than expected`, {
                        duration: Math.round(duration * 100) / 100,
                        threshold,
                        updateCount: updateCountRef.current,
                        timeSinceLastUpdate: Math.round(timeSinceLastUpdate * 100) / 100,
                    });
                } else {
                    logger[logLevel](context, `${updateName} update executed`, {
                        duration: Math.round(duration * 100) / 100,
                        updateCount: updateCountRef.current,
                    });
                }

                lastUpdateTimeRef.current = performance.now();
                return result;
            } catch (error) {
                const duration = performance.now() - startTime;
                logger.error(context, `${updateName} update failed`, {
                    duration: Math.round(duration * 100) / 100,
                    error,
                });
                throw error;
            }
        };
    }, [context, enabled, logLevel, threshold]);

    return debugStateUpdate;
}

// * Hook to monitor effect performance
export function useEffectPerformance(context, options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'debug',
        threshold = 16
    } = options;

    const debugEffect = useCallback((effect, deps, effectName = 'effect') => {
        if (!enabled) return effect;

        return () => {
            const startTime = performance.now();

            try {
                const cleanup = effect();
                const duration = performance.now() - startTime;

                if (duration > threshold) {
                    logger.warn(context, `${effectName} took longer than expected`, {
                        duration: Math.round(duration * 100) / 100,
                        threshold,
                        deps,
                    });
                } else {
                    logger[logLevel](context, `${effectName} executed`, {
                        duration: Math.round(duration * 100) / 100,
                        deps,
                    });
                }

                return cleanup;
            } catch (error) {
                const duration = performance.now() - startTime;
                logger.error(context, `${effectName} failed`, {
                    duration: Math.round(duration * 100) / 100,
                    error,
                    deps,
                });
                throw error;
            }
        };
    }, [context, enabled, logLevel, threshold]);

    return debugEffect;
}

// * Hook to monitor overall app performance
export function useAppPerformance(options = {}) {
    const {
        enabled = import.meta.env.DEV,
        logLevel = 'debug',
        interval = 5000 // * Check every 5 seconds
    } = options;

    useEffect(() => {
        if (!enabled) return;

        const intervalId = setInterval(() => {
            // * Monitor frame rate
            if (performance.getEntriesByType) {
                const navigationEntries = performance.getEntriesByType('navigation');
                if (navigationEntries.length > 0) {
                    const nav = navigationEntries[0];
                    logger[logLevel]('AppPerformance', 'Navigation timing', {
                        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart),
                        loadComplete: Math.round(nav.loadEventEnd - nav.loadEventStart),
                        domInteractive: Math.round(nav.domInteractive - nav.fetchStart),
                    });
                }
            }

            // * Monitor memory usage
            if (performance.memory) {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
                const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100;
                const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100;

                logger[logLevel]('AppPerformance', 'Memory status', {
                    usedMB,
                    totalMB,
                    limitMB,
                    usagePercentage: Math.round((usedMB / limitMB) * 100),
                });
            }
        }, interval);

        return () => clearInterval(intervalId);
    }, [enabled, logLevel, interval]);
} 