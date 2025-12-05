import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isResizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPosition(percent);
    },
    [isResizing]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing, handleMove, handleMouseUp]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 select-none">
       <div className="flex justify-between items-center mb-4 text-sm font-medium text-slate-400">
        <span>Original</span>
        <span className="text-primary-400">Cleaned Result</span>
      </div>
      
      <div 
        ref={containerRef}
        className="relative w-full aspect-auto overflow-hidden rounded-xl border-2 border-slate-700 shadow-2xl bg-slate-900"
        style={{ minHeight: '300px' }}
      >
        {/* After Image (Background) */}
        <img 
          src={afterImage} 
          alt="After processing" 
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Before Image (Foreground with clip-path) */}
        <div 
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={beforeImage} 
            alt="Original" 
            className="absolute top-0 left-0 max-w-none h-full object-contain pointer-events-none"
            style={{ width: containerRef.current ? `${containerRef.current.getBoundingClientRect().width}px` : '100%' }}
          />
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 transition-shadow"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
              <polyline points="9 18 3 12 9 6"></polyline>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180 -ml-2">
              <polyline points="15 18 9 12 15 6"></polyline>
              <polyline points="9 18 3 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        {/* Labels overlay */}
         <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none">
          Original
        </div>
        <div className="absolute bottom-4 right-4 bg-primary-600/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none">
          Processed
        </div>
      </div>
    </div>
  );
};