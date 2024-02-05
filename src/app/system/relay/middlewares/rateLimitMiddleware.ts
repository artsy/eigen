import { captureMessage } from "@sentry/react-native"
import { logOperation } from "app/utils/loggers"
import { Middleware } from "react-relay-network-modern"

interface RateLimitMiddlewareOpts {
  limit: number
  interval: number
  logger?: (...args: unknown[]) => void
}

export const rateLimitMiddleware = (
  {
    limit,
    interval,
    logger = console.log.bind(console, "[RELAY-NETWORK]"),
  }: RateLimitMiddlewareOpts = {
    limit: 50,
    interval: 1000,
  }
): Middleware => {
  let count = 0
  let prevTimeElapsed = Date.now()

  return (next) => {
    return (req) => {
      const operationName = "id" in req ? req.operation.name : "UnknownOperation"
      const timeElapsed = Date.now() - prevTimeElapsed
      const isWithinInterval = timeElapsed < interval
      const isOutsideInterval = timeElapsed >= interval

      if (isWithinInterval && count >= limit) {
        const message = `Rate limit exceeded: ${operationName}`
        captureMessage(message)
        throw new Error(message)
      }

      if (isOutsideInterval) {
        count = 0
      }

      count = count + 1
      prevTimeElapsed = Date.now()

      if (logOperation) {
        logger(`${operationName}: request +${count}`)
      }

      return next(req)
    }
  }
}
