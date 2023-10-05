import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { isErrorStatus, throwError, trackError } from "app/system/relay/middlewares/helpers"
import { principalFieldErrorHandlerMiddleware } from "app/system/relay/middlewares/principalFieldErrorHandlerMiddleware"
import { MiddlewareNextFn, RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import { GraphQLResponse } from "relay-runtime/lib/network/RelayNetworkTypes"
import { GraphQLRequest } from "./types"

const newErrorMiddlewareOptedInQueries = [
  "HomeAboveTheFoldQuery",
  "HomeBelowTheFoldQuery",
  "ArtworkAboveTheFoldQuery",
  "ArtworkBelowTheFoldQuery",
  "SearchQuery",
  "ArtistAboveTheFoldQuery",
  "ArtistBelowTheFoldQuery",
  "InboxQuery",
]

export const legacyErrorMiddleware = async (
  req: GraphQLRequest,
  res: RelayNetworkLayerResponse
) => {
  const resJson = res?.json as GraphQLResponse

  // @ts-ignore RELAY 12 MIGRATION
  const hasErrors = Boolean(resJson.errors?.length)

  if (!hasErrors) {
    return res
  }

  const allErrorsAreOptional =
    // @ts-ignore RELAY 12 MIGRATION
    resJson.extensions?.optionalFields?.length === resJson.errors?.length

  if (allErrorsAreOptional) {
    trackError(req.operation.name, req.operation.operationKind, "optionalField")
    return res
  }

  // at this point, we have errors that are not optional

  const requestHasPrincipalField = req.operation.text?.includes("@principalField")

  if (!requestHasPrincipalField) {
    trackError(req.operation.name, req.operation.operationKind, "default")
    return throwError(req, res)
  }

  // at this point, we have errors and we have a principalField

  // This represents whether or not the query experienced an error and that error was thrown while resolving
  // a field marked with the @principalField directive, or any sub-selection of such a field.
  const principalFieldWasInvolvedInError = isErrorStatus(
    // @ts-ignore RELAY 12 MIGRATION
    resJson.extensions?.principalField?.httpStatusCode
  )

  if (principalFieldWasInvolvedInError) {
    trackError(req.operation.name, req.operation.operationKind, "principalField")
    return throwError(req, res)
  }

  return res
}

export const errorMiddleware = () => (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
  const res = await next(req)

  const useNewErrorMiddlewareFeatureFlag = unsafe_getFeatureFlag("ARUseNewErrorMiddleware")

  const isScreenUsingNewErrorMiddleware = newErrorMiddlewareOptedInQueries.includes(
    req.operation.name
  )

  const enableNewErrorMiddleware =
    useNewErrorMiddlewareFeatureFlag && isScreenUsingNewErrorMiddleware

  if (!!enableNewErrorMiddleware) {
    return principalFieldErrorHandlerMiddleware(req, res)
  }

  return legacyErrorMiddleware(req, res)
}
