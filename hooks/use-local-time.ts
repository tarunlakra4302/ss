"use client"

import { useEffect, useState } from "react"

interface UseLocalTimeOptions {
  timeZone?: string
  hour12?: boolean
}

/**
 * Custom hook providing dynamic local time formatted for a given timezone.
 * Decouples time/clock infrastructure and formatting logic from presentational UI.
 * Handles SSR and client hydration cleanly.
 */
export function useLocalTime({
  timeZone = "America/Los_Angeles",
  hour12 = false,
}: UseLocalTimeOptions = {}): string {
  const [formattedTime, setFormattedTime] = useState<string>("02:44")

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        const timeString = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          hour12,
        }).format(now)
        setFormattedTime(timeString)
      } catch {
        // Fallback gracefully if timezone is unsupported
        setFormattedTime("02:44")
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 10000)

    return () => clearInterval(timer)
  }, [timeZone, hour12])

  return formattedTime
}
