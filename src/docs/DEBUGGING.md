# Debugging Guide

This document outlines the debugging tools and techniques available in the Conflict Mediation Platform.

## 🛠️ Debug Tools Overview

### 1. **Centralized Logging System** (`src/utils/logger.js`)

A comprehensive logging utility that provides:
- **Multiple log levels**: ERROR, WARN, INFO, DEBUG, TRACE
- **Contextual logging**: Each log includes component context
- **Performance timing**: Built-in timing utilities
- **Log history**: In-memory log storage with export capabilities
- **Runtime configuration**: Change log levels without restart

#### Usage Examples:
```javascript
import logger from '../utils/logger';

// Basic logging
logger.info('ComponentName', 'User clicked button');
logger.warn('ComponentName', 'Slow operation detected', { duration: 1500 });
logger.error('ComponentName', 'API call failed', error);

// Performance logging
logger.time('ComponentName', 'expensiveOperation');
// ... expensive operation
logger.timeEnd('ComponentName', 'expensiveOperation');
```

### 2. **Error Boundary** (`src/components/ErrorBoundary.jsx`)

Catches React errors and provides:
- **Graceful error handling**: Prevents app crashes
- **Error details**: Shows error message and stack trace
- **Debug information**: Component stack and props
- **Recovery options**: Try again functionality

### 3. **Debug Hooks** (`src/hooks/use-debug.js`)

Custom hooks for debugging React patterns:

#### `useDebugState(state, context, options)`
Monitors state changes and logs differences:
```javascript
import { useDebugState } from '../hooks/use-debug';

function MyComponent() {
  const [count, setCount] = useState(0);
  useDebugState(count, 'MyComponent', { logLevel: 'debug' });
  // ...
}
```

#### `useDebugForm(formData, context, options)`
Tracks form data changes:
```javascript
import { useDebugForm } from '../hooks/use-debug';

function MyForm() {
  const [formData, setFormData] = useState({});
  useDebugForm(formData, 'MyForm');
  // ...
}
```

#### `useDebugLifecycle(componentName, options)`
Logs component mount/unmount:
```javascript
import { useDebugLifecycle } from '../hooks/use-debug';

function MyComponent() {
  useDebugLifecycle('MyComponent');
  // ...
}
```

### 4. **Performance Monitoring** (`src/hooks/use-performance.js`)

Hooks for monitoring application performance:

#### `useRenderPerformance(componentName, options)`
Monitors render performance and memory usage:
```javascript
import { useRenderPerformance } from '../hooks/use-performance';

function MyComponent() {
  useRenderPerformance('MyComponent', { 
    threshold: 16, // 16ms = 60fps
    trackMemory: true 
  });
  // ...
}
```

#### `useAsyncPerformance(context, options)`
Monitors async operation performance:
```javascript
import { useAsyncPerformance } from '../hooks/use-performance';

function MyComponent() {
  const debugAsync = useAsyncPerformance('MyComponent');
  
  const handleAsyncOperation = async () => {
    await debugAsync(async () => {
      // async operation
    }, 'fetchData');
  };
}
```

### 5. **Debug Panel** (`src/components/DebugPanel.jsx`)

Interactive debugging interface (development only):
- **Log level control**: Change logging verbosity
- **Real-time logs**: View recent log entries
- **Performance metrics**: Memory usage and timing
- **Export capabilities**: Download logs as JSON
- **Quick actions**: Test logging functionality

## 🔧 Debugging Workflow

### 1. **Setting Up Debugging**

1. **Enable Debug Panel**: The debug panel appears automatically in development mode
2. **Set Log Level**: Use the debug panel to adjust log verbosity
3. **Add Debug Hooks**: Integrate debug hooks into components you want to monitor

### 2. **Common Debugging Scenarios**

#### **State Management Issues**
```javascript
// Add to component with state issues
useDebugState(myState, 'ComponentName');
useDebugForm(formData, 'FormComponent');
```

#### **Performance Problems**
```javascript
// Add to slow components
useRenderPerformance('SlowComponent', { threshold: 16 });
useAsyncPerformance('SlowComponent');
```

#### **Effect Dependencies**
```javascript
// Replace useEffect with debug version
const debugEffect = useDebugEffect(effect, deps, 'ComponentName');
useEffect(debugEffect, deps);
```

