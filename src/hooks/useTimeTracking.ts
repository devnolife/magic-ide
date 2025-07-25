import { useState, useEffect, useCallback, useRef } from 'react'

export function useTimeTracking(chapterNumber: number, lessonNumber?: number) {
  const [sessionTime, setSessionTime] = useState(0) // Time in seconds
  const [isTracking, setIsTracking] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const accumulatedTimeRef = useRef(0)

  const startTracking = useCallback(async () => {
    if (isTracking) return

    try {
      // Record session start
      await fetch('/api/time-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapterNumber,
          lessonNumber,
          timeSpent: 0,
          action: 'start_session'
        })
      })

      setIsTracking(true)
      startTimeRef.current = Date.now()

      // Update session time every second
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setSessionTime(accumulatedTimeRef.current + currentTime)
        }
      }, 1000)
    } catch (error) {
      console.error('Error starting time tracking:', error)
    }
  }, [isTracking, chapterNumber, lessonNumber])

  const stopTracking = useCallback(async (shouldSave: boolean = true) => {
    if (!isTracking) return 0

    setIsTracking(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    let sessionDuration = 0
    if (startTimeRef.current) {
      sessionDuration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      accumulatedTimeRef.current += sessionDuration
      startTimeRef.current = null
    }

    const totalTime = accumulatedTimeRef.current

    if (shouldSave && totalTime > 0) {
      try {
        // Send time in minutes to the API
        const timeInMinutes = Math.max(1, Math.floor(totalTime / 60))

        await fetch('/api/time-tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chapterNumber,
            lessonNumber,
            timeSpent: timeInMinutes,
            action: 'end_session'
          })
        })
      } catch (error) {
        console.error('Error saving time tracking:', error)
      }
    }

    return totalTime
  }, [isTracking, chapterNumber, lessonNumber])

  const pauseTracking = useCallback(() => {
    if (!isTracking) return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (startTimeRef.current) {
      const sessionDuration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      accumulatedTimeRef.current += sessionDuration
      startTimeRef.current = null
    }

    setIsTracking(false)
  }, [isTracking])

  const resumeTracking = useCallback(() => {
    if (isTracking) return

    setIsTracking(true)
    startTimeRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setSessionTime(accumulatedTimeRef.current + currentTime)
      }
    }, 1000)
  }, [isTracking])

  const resetTracking = useCallback(() => {
    setIsTracking(false)
    setSessionTime(0)
    accumulatedTimeRef.current = 0
    startTimeRef.current = null

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Format time as MM:SS or HH:MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }, [])

  // Auto-stop tracking when component unmounts or page changes
  useEffect(() => {
    return () => {
      if (isTracking) {
        stopTracking(true)
      }
    }
  }, [isTracking, stopTracking])

  // Handle page visibility changes (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTracking) {
        pauseTracking()
      } else if (!document.hidden && !isTracking && accumulatedTimeRef.current > 0) {
        resumeTracking()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isTracking, pauseTracking, resumeTracking])

  return {
    sessionTime,
    isTracking,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    resetTracking,
    formatTime: (time?: number) => formatTime(time ?? sessionTime),
    getSessionTimeInMinutes: () => Math.max(1, Math.floor(sessionTime / 60))
  }
}
