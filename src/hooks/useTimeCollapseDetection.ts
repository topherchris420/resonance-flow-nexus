
import { useRef, useCallback } from 'react';

export const useTimeCollapseDetection = () => {
  const varianceHistoryRef = useRef<number[]>([]);
  const stabilityStartTimeRef = useRef<number | null>(null);

  const detectTimeCollapseEvent = useCallback((variance: number, currentTime: number, timeCollapseActive: boolean): boolean => {
    varianceHistoryRef.current.push(variance);
    if (varianceHistoryRef.current.length > 200) {
      varianceHistoryRef.current.shift();
    }

    if (variance < 0.01) {
      if (stabilityStartTimeRef.current === null) {
        stabilityStartTimeRef.current = currentTime;
      }
      
      const stabilityDuration = currentTime - stabilityStartTimeRef.current;
      
      if (stabilityDuration >= 45000 && !timeCollapseActive) {
        console.log('TIME COLLAPSE EVENT: Initiating Focus 15 transition');
        return true;
      }
    } else {
      stabilityStartTimeRef.current = null;
    }
    
    return false;
  }, []);

  const getVarianceHistory = useCallback(() => [...varianceHistoryRef.current], []);
  
  const getStabilityDuration = useCallback((currentTime: number) => {
    return stabilityStartTimeRef.current ? currentTime - stabilityStartTimeRef.current : 0;
  }, []);

  return {
    detectTimeCollapseEvent,
    getVarianceHistory,
    getStabilityDuration
  };
};
