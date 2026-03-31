"use client";

import { useEffect, useRef, useCallback } from 'react';

interface UseTimeTrackerReturn {
  getElapsedMinutes: () => number;
  getElapsedSeconds: () => number;
  reset: () => void;
}

export function useTimeTracker(): UseTimeTrackerReturn {
  const startTimeRef = useRef<number>(Date.now());

  const getElapsedMinutes = useCallback(() => {
    return Math.floor((Date.now() - startTimeRef.current) / 60000);
  }, []);

  const getElapsedSeconds = useCallback(() => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Reset timer when component mounts (new lesson started)
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  return { getElapsedMinutes, getElapsedSeconds, reset };
}