#### **Event Handler Issues**
```javascript
// Wrap event handlers
const debugHandler = useEventHandlerPerformance('ComponentName');
const handleClick = debugHandler(originalHandler, 'click');
```

### 3. **Analyzing Logs**

#### **Log Format**
```
2024-01-15T10:30:45.123Z INFO [ComponentName] User clicked button
2024-01-15T10:30:45.124Z DEBUG [ComponentName] State changed { previous: 0, current: 1 }
2024-01-15T10:30:45.125Z WARN [ComponentName] Slow render detected { renderTime: 25.5, threshold: 16 }
```

#### **Log Levels**
- **ERROR**: Critical issues that need immediate attention
- **WARN**: Potential problems or performance issues
- **INFO**: General application flow
- **DEBUG**: Detailed debugging information
- **TRACE**: Very detailed tracing (use sparingly)

### 4. **Performance Analysis**

#### **Memory Monitoring**
- Check memory usage in debug panel
- Look for memory leaks (increasing usage over time)
- Monitor heap size limits

#### **Render Performance**
- Watch for slow renders (>16ms)
- Identify components that render too frequently
- Check for unnecessary re-renders

#### **Async Operations**
- Monitor operation duration
- Identify slow API calls
- Track error rates

## 🚨 Troubleshooting Common Issues

### **High Memory Usage**
1. Check memory metrics in debug panel
2. Look for components not unmounting properly
3. Check for event listener leaks
4. Monitor for large objects in state

### **Slow Renders**
1. Use `useRenderPerformance` to identify slow components
2. Check for expensive calculations in render
3. Look for unnecessary re-renders
4. Consider memoization with `useMemo` and `useCallback`

### **State Update Issues**
1. Use `useDebugState` to track state changes
2. Check for stale closures
3. Verify dependency arrays in hooks
4. Look for infinite update loops

### **Async Operation Failures**
1. Use `useAsyncPerformance` to monitor operations
2. Check error logs for specific failure reasons
3. Verify API endpoints and network connectivity
4. Look for timeout issues

## 📊 Debug Panel Features

### **Controls**
- **Log Level**: Adjust verbosity (ERROR, WARN, INFO, DEBUG, TRACE)
- **Export Logs**: Download logs as JSON file
- **Clear Logs**: Reset log history
- **Performance**: Real-time memory usage

### **Log Viewer**
- **Real-time updates**: Logs appear as they happen
- **Level filtering**: Color-coded by log level
- **Expandable details**: Click to see full log data
- **Search**: Filter logs by content

### **Quick Actions**
- **Test Log**: Generate test log entry
- **Test Warning**: Generate test warning
- **Test Error**: Generate test error

## 🔒 Production Considerations

### **Automatic Disabling**
- Debug panel only appears in development
- Debug hooks are automatically disabled in production
- Log levels default to WARN in production

### **Performance Impact**
- Debug tools have minimal impact when disabled
- Log history is limited to 1000 entries
- Performance monitoring uses efficient APIs

### **Security**
- No sensitive data in logs by default
- Logs are not sent to external services
- Debug information is client-side only

## 📝 Best Practices

### **When to Use Debug Tools**
- ✅ During development and testing
- ✅ When investigating specific issues
- ✅ For performance optimization
- ✅ When adding new features

### **When Not to Use**
- ❌ In production code
- ❌ For user-facing features
- ❌ When performance is critical
- ❌ For logging sensitive information

### **Logging Guidelines**
- Use descriptive context names
- Include relevant data with logs
- Use appropriate log levels
- Keep log messages concise but informative

### **Performance Monitoring**
- Set realistic thresholds
- Monitor key user interactions
- Track memory usage over time
- Focus on user-perceived performance

## 🆘 Getting Help

### **Debug Panel Shortcuts**
- Press `Ctrl/Cmd + Shift + D` to open debug panel
- Use browser console: `window.logger.getLogHistory()`
- Change log level: `window.setLogLevel(LOG_LEVELS.DEBUG)`

### **Common Commands**
```javascript
// Get all logs
window.logger.getLogHistory()

// Export logs
window.logger.exportLogs()

// Clear logs
window.logger.clearLogHistory()

// Change log level
window.setLogLevel(3) // DEBUG level
```

### **Reporting Issues**
When reporting debugging-related issues, include:
1. Log level setting
2. Relevant log entries
3. Performance metrics
4. Steps to reproduce
5. Browser and device information 