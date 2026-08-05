import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { volleyClient } from "app/utils/volleyClient"
import { Middleware } from "react-relay-network-modern"

export function timingMiddleware(): Middleware {
  return (next) => (req) => {
    const startTime = Date.now()
    const operation = (req as GraphQLRequest).operation.name || "UnknownOperation"
    return next(req).then((res) => {
      const duration = Date.now() - startTime
      volleyClient.send({
        type: "timing",
        name: "graphql-request-duration",
        timing: duration,
        tags: [`operation:${operation}`],
      })
      return res
    })
  }
}
