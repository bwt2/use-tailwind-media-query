/** @vitest-environment node */

import { expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { useMediaQuery, useTailwindBreakpoint } from '../src'
import { tailwindBreakpointQueries } from '../src/tailwindBreakpoints'

function MediaQueryServerProbe() {
  const defaultFalse = useMediaQuery(tailwindBreakpointQueries.lg)
  const defaultTrue = useMediaQuery(tailwindBreakpointQueries.lg, {
    noWindowDefault: true,
  })

  return (
    <output>
      {JSON.stringify({
        defaultFalse,
        defaultTrue,
      })}
    </output>
  )
}

function TailwindBreakpointServerProbe() {
  const defaultFalse = useTailwindBreakpoint('lg')
  const defaultTrue = useTailwindBreakpoint('lg', {
    noWindowDefault: true,
  })

  return (
    <output>
      {JSON.stringify({
        defaultFalse,
        defaultTrue,
      })}
    </output>
  )
}

test('useMediaQuery uses noWindowDefault during server rendering', () => {
  const markup = renderToStaticMarkup(<MediaQueryServerProbe />)

  expect(markup).toContain('&quot;defaultFalse&quot;:false')
  expect(markup).toContain('&quot;defaultTrue&quot;:true')
})

test('useTailwindBreakpoint forwards noWindowDefault during server rendering', () => {
  const markup = renderToStaticMarkup(<TailwindBreakpointServerProbe />)

  expect(markup).toContain('&quot;defaultFalse&quot;:false')
  expect(markup).toContain('&quot;defaultTrue&quot;:true')
})
