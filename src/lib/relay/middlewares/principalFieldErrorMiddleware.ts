import { createRequestError, MiddlewareNextFn } from "react-relay-network-modern/node8"

import { GraphQLResponse } from "relay-runtime/lib/network/RelayNetworkTypes"
import { GraphQLRequest } from "./types"

const isErrorStatus = (status: number | undefined) => {
  return (status ?? 200) >= 400
}

export const principalFieldErrorMiddleware = () => {
  return (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
    const res = await next(req)
    const resJson = res?.json as GraphQLResponse

    const hasErrors: boolean = Boolean(resJson.errors?.length)

    if (!hasErrors) {
      return res
    }

    const requestHasPrincipalField = req.operation.text?.includes("@principalField")

    if (!requestHasPrincipalField) {
      throw createRequestError(req, res)
    }

    // This represents whether or not the query experienced an error and that error was thrown while resolving
    // a field marked with the @principalField directive, or any sub-selection of such a field.
    const principalFieldWasInvolvedInError = isErrorStatus(resJson.extensions?.principalField?.httpStatusCode)

    if (principalFieldWasInvolvedInError) {
      throw createRequestError(req, res)
    }

    return res
  }
}
