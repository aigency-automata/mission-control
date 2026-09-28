import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Hermes hook template source', () => {
  it('defines top-level async def handle for hook loader compatibility', () => {
    const routePath = resolve(process.cwd(), 'src/app/api/hermes/route.ts')
    const source = readFileSync(routePath, 'utf8')

    expect(source).toContain('async def handle(')
    expect(source).not.toContain('async def handle_event(')
  })

  it('uses only the standard library, since Hermes Python does not bundle httpx', () => {
    const routePath = resolve(process.cwd(), 'src/app/api/hermes/route.ts')
    const source = readFileSync(routePath, 'utf8')

    expect(source).not.toContain('import httpx')
    expect(source).toContain('import urllib.request')
  })

  it('reports lifecycle events to /api/hermes/events instead of creating agents', () => {
    const routePath = resolve(process.cwd(), 'src/app/api/hermes/route.ts')
    const source = readFileSync(routePath, 'utf8')

    expect(source).toContain('/api/hermes/events')
    expect(source).not.toContain('/api/agents')
    expect(source).not.toContain('"status": "active"')
  })
})
