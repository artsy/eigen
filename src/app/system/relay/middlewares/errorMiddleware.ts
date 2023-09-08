import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { throwError, trackError } from "app/system/relay/middlewares/helpers"
import { principalFieldErrorHandlerMiddleware } from "app/system/relay/middlewares/principalFieldErrorHandlerMiddleware"
import { MiddlewareNextFn, RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import { GraphQLResponse } from "relay-runtime/lib/network/RelayNetworkTypes"
import { GraphQLRequest } from "./types"

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
    trackError(req.operation.name, req.operation.kind, "optionalField")
    return res
  }

  // at this point, we have errors that are not optional

  const requestHasPrincipalField = req.operation.text?.includes("@principalField")

  if (!requestHasPrincipalField) {
    trackError(req.operation.name, req.operation.kind, "default")
    return throwError(req, res)
  }

  // at this point, we have errors and we have a principalField

  // This represents whether or not the query experienced an error and that error was thrown while resolving
  // a field marked with the @principalField directive, or any sub-selection of such a field.
  // @ts-ignore RELAY 12 MIGRATION
  const principalFieldWasInvolvedInError = isErrorStatus(
    // @ts-ignore RELAY 12 MIGRATION
    resJson.extensions?.principalField?.httpStatusCode
  )

  if (principalFieldWasInvolvedInError) {
    trackError(req.operation.name, req.operation.kind, "principalField")
    return throwError(req, res)
  }

  return res
}

export const errorMiddleware = () => (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
  const res = await next(req)

  const useNewErrorMiddlewareFeatureFlag = unsafe_getFeatureFlag("ARUseNewErrorMiddleware")

  // Do we want to differenciate between screens with a flag in the query variables?
  // const isScreenUsingNewErrorMiddleware = !!req.variables.useNewErrorMiddleware

  const enableNewErrorMiddleware = useNewErrorMiddlewareFeatureFlag
  // && isScreenUsingNewErrorMiddleware

  if (!!enableNewErrorMiddleware) {
    return principalFieldErrorHandlerMiddleware(req, res)
  }

  return legacyErrorMiddleware(req, res)
}
