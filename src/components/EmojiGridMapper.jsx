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

// * Component for the draggable emoji
const DraggableEmoji = React.memo(
  ({ position, containerSize, isDragging, emotionData, onStart }) => {
    const emojiRef = useRef(null);

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
        className="absolute w-12 h-12 flex items-center justify-center text-2xl rounded-full backdrop-blur-md border border-white/30"
        style={{
          left: `${(position.x / containerSize) * 100}%`,
          top: `${(position.y / containerSize) * 100}%`,
          transform: `translate(-50%, -50%) scale(${
            emotionData.scaleFactor * (isDragging ? 1.1 : 1)
          })`,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))",
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255,255,255,0.3)",
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

// * Component for emotion words selection
const EmotionWordsSelector = React.memo(
  ({ emotionWords, selectedEmotionWords, onEmotionWordsChange }) => {
    const toggleEmotionWord = useCallback(
      (word) => {
        const newWords = selectedEmotionWords.includes(word)
          ? selectedEmotionWords.filter((w) => w !== word)
          : [...selectedEmotionWords, word];
        onEmotionWordsChange(newWords);
      },
      [selectedEmotionWords, onEmotionWordsChange]
    );

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Or select emotion words that describe how you feel:
        </h3>
        <div className="flex flex-wrap gap-2">
          {emotionWords.map((word) => (
            <Badge
              key={word}
              variant={
                selectedEmotionWords.includes(word) ? "default" : "outline"
              }
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedEmotionWords.includes(word)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
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
              {selectedEmotionWords.map((word) => (
                <Badge key={word} variant="secondary" className="text-xs">
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
            className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto rounded-full flex-shrink-0 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
            style={{
              userSelect: "none",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255,255,255,0.2)",
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

        {/* * Current position display */}
        <div className="mt-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border border-white/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
              boxShadow:
                "0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <span className="text-2xl">{currentEmotionData.emoji}</span>
            <div className="text-sm">
              <div className="font-medium">{currentEmotionData.label}</div>
              <div className="text-muted-foreground">
                Valence: {currentEmotionData.valence > 0 ? "+" : ""}
                {currentEmotionData.valence} | Arousal:{" "}
                {currentEmotionData.arousal > 0 ? "+" : ""}
                {currentEmotionData.arousal}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmotionWordsSelector
        emotionWords={EMOTION_WORDS}
        selectedEmotionWords={selectedEmotionWords}
        onEmotionWordsChange={onEmotionWordsChange}
      />
    </div>
  );
};

export default EmojiGridMapper;
