import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './ui/badge';

const EmojiGridMapper = ({ 
  onEmotionWordsChange, 
  onChartPositionChange, 
  selectedEmotionWords = [], 
  chartPosition = null 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState(500);
  // Initialize position exactly at center - will be updated by useEffect
  const [position, setPosition] = useState({ x: 250, y: 250 });
  const containerRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Update container size based on actual rendered size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const actualSize = Math.min(rect.width, rect.height);

        setContainerSize(actualSize);
      }
    };

    // Initial size update after component mounts
    const initialTimeout = setTimeout(() => {
      updateSize();
      
      // Set up ResizeObserver after initial update
      if (containerRef.current && window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
          updateSize();
        });
        resizeObserver.observe(containerRef.current);
        
        // Store observer for cleanup
        containerRef.current._resizeObserver = resizeObserver;
      }
    }, 100);
    
    window.addEventListener('resize', updateSize);
    
    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', updateSize);
      if (containerRef.current?._resizeObserver) {
        containerRef.current._resizeObserver.disconnect();
      }
    };
  }, []);

  const emotionWords = [
    'happy', 'sad', 'angry', 'frustrated', 'excited', 'calm', 'anxious', 'content',
    'grateful', 'overwhelmed', 'hopeful', 'confused', 'proud', 'embarrassed', 'relieved', 'worried',
    'surprised', 'lonely', 'confident', 'guilty', 'peaceful', 'irritated', 'joyful', 'stressed',
    'bored', 'enthusiastic', 'nervous', 'satisfied', 'disappointed', 'curious'
  ];

  // Calculate valence and arousal based on position
  const calculateEmotionData = (x, y, containerSize = 500) => {
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    // Use the same radius calculation as the drag constraint for consistency
    const radius = (containerSize / 2) - 24;
    
    // Calculate distance from center for scaling
    const dx = x - centerX;
    const dy = y - centerY;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    const normalizedDistance = Math.min(distanceFromCenter / radius, 1); // 0 to 1
    
    // Scale factor: 1.0 at center, up to 2.0 at edge
    const scaleFactor = 1 + normalizedDistance;
    
    // Normalize to -1 to 1 range
    const valence = (x - centerX) / radius; // Pleasant (right) to Unpleasant (left)
    const arousal = (centerY - y) / radius; // High energy (top) to Low energy (bottom)
    
    // Determine emoji and label based on quadrant
    let emoji = '😐';
    let label = 'Neutral';
    
    if (valence > 0 && arousal > 0) {
      emoji = '😊';
      label = 'Pleasant & Energetic';
    } else if (valence > 0 && arousal < 0) {
      emoji = '😌';
      label = 'Pleasant & Calm';
    } else if (valence < 0 && arousal > 0) {
      emoji = '😠';
      label = 'Unpleasant & Energetic';
    } else if (valence < 0 && arousal < 0) {
      emoji = '😔';
      label = 'Unpleasant & Low Energy';
    }
    
    return {
      x: Math.round(x),
      y: Math.round(y),
      valence: Math.round(valence * 100) / 100,
      arousal: Math.round(arousal * 100) / 100,
      emoji,
      label,
      scaleFactor: Math.round(scaleFactor * 100) / 100
    };
  };

  const handleStart = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const getClientPosition = (e) => {
    return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
  };

  const handleMove = React.useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    
    requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const clientPos = getClientPosition(e);
      
      // Get position relative to container
      let x = clientPos.x - rect.left;
      let y = clientPos.y - rect.top;
      
      // Constrain to circular boundary
      const centerX = containerSize / 2;
      const centerY = containerSize / 2;
      const maxRadius = (containerSize / 2) - 24; // Subtract emoji radius (24px) to keep it fully inside
      
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > maxRadius) {
        // Scale back to the circle edge
        const scale = maxRadius / distance;
        x = centerX + dx * scale;
        y = centerY + dy * scale;
      }
      
      setPosition({ x, y });
      
      const emotionData = calculateEmotionData(x, y, containerSize);
      onChartPositionChange(emotionData);
    });
  }, [isDragging, onChartPositionChange, containerSize]);

  const handleEnd = () => {
    setIsDragging(false);
  };

  const toggleEmotionWord = (word) => {
    const newWords = selectedEmotionWords.includes(word)
      ? selectedEmotionWords.filter(w => w !== word)
      : [...selectedEmotionWords, word];
    onEmotionWordsChange(newWords);
  };

  useEffect(() => {
    if (isDragging) {
      // Add both mouse and touch event listeners
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, handleMove]);

  // Single useEffect to handle all position initialization and updates
  useEffect(() => {
    // If we have a chartPosition from props, use that
    if (chartPosition) {
      setPosition({ x: chartPosition.x, y: chartPosition.y });
    } else {
      // Otherwise, center exactly in the container based on current container size
      const exactCenter = containerSize / 2;

      setPosition({ x: exactCenter, y: exactCenter });
      
      // Also notify parent of the centered position
      if (onChartPositionChange) {
        const emotionData = calculateEmotionData(exactCenter, exactCenter, containerSize);
        onChartPositionChange(emotionData);
      }
    }
  }, [containerSize, chartPosition]);

  const currentEmotionData = calculateEmotionData(position.x, position.y, containerSize);

  // Use normal pointer cursor instead of emoji cursor

  return (
    <div className="space-y-4 sm:space-y-6" data-interactive-component="emoji-mapper">
      {/* Valence-Arousal Chart */}
      <div className="relative">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center px-2">Drag the emoji to express your emotional state</h3>
        <div className="overflow-x-auto pb-4">
          <div 
            ref={containerRef}
            className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto rounded-full flex-shrink-0 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
            style={{ 
              userSelect: 'none',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255,255,255,0.2)',
              cursor: 'pointer',
            }}
          >
          {/* Axis labels */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">
            High Energy
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">
            Low Energy
          </div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-muted-foreground">
            Unpleasant
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 text-sm font-medium text-muted-foreground">
            Pleasant
          </div>
          
          {/* Center lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border opacity-30"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border opacity-30"></div>
          
          {/* Draggable emoji */}
          <div
            className="absolute w-12 h-12 flex items-center justify-center text-2xl rounded-full backdrop-blur-md border border-white/30"
            style={{
              left: `${(position.x / containerSize) * 100}%`,
              top: `${(position.y / containerSize) * 100}%`,
              transform: `translate(-50%, -50%) scale(${currentEmotionData.scaleFactor * (isDragging ? 1.1 : 1)})`,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255,255,255,0.3)',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          >
            {currentEmotionData.emoji}
          </div>
        </div>
      </div>
        
        {/* Current position display */}
        <div className="mt-4 text-center">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border border-white/20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            <span className="text-2xl">{currentEmotionData.emoji}</span>
            <div className="text-sm">
              <div className="font-medium">{currentEmotionData.label}</div>
              <div className="text-muted-foreground">
                Valence: {currentEmotionData.valence > 0 ? '+' : ''}{currentEmotionData.valence} | 
                Arousal: {currentEmotionData.arousal > 0 ? '+' : ''}{currentEmotionData.arousal}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emotion Words Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Or select emotion words that describe how you feel:</h3>
        <div className="flex flex-wrap gap-2">
          {emotionWords.map((word) => (
            <Badge
              key={word}
              variant={selectedEmotionWords.includes(word) ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedEmotionWords.includes(word) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => toggleEmotionWord(word)}
            >
              {word}
            </Badge>
          ))}
        </div>
        
        {selectedEmotionWords.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Selected emotions:</div>
            <div className="flex flex-wrap gap-1">
              {selectedEmotionWords.map(word => (
                <Badge key={word} variant="secondary" className="text-xs">
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiGridMapper;

