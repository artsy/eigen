import { captureMessage } from "@sentry/react-native"

/**
 * Compile-time exhaustiveness check for switch/if chains over a union.
 *
 * At runtime we can still get values TypeScript didn't predict (server data, native events,
 * untyped tracking payloads). Throw in dev so we notice, but never crash production users —
 * report to Sentry instead so the unhandled case can be fixed.
 */
export function assertNever(value: never): void {
  const message = `assertNever: unexpected value ${safeStringify(value)}`

  if (__DEV__) {
    throw new Error(message)
  }

  captureMessage(message, "warning")
}

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
