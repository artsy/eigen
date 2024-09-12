import { volleyClient } from "app/utils/volleyClient"
import { Middleware, RelayRequestAny, RelayNetworkLayerRequest } from "react-relay-network-modern"

export function timingMiddleware(): Middleware {
  return (next) => async (req) => {
    const startTime = Date.now()
    const operation = isSingleRequest(req) ? req.operation.name : "UnknownOperation"
    return next(req).then(async (res) => {
      const duration = Date.now() - startTime

      try {
        await volleyClient.send({
          type: "timing",
          name: "graphql-request-duration",
          timing: duration,
          tags: [`operation:${operation}`],
        })
      } catch (error) {
        console.error("Error in timingMiddleware", error)
      }

      return res
    })
  }
}

function isSingleRequest(req: RelayRequestAny): req is RelayNetworkLayerRequest {
  return (req as RelayNetworkLayerRequest).operation !== undefined
}
