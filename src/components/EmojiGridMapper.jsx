import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Badge } from "./ui/badge";

// * Constants for emotion mapping and configuration
const EMOTION_WORDS = [
  "happy",
  "sad",
  "angry",
  "frustrated",
  "excited",
  "calm",
  "anxious",
  "content",
  "grateful",
  "overwhelmed",
  "hopeful",
  "confused",
  "proud",
  "embarrassed",
  "relieved",
  "worried",
  "surprised",
  "lonely",
  "confident",
  "guilty",
  "peaceful",
  "irritated",
  "joyful",
  "stressed",
  "bored",
  "enthusiastic",
  "nervous",
  "satisfied",
  "disappointed",
  "curious",
];

// * Emotion recommendation system based on valence-arousal position
const getEmotionRecommendations = (valence, arousal) => {
  const recommendations = {
    // High valence, high arousal (pleasant-energetic)
    "pleasant-energetic": [
      "happy", "excited", "enthusiastic", "joyful", "confident", "proud"
    ],
    // High valence, low arousal (pleasant-calm)
    "pleasant-calm": [
      "content", "calm", "peaceful", "satisfied", "grateful", "relieved"
    ],
    // Low valence, high arousal (unpleasant-energetic)
    "unpleasant-energetic": [
      "angry", "frustrated", "irritated", "stressed", "anxious", "overwhelmed"
    ],
    // Low valence, low arousal (unpleasant-calm)
    "unpleasant-calm": [
      "sad", "disappointed", "lonely", "bored", "guilty", "worried"
    ],
    // Neutral position
    "neutral": [
      "confused", "curious", "surprised", "hopeful", "nervous", "embarrassed"
    ]
  };

  // Determine quadrant based on valence and arousal
  let quadrant = "neutral";
  if (valence > 0.2 && arousal > 0.2) quadrant = "pleasant-energetic";
  else if (valence > 0.2 && arousal < -0.2) quadrant = "pleasant-calm";
  else if (valence < -0.2 && arousal > 0.2) quadrant = "unpleasant-energetic";
  else if (valence < -0.2 && arousal < -0.2) quadrant = "unpleasant-calm";

  return {
    quadrant,
    recommended: recommendations[quadrant] || recommendations.neutral,
    intensity: Math.sqrt(valence * valence + arousal * arousal) // Distance from center
  };
};

// * Color schemes for different emotion quadrants
const EMOTION_COLORS = {
  "pleasant-energetic": {
    primary: "from-yellow-400 to-orange-500",
    secondary: "from-yellow-100 to-orange-100",
    accent: "bg-yellow-500",
    text: "text-yellow-800",
    border: "border-yellow-300"
  },
  "pleasant-calm": {
    primary: "from-green-400 to-emerald-500",
    secondary: "from-green-100 to-emerald-100",
    accent: "bg-green-500",
    text: "text-green-800",
    border: "border-green-300"
  },
  "unpleasant-energetic": {
    primary: "from-red-400 to-rose-500",
    secondary: "from-red-100 to-rose-100",
    accent: "bg-red-500",
    text: "text-red-800",
    border: "border-red-300"
  },
  "unpleasant-calm": {
    primary: "from-blue-400 to-indigo-500",
    secondary: "from-blue-100 to-indigo-100",
    accent: "bg-blue-500",
    text: "text-blue-800",
    border: "border-blue-300"
  },
  "neutral": {
    primary: "from-gray-400 to-slate-500",
    secondary: "from-gray-100 to-slate-100",
    accent: "bg-gray-500",
    text: "text-gray-800",
    border: "border-gray-300"
  }
};

const EMOJI_RADIUS = 24; // * Radius of the draggable emoji in pixels
const DEFAULT_CONTAINER_SIZE = 500;

