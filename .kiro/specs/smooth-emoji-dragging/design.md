# Design Document

## Overview

The current emoji dragging implementation suffers from performance issues that cause lag and delay during user interaction. The primary causes are:

1. **React state updates causing re-renders on every mouse move**
2. **Heavy calculations performed synchronously in event handlers**
3. **Inefficient event listener management**
4. **Lack of RAF (RequestAnimationFrame) optimization for smooth animations**

This design implements a high-performance dragging system using modern web APIs and React optimization patterns.

## Architecture

### Core Components

1. **Drag State Manager**: Manages dragging state with minimal React re-renders
2. **Position Calculator**: Optimized position and constraint calculations
3. **Animation Controller**: RAF-based smooth position updates
4. **Event Handler System**: Optimized mouse/touch event processing

### Data Flow

```
User Input (Mouse/Touch) → Event Handler → Position Calculator → Animation Controller → DOM Update
                                                                                    ↓
                                                                            React State (Debounced)
```

## Components and Interfaces

### Enhanced Dragging Hook

```typescript
interface DragState {
  isDragging: boolean;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  offset: { x: number; y: number };
}

interface DragConfig {
  constraintRadius: number;
  centerPoint: { x: number; y: number };
  onPositionChange: (position: EmotionData) => void;
}

const useSmoothDrag = (config: DragConfig) => {
  // Returns optimized drag handlers and current position
}
```

### Position Calculation System

```typescript
interface PositionCalculator {
  calculateConstrainedPosition(
    mouseX: number, 
    mouseY: number, 
    bounds: DOMRect,
    constraint: CircularConstraint
  ): { x: number; y: number };
  
  calculateEmotionData(position: { x: number; y: number }): EmotionData;
}
```

### Animation Controller

```typescript
interface AnimationController {
  scheduleUpdate(position: { x: number; y: number }): void;
  cancelPendingUpdates(): void;
  setUpdateCallback(callback: (position: { x: number; y: number }) => void): void;
}
```

## Data Models

### Enhanced Position State

```typescript
interface EmojiPosition {
  // Visual position (for immediate DOM updates)
  displayX: number;
  displayY: number;
  
  // Logical position (for React state)
  logicalX: number;
  logicalY: number;
  
  // Animation state
  isAnimating: boolean;
  targetX: number;
  targetY: number;
}
```

### Drag Performance Metrics

```typescript
interface DragMetrics {
  frameRate: number;
  eventProcessingTime: number;
  renderTime: number;
  memoryUsage: number;
}
```

## Error Handling

### Event Handler Errors
- Wrap all event handlers in try-catch blocks
- Gracefully handle missing DOM elements
- Provide fallback behavior for constraint calculations

### Performance Degradation
- Monitor frame rate and automatically adjust update frequency
- Implement progressive enhancement for lower-end devices
- Provide fallback to basic dragging if advanced features fail

### Memory Management
- Ensure all RAF callbacks are cancelled on unmount
- Clean up event listeners properly
- Avoid memory leaks from closure references

## Testing Strategy

### Unit Tests
- Position calculation accuracy
- Constraint boundary enforcement
- Event handler behavior
- Memory leak prevention

### Performance Tests
- Frame rate measurement during dragging
- Memory usage monitoring
- Event processing latency
- Stress testing with rapid mouse movements

### Integration Tests
- Cross-browser compatibility
- Touch device functionality
- Accessibility compliance
- React state synchronization

### User Experience Tests
- Perceived smoothness evaluation
- Precision of positioning
- Responsiveness across devices
- Edge case handling (fast movements, boundary conditions)

## Implementation Approach

### Phase 1: Core Optimization
1. Implement RAF-based position updates
2. Separate visual updates from React state updates
3. Optimize position calculations
4. Add proper event listener cleanup

### Phase 2: Advanced Features
1. Implement adaptive performance scaling
2. Add touch gesture optimization
3. Enhance constraint handling
4. Add performance monitoring

### Phase 3: Polish and Testing
1. Cross-browser testing and fixes
2. Performance benchmarking
3. Accessibility improvements
4. Documentation and code cleanup

## Performance Optimizations

### RequestAnimationFrame Usage
- Use RAF for all visual updates to sync with browser refresh rate
- Batch multiple position updates within single frame
- Cancel unnecessary RAF callbacks

### Event Throttling
- Implement intelligent event throttling based on device capabilities
- Use passive event listeners where possible
- Minimize work done in event handlers

### React Optimizations
- Use useCallback with stable dependencies
- Implement useMemo for expensive calculations
- Separate visual state from logical state
- Use refs for DOM manipulation to avoid re-renders

### Memory Management
- Reuse calculation objects to reduce garbage collection
- Use object pooling for frequently created objects
- Implement proper cleanup in useEffect returns