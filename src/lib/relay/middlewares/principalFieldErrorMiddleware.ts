import { createRequestError, MiddlewareNextFn } from "react-relay-network-modern/node8"

import { GraphQLResponse } from "relay-runtime/lib/network/RelayNetworkTypes"
import { GraphQLRequest } from "./types"

const MUTATION = "mutation"

export const principalFieldErrorMiddleware = () => {
  return (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
    const res = await next(req)
    const resJson = res?.json as GraphQLResponse
    const statusCode: number = resJson.extensions?.principalField?.httpStatusCode || 200

    const hasErrors: boolean = Boolean(resJson.errors?.length)
    const isMutation = req.operation.operationKind === MUTATION

    if (statusCode >= 400 || (isMutation && hasErrors)) {
      throw createRequestError(req, res)
    }

    return res
  }
}
