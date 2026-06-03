"use client";

import { useState, useEffect } from "react";

/**
 * Track if a media query matches.
 * Example: useMediaQuery("(min-width: 768px)")
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// Convenience breakpoint hooks
export function useIsMobile() {
  return !useMediaQuery("(min-width: 768px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px)") && !useMediaQuery("(min-width: 1024px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
