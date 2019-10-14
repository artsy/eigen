import { volleyClient } from "lib/utils/volleyClient"

export function timingMiddleware() {
  return next => req => {
    const startTime = Date.now()
    const operation = req.operation.name || "UnknownOperation"
    return next(req).then(res => {
      const duration = Date.now() - startTime
      volleyClient.send({
        type: "timing",
        name: "graphql-request-duration",
        timing: duration,
        tags: [`operation:${operation}`, `id:${req.id}`],
      })
      return res
    })
  }
}
