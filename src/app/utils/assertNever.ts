/**
 * Exhaustiveness check for switch/if chains over a union. TypeScript errors if a case is
 * unhandled; at runtime it throws so a value the types missed never silently falls through.
 */
export function assertNever(value: never): never {
  throw new Error(`assertNever: unexpected value ${safeStringify(value)}`)
}

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
