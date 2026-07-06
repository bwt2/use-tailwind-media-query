import { tailwindBreakpointQueries, type TailwindBreakpoint } from "./tailwindBreakpoints";
import { useMediaQuery, type UseMediaQueryOptions } from "./useMediaQuery";

/**
 * Subscribes to one of the built-in Tailwind breakpoint queries.
 */
export function useTailwindBreakpoint(
  tailwindBreakpoint: TailwindBreakpoint,
  options?: UseMediaQueryOptions,
): boolean {
  return useMediaQuery(tailwindBreakpointQueries[tailwindBreakpoint], options);
}

/**
 * Returns `true` when the viewport is smaller than Tailwind's `md` breakpoint.
 */
export function useIsMobile(): boolean {
  return !useTailwindBreakpoint("md");
}

/**
 * Returns `true` when the viewport is between Tailwind's `md` and `lg` breakpoints.
 */
export function useIsTablet(): boolean {
  const md = useTailwindBreakpoint("md");
  const lg = useTailwindBreakpoint("lg");

  return md && !lg;
}

/**
 * Returns `true` when the viewport is at or above Tailwind's `lg` breakpoint.
 */
export function useIsDesktop(): boolean {
  return useTailwindBreakpoint("lg");
}

/**
 * Returns `true` when the viewport is at or above Tailwind's `xl` breakpoint.
 */
export function useIsLargeDesktop(): boolean {
  return useTailwindBreakpoint("xl");
}
