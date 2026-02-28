import { useCallback, useRef } from 'react';

const SWIPE_THRESHOLD = 50;

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe(options: UseSwipeOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - touchStart.current.x;
      const deltaY = touchEnd.clientY - touchStart.current.y;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          options.onSwipeLeft?.();
        } else {
          options.onSwipeRight?.();
        }
      }
      touchStart.current = null;
    },
    [options.onSwipeLeft, options.onSwipeRight]
  );

  return { handleTouchStart, handleTouchEnd };
}
