import { captureMessage } from "@sentry/react-native"
import { logOperation } from "app/utils/loggers"
import { Middleware } from "react-relay-network-modern"

interface RateLimitMiddlewareOpts {
  limit: number
  interval: number
  logger?: (...args: unknown[]) => void
}

// Minimum gap between captureMessage calls for a given rate-limited stream.
const CAPTURE_SAMPLE_INTERVAL = 60_000

export const rateLimitMiddleware = (
  {
    limit,
    interval,
    logger = console.log.bind(console, "[RELAY-NETWORK]"),
  }: RateLimitMiddlewareOpts = {
    limit: 100,
    interval: 1000,
  }
): Middleware => {
  let requestTimestamps: number[] = []
  let lastCaptureAt = 0

  return (next) => {
    return (req) => {
      const operationName = "id" in req ? req.operation.name : "UnknownOperation"
      const now = Date.now()

      // Drop timestamps that have aged out of the window instead of resetting the
      // count based on the gap between requests, which never fires during sustained
      // traffic (e.g. background prefetching) since every request keeps sliding the
      // reference point forward.
      requestTimestamps = requestTimestamps.filter((timestamp) => now - timestamp < interval)

      if (requestTimestamps.length >= limit) {
        const message = `Rate limit exceeded: ${operationName}`

        // Hitting the limit is expected, self-inflicted, and not actionable per-event —
        // sample so a sustained rate-limited stream doesn't flood Sentry with duplicates.
        if (now - lastCaptureAt > CAPTURE_SAMPLE_INTERVAL) {
          captureMessage(message)
          lastCaptureAt = now
        }

        throw new Error(message)
      }

      requestTimestamps.push(now)

      if (logOperation) {
        logger(`${operationName}: request +${requestTimestamps.length}`)
      }

      return next(req)
    }
  }
}
