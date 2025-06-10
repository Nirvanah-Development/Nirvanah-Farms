"use client";

import { useMemo } from "react";
import { getOfficeCode } from "./officeCodes";

/**
 * React hook that returns the first `count` office codes.
 * Recomputes only when count changes.
 */
export function useOfficeCodes(count: number): string[] {
  return useMemo(() => {
    const codes: string[] = [];
    for (let i = 1; i <= count; i++) {
      codes.push(getOfficeCode(i));
    }
    return codes;
  }, [count]); // React hook: recompute only when count changes
} 