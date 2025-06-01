"use client";

import { useState, useEffect } from "react";

/**
 * Hook using matchMedia API for better performance
 * Usage: const isMobile = useMediaQuery('(max-width: 767px)')
 *
 * Note: Requires modern browsers that support addEventListener on MediaQueryList
 * (All browsers since 2020, including Safari 14+)
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);

    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
