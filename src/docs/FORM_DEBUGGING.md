# Form Debugging Guide

This guide explains how to use the form debugging tools to track and monitor form interactions in real-time.

## 🎯 **What Form Debugging Tracks**

### **Field-Level Interactions**
- **Focus/Blur Events**: When users click into and out of fields
- **Value Changes**: Every character typed, deleted, or pasted
- **Keyboard Events**: Key presses, shortcuts, and special keys
- **Copy/Paste Operations**: Text copied from or pasted into fields
- **Character Counts**: Length of field content
- **Empty/Non-empty Status**: Whether fields have content

### **Form-Level Statistics**
- **Completion Percentage**: How much of the form is filled
- **Total Characters**: Combined length of all field content
- **Field Usage**: Which fields are most/least used
- **Average Characters**: Average content length per field
- **Longest Field**: Field with the most content

### **Validation & Submission**
- **Validation Errors**: When fields fail validation
- **Error Resolution**: When validation errors are fixed
- **Submission Data**: What data is being submitted
- **Submission Timing**: How long submissions take

## 🛠️ **How to Use Form Debugging**

### **1. Basic Field Debugging**

Add debugging to any form field:

```javascript
import { useFormFieldDebug } from '../hooks/use-form-debug';

function MyFormField({ fieldName, value, onChange }) {
  // * Get debug handlers
  const debugHandlers = useFormFieldDebug(fieldName, value);

  return (
    <Input
      value={value}
      onChange={onChange}
      {...debugHandlers} // * Add all debug handlers
    />
  );
}
```

### **2. Form Statistics Tracking**

Track overall form statistics:

```javascript
import { useFormStats } from '../hooks/use-form-debug';

function MyForm() {
  const [formData, setFormData] = useState({});

  // * Track form statistics
  useFormStats(formData, { 
    logLevel: 'info',
    interval: 5000 // Log every 5 seconds
  });

  return (
    <form>
      {/* Your form fields */}
    </form>
  );
}
```

### **3. Form Validation Debugging**

Track validation errors:

```javascript
import { useFormValidationDebug } from '../hooks/use-form-debug';

function MyForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // * Track validation errors
  useFormValidationDebug(formData, errors);

  return (
    <form>
      {/* Your form fields */}
    </form>
  );
}
```

### **4. Form Submission Debugging**

Track form submissions:

```javascript
import { useFormSubmissionDebug } from '../hooks/use-form-debug';

function MyForm() {
  const [formData, setFormData] = useState({});
  
  // * Get debug submit handler
  const debugSubmit = useFormSubmissionDebug();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // * Wrap your submit function
    const submitWithDebug = debugSubmit(formData, async () => {
      // Your actual submission logic
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      return response.json();
    });

    await submitWithDebug();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  );
}
```

## 📊 **Debug Panel Integration**

### **Form Debug Tab**

The debug panel includes a dedicated "Form Debug" tab that shows:

1. **Form Debug Controls**
   - Toggle to enable/disable form debugging
   - Real-time form statistics

2. **Usage Instructions**
   - Code examples for implementing debugging
   - Best practices for form debugging

3. **Statistics Overview**
   - What information is tracked
   - How to interpret the data

### **Real-Time Logs**

All form interactions appear in the "Logs" tab:

```
[FormField] partyAName focused
[FormField] partyAName value changed { previousValue: "", newValue: "John" }
[FormField] partyAName key pressed { key: "n", currentValue: "Joh" }
[FormStats] Form statistics { completionPercentage: 15, totalCharacters: 45 }
```

## 🎯 **Common Debugging Scenarios**

### **Tracking User Input Patterns**

```javascript
const debugHandlers = useFormFieldDebug('email', value, {
  trackFocus: true,
  trackChanges: true,
  trackValidation: true
});
```

This will show:
- How long users spend in each field
- Typing patterns and corrections
- Copy/paste behavior
- Field completion rates

### **Identifying Problem Fields**

```javascript
useFormStats(formData, { 
  logLevel: 'warn',
  interval: 10000 // Log every 10 seconds
});
```

This helps identify:
- Fields that are frequently left empty
- Fields with unusually long content
- Fields that cause validation errors
- Performance bottlenecks

### **Monitoring Form Submissions**

```javascript
const debugSubmit = useFormSubmissionDebug({
  logLevel: 'info'
});
```

This tracks:
- Submission timing
- Data size and complexity
- Error rates and types
- Success/failure patterns

## 🔧 **Advanced Configuration**

### **Custom Log Levels**

```javascript
const debugHandlers = useFormFieldDebug('fieldName', value, {
  logLevel: 'debug', // ERROR, WARN, INFO, DEBUG, TRACE
  trackFocus: true,
  trackChanges: true,
  trackValidation: true
});
```

### **Performance Monitoring**

```javascript
useFormStats(formData, {
  enabled: import.meta.env.DEV,
  logLevel: 'info',
  interval: 5000 // How often to log statistics
});
```

### **Selective Debugging**

```javascript
// Only debug specific fields
const importantFields = ['email', 'password', 'confirmPassword'];
const debugHandlers = importantFields.includes(fieldName) 
  ? useFormFieldDebug(fieldName, value)
  : {};
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **No logs appearing**
   - Check that form debugging is enabled in the debug panel
   - Verify the log level is set appropriately
   - Ensure you're in development mode

2. **Too many logs**
   - Increase the log level (ERROR, WARN, INFO)
   - Reduce the statistics logging interval
   - Disable specific tracking options

3. **Performance impact**
   - Form debugging is automatically disabled in production
   - Use selective debugging for critical fields only
   - Monitor memory usage in the Performance tab

### **Best Practices**

1. **Use descriptive field names**
   ```javascript
   useFormFieldDebug('userEmailAddress', value) // Good
   useFormFieldDebug('field1', value) // Bad
   ```

2. **Group related fields**
   ```javascript
   useFormFieldDebug('personalInfo.firstName', value)
   useFormFieldDebug('personalInfo.lastName', value)
   ```

3. **Monitor form completion**
   ```javascript
   useFormStats(formData, { 
     logLevel: 'info',
     interval: 10000 
   });
   ```

4. **Track validation patterns**
   ```javascript
   useFormValidationDebug(formData, validationErrors);
   ```

## 📈 **Analyzing Debug Data**

### **User Behavior Patterns**
- **Field Focus Order**: Which fields users visit first
- **Typing Speed**: How quickly users type in different fields
- **Correction Patterns**: How often users edit their input
- **Completion Rates**: Which fields are most/least completed

### **Form Behavior**
- **Submission Times**: How long form submissions take
- **Error Rates**: Which fields cause the most validation errors
- **Data Quality**: Average content length and complexity
- **User Flow**: How users progress through the form

### **Technical Issues**
- **Event Handling**: Any issues with event listeners
- **State Management**: Problems with form state updates
- **Validation Logic**: Issues with validation rules

This form debugging system provides comprehensive insights into user interactions and form performance, helping you create better user experiences and identify potential issues early in development. 