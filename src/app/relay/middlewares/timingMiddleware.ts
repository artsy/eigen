import { volleyClient } from "app/utils/volleyClient"

export function timingMiddleware() {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  return (next) => (req) => {
    const startTime = Date.now()
    const operation = req.operation.name || "UnknownOperation"
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    return next(req).then((res) => {
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