// * Emotion quadrant mapping for valence-arousal model
const EMOTION_QUADRANTS = {
  "pleasant-energetic": { emoji: "😊", label: "Pleasant & Energetic" },
  "pleasant-calm": { emoji: "😌", label: "Pleasant & Calm" },
  "unpleasant-energetic": { emoji: "😠", label: "Unpleasant & Energetic" },
  "unpleasant-calm": { emoji: "😔", label: "Unpleasant & Low Energy" },
  neutral: { emoji: "😐", label: "Neutral" },
};

// * Custom hook for container size management
const useContainerSize = (containerRef) => {
  const [containerSize, setContainerSize] = useState(DEFAULT_CONTAINER_SIZE);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const actualSize = Math.min(rect.width, rect.height);
        setContainerSize(actualSize);
      }
    };

    // * Initial size update after component mounts
    const initialTimeout = setTimeout(updateSize, 100);

    // * Set up ResizeObserver for responsive updates
    let resizeObserver;
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateSize);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener("resize", updateSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [containerRef]);

  return containerSize;
};

// * Custom hook for drag functionality
const useDragHandler = (containerRef, containerSize, onChartPositionChange) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: DEFAULT_CONTAINER_SIZE / 2,
    y: DEFAULT_CONTAINER_SIZE / 2,
  });

  const calculateEmotionData = useCallback(
    (x, y, size = containerSize) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - EMOJI_RADIUS;

      // * Calculate distance from center for scaling
      const dx = x - centerX;
      const dy = y - centerY;
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
      const normalizedDistance = Math.min(distanceFromCenter / radius, 1);

      // * Scale factor: 1.0 at center, up to 2.0 at edge
      const scaleFactor = 1 + normalizedDistance;

      // * Normalize to -1 to 1 range
      const valence = (x - centerX) / radius; // * Pleasant (right) to Unpleasant (left)
      const arousal = (centerY - y) / radius; // * High energy (top) to Low energy (bottom)

      // * Determine emoji and label based on quadrant
      let quadrant = "neutral";
      if (valence > 0 && arousal > 0) quadrant = "pleasant-energetic";
      else if (valence > 0 && arousal < 0) quadrant = "pleasant-calm";
      else if (valence < 0 && arousal > 0) quadrant = "unpleasant-energetic";
      else if (valence < 0 && arousal < 0) quadrant = "unpleasant-calm";

      const { emoji, label } = EMOTION_QUADRANTS[quadrant];

      return {
        x: Math.round(x),
        y: Math.round(y),
        valence: Math.round(valence * 100) / 100,
        arousal: Math.round(arousal * 100) / 100,
        emoji,
        label,
        scaleFactor: Math.round(scaleFactor * 100) / 100,
      };
    },
    [containerSize]
  );

  const getClientPosition = useCallback((e) => {
    return e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };
  }, []);

  const handleMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current) return;

      requestAnimationFrame(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const clientPos = getClientPosition(e);

        // * Get position relative to container
        let x = clientPos.x - rect.left;
        let y = clientPos.y - rect.top;

        // * Constrain to circular boundary
        const centerX = containerSize / 2;
        const centerY = containerSize / 2;
        const maxRadius = containerSize / 2 - EMOJI_RADIUS;

        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > maxRadius) {
          // * Scale back to the circle edge
          const scale = maxRadius / distance;
          x = centerX + dx * scale;
          y = centerY + dy * scale;
        }

        setPosition({ x, y });

        const emotionData = calculateEmotionData(x, y, containerSize);
        onChartPositionChange(emotionData);
      });
    },
    [
      isDragging,
      containerRef,
      containerSize,
      getClientPosition,
      calculateEmotionData,
      onChartPositionChange,
    ]
  );

  const handleStart = useCallback((e) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // * Event listeners management
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  return {
    isDragging,
    position,
    setPosition,
    handleStart,
    calculateEmotionData,
  };
};

