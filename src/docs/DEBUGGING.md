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

### 4. **Form Debugging** (`src/hooks/use-form-debug.js`)

Hooks for debugging form interactions:

#### `useFormFieldDebug(fieldName, value, options)`
Monitors individual field interactions:
```javascript
import { useFormFieldDebug } from '../hooks/use-form-debug';

function MyFormField({ fieldName, value, onChange }) {
  const debugHandlers = useFormFieldDebug(fieldName, value);
  
  return (
    <Input
      value={value}
      onChange={onChange}
      {...debugHandlers}
    />
  );
}
```

#### `useFormStats(formData, options)`
Tracks overall form statistics:
```javascript
import { useFormStats } from '../hooks/use-form-debug';

function MyForm() {
  const [formData, setFormData] = useState({});
  useFormStats(formData, { logLevel: 'info' });
  // ...
}
```

### 5. **Debug Panel** (`src/components/DebugPanel.jsx`)

Interactive debugging interface (development only):
- **Log level control**: Change logging verbosity
- **Real-time logs**: View recent log entries
- **Form debug tab**: Dedicated form debugging interface
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

#### **Form Interaction Issues**
```javascript
// Add to form components
const debugHandlers = useFormFieldDebug('fieldName', value);
useFormStats(formData, { logLevel: 'info' });
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

### 4. **Form Analysis**

#### **User Interaction Patterns**
- Track field focus order and duration
- Monitor typing patterns and corrections
- Identify copy/paste behavior
- Analyze form completion rates

#### **Form Statistics**
- Monitor overall form completion percentage
- Track character counts and field usage
- Identify problematic or unused fields
- Analyze data quality and complexity

#### **Validation Patterns**
- Track validation error frequency
- Monitor error resolution patterns
- Identify fields with high error rates
- Analyze validation timing

## 🚨 Troubleshooting Common Issues

### **Form Interaction Issues**
1. Check form debug tab in debug panel
2. Look for fields with high error rates
3. Monitor user interaction patterns
4. Analyze form completion statistics

### **Form Validation Problems**
1. Use `useFormValidationDebug` to track validation errors
2. Check for fields with high error rates
3. Monitor validation timing and patterns
4. Analyze error resolution patterns

### **State Update Issues**
1. Use `useDebugState` to track state changes
2. Check for stale closures
3. Verify dependency arrays in hooks
4. Look for infinite update loops

### **Form Submission Issues**
1. Use `useFormSubmissionDebug` to monitor submissions
2. Check error logs for specific failure reasons
3. Verify form data integrity
4. Look for validation issues

## 📊 Debug Panel Features

### **Controls**
- **Log Level**: Adjust verbosity (ERROR, WARN, INFO, DEBUG, TRACE)
- **Export Logs**: Download logs as JSON file
- **Clear Logs**: Reset log history
- **Form Debug**: Toggle form debugging features

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
- Form debugging uses efficient event handling

### **Security**
- No sensitive data in logs by default
- Logs are not sent to external services
- Debug information is client-side only

## 📝 Best Practices

### **When to Use Debug Tools**
- ✅ During development and testing
- ✅ When investigating form issues
- ✅ For user experience optimization
- ✅ When adding new form features

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

### **Form Monitoring**
- Track user interaction patterns
- Monitor form completion rates
- Analyze validation error patterns
- Focus on user experience improvements

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