import { captureMessage } from "@sentry/react-native"
import { isErrorStatus, throwError, trackError } from "app/system/relay/middlewares/helpers"
import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { RelayNetworkLayerResponse } from "react-relay-network-modern"
import { GraphQLSingularResponse } from "relay-runtime"

export const principalFieldErrorHandlerMiddleware = async (
  req: GraphQLRequest,
  res: RelayNetworkLayerResponse
) => {
  const resJson = res?.json as GraphQLSingularResponse
  const requestHasPrincipalField = req.operation.text?.includes("@principalField")

  // This represents whether or not the query experienced an error and that error was thrown while resolving
  // a field marked with the @principalField directive, or any sub-selection of such a field.
  const principalFieldWasInvolvedInError = isErrorStatus(
    resJson.extensions?.principalField?.httpStatusCode
  )

  // query did not have a principal field, but experienced an error, we report it to sentry and volley
  if (!requestHasPrincipalField && !!res?.errors?.length) {
    trackError(req.operation.name, req.operation.operationKind, "default")
    captureMessage(`${req.operation.operationKind} failed: ${req.operation.name}`)
  }

  if (principalFieldWasInvolvedInError) {
    trackError(req.operation.name, req.operation.operationKind, "principalField")
    return throwError(req, res)
  } else {
    return res
  }
}