// * Component for the draggable emoji with dynamic styling
const DraggableEmoji = React.memo(
  ({ position, containerSize, isDragging, emotionData, onStart }) => {
    const emojiRef = useRef(null);
    
    const recommendations = useMemo(() => 
      getEmotionRecommendations(emotionData.valence, emotionData.arousal),
      [emotionData.valence, emotionData.arousal]
    );
    
    const colors = EMOTION_COLORS[recommendations.quadrant];

    useEffect(() => {
      const emojiElement = emojiRef.current;
      if (!emojiElement) return;

      const handleMouseDown = (e) => {
        if (onStart) onStart(e);
      };

      const handleTouchStart = (e) => {
        if (onStart) onStart(e);
      };

      // Add event listeners with passive: false for touch events
      emojiElement.addEventListener("mousedown", handleMouseDown);
      emojiElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });

      return () => {
        emojiElement.removeEventListener("mousedown", handleMouseDown);
        emojiElement.removeEventListener("touchstart", handleTouchStart);
      };
    }, [onStart]);

    return (
      <div
        ref={emojiRef}
        className={`absolute w-12 h-12 flex items-center justify-center text-2xl rounded-full backdrop-blur-md border-2 transition-all duration-300 ${
          isDragging ? 'shadow-2xl animate-pulse' : 'shadow-lg'
        }`}
        style={{
          left: `${(position.x / containerSize) * 100}%`,
          top: `${(position.y / containerSize) * 100}%`,
          transform: `translate(-50%, -50%) scale(${
            emotionData.scaleFactor * (isDragging ? 1.1 : 1)
          })`,
          background: `linear-gradient(135deg, ${getGradientColors(colors.primary)}, rgba(255,255,255,0.1))`,
          borderColor: getBorderColor(colors.border),
          boxShadow: isDragging 
            ? `0 12px 40px 0 ${getShadowColor(colors.primary)}, inset 0 1px 0 rgba(255,255,255,0.4), 0 0 20px ${getShadowColor(colors.primary)}`
            : `0 8px 32px 0 ${getShadowColor(colors.primary)}, inset 0 1px 0 rgba(255,255,255,0.3), 0 0 10px ${getShadowColor(colors.primary)}`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        role="button"
        aria-label={`Drag to express emotion: ${emotionData.label}`}
        tabIndex={0}
      >
        {emotionData.emoji}
      </div>
    );
  }
);

// * Helper functions for color conversion
const getGradientColors = (gradientClass) => {
  const colorMap = {
    'from-yellow-400 to-orange-500': 'rgba(250, 204, 21, 0.3), rgba(249, 115, 22, 0.3)',
    'from-green-400 to-emerald-500': 'rgba(74, 222, 128, 0.3), rgba(16, 185, 129, 0.3)',
    'from-red-400 to-rose-500': 'rgba(248, 113, 113, 0.3), rgba(244, 63, 94, 0.3)',
    'from-blue-400 to-indigo-500': 'rgba(96, 165, 250, 0.3), rgba(99, 102, 241, 0.3)',
    'from-gray-400 to-slate-500': 'rgba(156, 163, 175, 0.3), rgba(100, 116, 139, 0.3)'
  };
  return colorMap[gradientClass] || 'rgba(255,255,255,0.25), rgba(255,255,255,0.1)';
};

const getBorderColor = (borderClass) => {
  const colorMap = {
    'border-yellow-300': 'rgba(253, 224, 71, 0.6)',
    'border-green-300': 'rgba(134, 239, 172, 0.6)',
    'border-red-300': 'rgba(252, 165, 165, 0.6)',
    'border-blue-300': 'rgba(147, 197, 253, 0.6)',
    'border-gray-300': 'rgba(209, 213, 219, 0.6)'
  };
  return colorMap[borderClass] || 'rgba(255,255,255,0.3)';
};

const getShadowColor = (primaryClass) => {
  const colorMap = {
    'from-yellow-400 to-orange-500': 'rgba(250, 204, 21, 0.2)',
    'from-green-400 to-emerald-500': 'rgba(74, 222, 128, 0.2)',
    'from-red-400 to-rose-500': 'rgba(248, 113, 113, 0.2)',
    'from-blue-400 to-indigo-500': 'rgba(96, 165, 250, 0.2)',
    'from-gray-400 to-slate-500': 'rgba(156, 163, 175, 0.2)'
  };
  return colorMap[primaryClass] || 'rgba(31, 38, 135, 0.37)';
};

