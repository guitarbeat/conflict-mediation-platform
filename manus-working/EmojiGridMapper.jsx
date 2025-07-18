import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './ui/badge';

const EmojiGridMapper = ({ 
  onEmotionWordsChange, 
  onChartPositionChange, 
  selectedEmotionWords = [], 
  chartPosition = null 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(chartPosition || { x: 250, y: 250 });
  const containerRef = useRef(null);

  const emotionWords = [
    'happy', 'sad', 'angry', 'frustrated', 'excited', 'calm', 'anxious', 'content',
    'grateful', 'overwhelmed', 'hopeful', 'confused', 'proud', 'embarrassed', 'relieved', 'worried',
    'surprised', 'lonely', 'confident', 'guilty', 'peaceful', 'irritated', 'joyful', 'stressed',
    'bored', 'enthusiastic', 'nervous', 'satisfied', 'disappointed', 'curious'
  ];

  // Calculate valence and arousal based on position
  const calculateEmotionData = (x, y) => {
    const centerX = 250;
    const centerY = 250;
    const radius = 200;
    
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
      label
    };
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = 250;
    const centerY = 250;
    const radius = 200;
    
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Constrain to circle
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > radius) {
      const angle = Math.atan2(dy, dx);
      x = centerX + Math.cos(angle) * radius;
      y = centerY + Math.sin(angle) * radius;
    }
    
    setPosition({ x, y });
    
    const emotionData = calculateEmotionData(x, y);
    onChartPositionChange(emotionData);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = 250;
    const centerY = 250;
    const radius = 200;
    
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    
    // Constrain to circle
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > radius) {
      const angle = Math.atan2(dy, dx);
      x = centerX + Math.cos(angle) * radius;
      y = centerY + Math.sin(angle) * radius;
    }
    
    setPosition({ x, y });
    
    const emotionData = calculateEmotionData(x, y);
    onChartPositionChange(emotionData);
  };

  const handleTouchEnd = () => {
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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  // Update position when chartPosition prop changes
  useEffect(() => {
    if (chartPosition && (chartPosition.x !== position.x || chartPosition.y !== position.y)) {
      setPosition({ x: chartPosition.x, y: chartPosition.y });
    }
  }, [chartPosition]);

  const currentEmotionData = calculateEmotionData(position.x, position.y);

  return (
    <div className="space-y-6">
      {/* Valence-Arousal Chart */}
      <div className="relative">
        <h3 className="text-lg font-semibold mb-4 text-center">Drag the emoji to express your emotional state</h3>
        <div 
          ref={containerRef}
          className="relative w-[500px] h-[500px] mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full border-4 border-primary/30"
          style={{ userSelect: 'none' }}
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
            className={`absolute w-12 h-12 flex items-center justify-center text-2xl bg-background border-2 border-primary rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              isDragging ? 'scale-110 cursor-grabbing' : 'cursor-grab hover:scale-105'
            }`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {currentEmotionData.emoji}
          </div>
        </div>
        
        {/* Current position display */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
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

