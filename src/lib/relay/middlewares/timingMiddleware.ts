import { volleyClient } from "lib/utils/volleyClient"
import { Middleware } from "react-relay-network-modern/node8"
import { isRelayRequest } from "./util"

export function timingMiddleware(): Middleware {
  return next => async req => {
    const startTime = Date.now()
    const operationName = isRelayRequest(req) ? req.operation.name : "UnknownOperation"

    const res = await next(req)
    const duration = Date.now() - startTime

    volleyClient.send({
      type: "timing",
      name: "graphql-request-duration",
      timing: duration,
      tags: [`operation:${operationName}`, `id:${req.getID()}`],
    })

    return res
  }
}