// * Component for axis labels
const AxisLabels = React.memo(() => (
  <>
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
  </>
));

// * Component for emotion words selection with dynamic styling
const EmotionWordsSelector = React.memo(
  ({ emotionWords, selectedEmotionWords, onEmotionWordsChange, currentEmotionData }) => {
    const recommendations = useMemo(() => 
      getEmotionRecommendations(currentEmotionData.valence, currentEmotionData.arousal),
      [currentEmotionData.valence, currentEmotionData.arousal]
    );

    const colors = EMOTION_COLORS[recommendations.quadrant];

    const toggleEmotionWord = useCallback(
      (word) => {
        const newWords = selectedEmotionWords.includes(word)
          ? selectedEmotionWords.filter((w) => w !== word)
          : [...selectedEmotionWords, word];
        onEmotionWordsChange(newWords);
      },
      [selectedEmotionWords, onEmotionWordsChange]
    );

    const getWordStyling = (word) => {
      const isRecommended = recommendations.recommended.includes(word);
      const isSelected = selectedEmotionWords.includes(word);
      const intensity = recommendations.intensity;

      if (isSelected) {
        return `bg-gradient-to-r ${colors.primary} text-white border-0 shadow-lg transform scale-105 animate-pulse`;
      } else if (isRecommended) {
        return `bg-gradient-to-r ${colors.secondary} ${colors.text} ${colors.border} border-2 hover:shadow-md hover:scale-105 transition-all duration-300 animate-pulse`;
      } else {
        return `bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all duration-200`;
      }
    };

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            Select emotion words that describe how you feel:
          </h3>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${colors.secondary} ${colors.border} border-2`}>
            <span className="text-2xl">{currentEmotionData.emoji}</span>
            <div className="text-sm">
              <div className={`font-medium ${colors.text}`}>
                {currentEmotionData.label} • {recommendations.quadrant.replace('-', ' ').toUpperCase()}
              </div>
              <div className="text-muted-foreground">
                Intensity: {Math.round(recommendations.intensity * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Recommended emotions section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors.accent}`}></div>
            <h4 className="font-medium text-sm">Recommended for your current position:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendations.recommended.map((word) => (
              <Badge
                key={word}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${getWordStyling(word)}`}
                onClick={() => toggleEmotionWord(word)}
              >
                {word}
              </Badge>
            ))}
          </div>
        </div>

        {/* All emotions section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
            <h4 className="font-medium text-sm">All emotions:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {emotionWords
              .filter(word => !recommendations.recommended.includes(word))
              .map((word) => (
                <Badge
                  key={word}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${getWordStyling(word)}`}
                  onClick={() => toggleEmotionWord(word)}
                >
                  {word}
                </Badge>
              ))}
          </div>
        </div>

        {/* Selected emotions display */}
        {selectedEmotionWords.length > 0 && (
          <div className={`mt-4 p-4 rounded-lg bg-gradient-to-r ${colors.secondary} ${colors.border} border-2`}>
            <div className={`text-sm font-medium mb-2 ${colors.text}`}>
              Your selected emotions ({selectedEmotionWords.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedEmotionWords.map((word) => (
                <Badge 
                  key={word} 
                  className={`bg-gradient-to-r ${colors.primary} text-white border-0 shadow-md`}
                >
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

// * Main component
const EmojiGridMapper = ({
  onEmotionWordsChange,
  onChartPositionChange,
  selectedEmotionWords = [],
  chartPosition = null,
}) => {
  const containerRef = useRef(null);
  const containerSize = useContainerSize(containerRef);

  const {
    isDragging,
    position,
    setPosition,
    handleStart,
    calculateEmotionData,
  } = useDragHandler(containerRef, containerSize, onChartPositionChange);

  // * Initialize position based on props or center
  useEffect(() => {
    if (chartPosition) {
      setPosition({ x: chartPosition.x, y: chartPosition.y });
    } else {
      const exactCenter = containerSize / 2;
      setPosition({ x: exactCenter, y: exactCenter });

      if (onChartPositionChange) {
        const emotionData = calculateEmotionData(
          exactCenter,
          exactCenter,
          containerSize
        );
        onChartPositionChange(emotionData);
      }
    }
  }, [
    containerSize,
    chartPosition,
    setPosition,
    calculateEmotionData,
    onChartPositionChange,
  ]);

  const currentEmotionData = useMemo(
    () => calculateEmotionData(position.x, position.y, containerSize),
    [position.x, position.y, containerSize, calculateEmotionData]
  );

  return (
    <div
      className="space-y-4 sm:space-y-6"
      data-interactive-component="emoji-mapper"
    >
      {/* * Valence-Arousal Chart */}
      <div className="relative">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center px-2">
          Drag the emoji to express your emotional state
        </h3>
        <div className="overflow-x-auto pb-4">
          <div
            ref={containerRef}
            className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto rounded-full flex-shrink-0 backdrop-blur-xl border-2 shadow-2xl transition-all duration-500"
            style={{
              userSelect: "none",
              background: (() => {
                const recommendations = getEmotionRecommendations(currentEmotionData.valence, currentEmotionData.arousal);
                const colors = EMOTION_COLORS[recommendations.quadrant];
                return `linear-gradient(135deg, ${getGradientColors(colors.primary)}, rgba(255,255,255,0.05))`;
              })(),
              borderColor: (() => {
                const recommendations = getEmotionRecommendations(currentEmotionData.valence, currentEmotionData.arousal);
                const colors = EMOTION_COLORS[recommendations.quadrant];
                return getBorderColor(colors.border);
              })(),
              boxShadow: (() => {
                const recommendations = getEmotionRecommendations(currentEmotionData.valence, currentEmotionData.arousal);
                const colors = EMOTION_COLORS[recommendations.quadrant];
                return `0 8px 32px 0 ${getShadowColor(colors.primary)}, inset 0 1px 0 rgba(255,255,255,0.2)`;
              })(),
              cursor: "pointer",
            }}
          >
            <AxisLabels />

            {/* * Center lines */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border opacity-30"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border opacity-30"></div>

            <DraggableEmoji
              position={position}
              containerSize={containerSize}
              isDragging={isDragging}
              emotionData={currentEmotionData}
              onStart={handleStart}
            />
          </div>
        </div>

        {/* * Current position display with dynamic styling */}
        <div className="mt-4 text-center">
          {(() => {
            const recommendations = getEmotionRecommendations(currentEmotionData.valence, currentEmotionData.arousal);
            const colors = EMOTION_COLORS[recommendations.quadrant];
            
            return (
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-md border-2 transition-all duration-300 ${colors.border}`}
                style={{
                  background: `linear-gradient(135deg, ${getGradientColors(colors.primary)}, rgba(255,255,255,0.1))`,
                  boxShadow: `0 6px 20px 0 ${getShadowColor(colors.primary)}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                }}
              >
                <span className="text-3xl">{currentEmotionData.emoji}</span>
                <div className="text-sm">
                  <div className={`font-semibold ${colors.text}`}>
                    {currentEmotionData.label}
                  </div>
                  <div className="text-muted-foreground">
                    {recommendations.quadrant.replace('-', ' ').toUpperCase()} • 
                    Intensity: {Math.round(recommendations.intensity * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Valence: {currentEmotionData.valence > 0 ? "+" : ""}
                    {currentEmotionData.valence} | Arousal:{" "}
                    {currentEmotionData.arousal > 0 ? "+" : ""}
                    {currentEmotionData.arousal}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <EmotionWordsSelector
        emotionWords={EMOTION_WORDS}
        selectedEmotionWords={selectedEmotionWords}
        onEmotionWordsChange={onEmotionWordsChange}
        currentEmotionData={currentEmotionData}
      />
    </div>
  );
};

export default EmojiGridMapper;
