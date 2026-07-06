# use-tailwind-media-query

React 19 hooks for Tailwind-style breakpoints and arbitrary media queries.

## Motivation 

### Adaptive design


This hook is intended to be used in adaptive designs in React.

Use adaptive design when layouts should change across breakpoints (for example: dashboards, dense data views, and flows on desktop vs mobile). Prefer plain responsive design when the same hierarchy still works and only spacing,
columns, or typography need to change.

### Store

The hooks share a small media-query store so repeated breakpoint checks can reuse the
same underlying subscription instead of attaching duplicate `matchMedia` listeners in
every component. 

Multiple components on the same screen can listen to the
same media query without duplicating listeners and wasting memory.

## Installation

```bash
npm i @btja/use-tailwind-media-query
```
```bash
yarn add @btja/use-tailwind-media-query
```
```bash
pnpm add @btja/use-tailwind-media-query
```
```bash
bun add @btja/use-tailwind-media-query
```

## API

```tsx
import {
  useTailwindBreakpoint,
  useIsDesktop,
  useIsLargeDesktop,
  useIsMobile,
  useIsTablet,
  useMediaQuery,
} from '@btja/use-tailwind-media-query'
import type { TailwindBreakpoint } from '@btja/use-tailwind-media-query'
```

Built-in tailwind breakpoints (`TailwindBreakpoint`):

| Breakpoint | Min width |
| --- | --- |
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |
| `2xl` | `1536px` |

Hooks:

| Hook | Returns | Purpose |
| --- | --- | --- |
| `useMediaQuery(query: string, options?)` | `bool` | Subscribe to any CSS media query |
| `useTailwindBreakpoint(tailwindBreakpoint: TailwindBreakpoint, options?)` | `bool` | Tailwind breakpoint helper |
| `useIsMobile()` | `bool` | `true` below `md` |
| `useIsTablet()` | `bool` | `true` from `md` to below `lg` |
| `useIsDesktop()` | `bool` | `true` at `lg` and above |
| `useIsLargeDesktop()` | `bool` | `true` at `xl` and above |

## Examples

`useIsMobile` (`useIsTablet`, `useIsDesktop`, `useIsLargeDesktop`):

```tsx
import { useIsMobile } from '@btja/use-tailwind-media-query'

export function Example() {
  const isMobile = useIsMobile()

  return isMobile ? <MobileView /> : <DesktopView />
}
```

<table align="center">
  <tr>
    <td align="center">
      <img src="docs/desktop-view.png" alt="Desktop adaptive view" height="320" />
      <div><strong>Desktop view</strong></div>
    </td>
    <td align="center">
      <img src="docs/mobile-view.png" alt="Mobile adaptive view" height="320" />
      <div><strong>Mobile view</strong></div>
    </td>
  </tr>
</table>

`useTailwindBreakpoint`:

```tsx
import { useTailwindBreakpoint } from '@btja/use-tailwind-media-query'

export function SidebarLayout() {
  const showSidebar = useTailwindBreakpoint('lg')

  return showSidebar ? <DesktopLayout /> : <CompactLayout />
}
```

```tsx
import { useTailwindBreakpoint } from '@btja/use-tailwind-media-query'

export function SsrSidebarLayout() {
  const showSidebar = useTailwindBreakpoint('lg', { noWindowDefault: true })

  return showSidebar ? <DesktopLayout /> : <CompactLayout />
}
```

`useMediaQuery`:

```tsx
import { useMediaQuery } from '@btja/use-tailwind-media-query'

export function MotionPreference() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return <p>{prefersReducedMotion ? 'Reduced motion' : 'Full motion'}</p>
}
```

```tsx
import { useMediaQuery } from '@btja/use-tailwind-media-query'

export function SsrDesktopShell() {
  const isDesktop = useMediaQuery('(min-width: 1024px)', { noWindowDefault: true })

  return isDesktop ? <DesktopShell /> : <MobileShell />
}
```


## SEO and SSR

If possible, keep both screen variants semantically equivalent for SEO, accessibility,
and consistency purposes.

With this library, server render does not know the real viewport unless you provide an
explicit fallback with `noWindowDefault`:

| Hook | Server-render value |
| --- | --- |
| `useMediaQuery()` | `false` |
| `useMediaQuery(query, { noWindowDefault: true })` | `true` |
| `useTailwindBreakpoint()` | `false` |
| `useTailwindBreakpoint(breakpoint, { noWindowDefault: true })` | `true` |
| `useIsMobile()` | `true` |
| `useIsDesktop()` | `false` |

So this:

```tsx
return useIsMobile() ? <MobileView /> : <DesktopView />
```

renders the mobile branch on the server, then hydrates to the real client viewport.

Use `noWindowDefault` when you want the server-rendered branch to default to a known
assumption before the browser can evaluate `matchMedia`. This is useful when your SSR
environment already has a strong hint about the likely viewport and you want to reduce
layout flipping during hydration.

Ways to choose `noWindowDefault` on the server include:
- infer a mobile/desktop default from the user-agent string
- use device hints or request headers provided by your framework, CDN, or edge runtime
- store a prior device preference in a cookie and reuse it during SSR
- pick a product-level default such as mobile-first when no reliable hint exists

If the server guess is wrong, the client will correct to the real media-query result after hydration (with risk of layout flash).

If SEO matters, avoid putting unique primary content in only one branch. Keep headings,
copy, links, and other canonical content the same when possible, and reserve screen-
specific differences for layout or secondary UI.

## Limitations
Current limitation: `useMediaQuery` depends on `MediaQueryList.addEventListener` /
`removeEventListener`. Older Safari/WebView environments that only implement
`addListener` / `removeListener` are not supported.

## Development
Using pnpm.

Setup:
```bash
npx skills add rolldown/tsdown # add tsdown agent skills
pnpm install
```

Useful commands:
```bash
pnpm run play # run vite playground
pnpm run test
pnpm run typecheck
pnpm run build
```

Before releasing (after `npm login`):

```bash
pnpm check:release
pnpm bump:version

npm publish --access public
```

## AI Disclosure
Codex 5.4 was used to review and sanity-check:
- tsdown configs using the official [tsdown agent skill](https://tsdown.dev/guide/skills).
- React hook implementation for any issues.

Codex 5.4 was used to generate 
- Mockup UI in '`./playground`' demo
- JSDoc
- Tests
