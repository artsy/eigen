import {
  createRequestError,
  formatGraphQLErrors,
  MiddlewareNextFn,
  RelayNetworkLayerResponse,
} from "react-relay-network-modern/node8"

import * as Sentry from "@sentry/react-native"
import { GraphQLResponse } from "relay-runtime/lib/network/RelayNetworkTypes"
import { GraphQLRequest } from "./types"

const isErrorStatus = (status: number | undefined) => {
  return (status ?? 200) >= 400
}

const throwError = (req: GraphQLRequest, res: RelayNetworkLayerResponse) => {
  const formattedError = formatGraphQLErrors(req, res.errors!)
  Sentry.withScope((scope) => {
    scope.setTag("kind", req.operation.operationKind)
    scope.setTag("query", req.operation.query)
    if (req.variables) {
      scope.setTag("variables", req.variables as any)
    }
    Sentry.captureMessage(formattedError)
  })
  throw createRequestError(req, res)
}

export const principalFieldErrorMiddleware = () => {
  return (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
    const res = await next(req)
    const resJson = res?.json as GraphQLResponse

    const hasErrors: boolean = Boolean(resJson.errors?.length)

    if (!hasErrors) {
      return res
    }

    // at this point, we have errors

    const requestHasPrincipalField = req.operation.text?.includes("@principalField")

    if (!requestHasPrincipalField) {
      return throwError(req, res)
    }

    // at this point, we have errors and we have a principalField

    // This represents whether or not the query experienced an error and that error was thrown while resolving
    // a field marked with the @principalField directive, or any sub-selection of such a field.
    const principalFieldWasInvolvedInError = isErrorStatus(resJson.extensions?.principalField?.httpStatusCode)

    if (principalFieldWasInvolvedInError) {
      return throwError(req, res)
    }

    return res
  }
}
