/**
 * Built-in Tailwind-style media queries keyed by breakpoint name.
 */
export const tailwindBreakpointQueries = {
  "sm": "(min-width: 640px)",
  "md": "(min-width: 768px)",
  "lg": "(min-width: 1024px)",
  "xl": "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

/**
 * Supported Tailwind breakpoint names for the built-in breakpoint helpers.
 */
export type TailwindBreakpoint = keyof typeof tailwindBreakpointQueries;
