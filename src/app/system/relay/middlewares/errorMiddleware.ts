import * as Sentry from "@sentry/react-native"
import { volleyClient } from "app/utils/volleyClient"
import { Platform } from "react-native"
import deviceInfoModule from "react-native-device-info"
import {
  createRequestError,
  formatGraphQLErrors,
  GraphQLResponseErrors,
  MiddlewareNextFn,
  RelayNetworkLayerResponse,
} from "react-relay-network-modern/node8"
import { GraphQLResponse } from "relay-runtime/lib/network/RelayNetworkTypes"
import { GraphQLRequest } from "./types"

const isErrorStatus = (status: number | undefined) => {
  return (status ?? 200) >= 400
}

const throwError = (req: GraphQLRequest, res: RelayNetworkLayerResponse) => {
  Sentry.withScope((scope) => {
    scope.setExtra("kind", req.operation.operationKind)
    scope.setExtra("query-name", req.operation.name)
    scope.setExtra("query-text", req.operation.text)

    if (res.errors) {
      scope.setExtra("formatted-error", formatGraphQLErrors(req, res.errors))
    }

    if (req.variables) {
      scope.setExtra("variables", req.variables as any)
    }

    const sentryFormattedError = createRequestError(req, res)

    // All errors returned by createRequestError are titled "RRNLRequestError", this makes it hard to identify which
    // issues we should pay attention to in the issues list until we open the issue page separately
    // We want to fix that by changing that title into a properly formatted error
    sentryFormattedError.name = formatName(req, res.errors)
    Sentry.captureException(sentryFormattedError)
  })
  throw createRequestError(req, res)
}

const formatName = (req: GraphQLRequest, errors?: GraphQLResponseErrors) => {
  let errorName = "Generic Error - see metadata"
  if (errors) {
    errorName = shortError(errors)
  }
  const queryName = req.operation.name
  const name = queryName + " - " + errorName
  return name
}

const shortError = (errors: GraphQLResponseErrors) => {
  const firstError = errors[0]
  const errorRegex = /{"error":"(?<Message>.+)"}/
  const found = firstError.message.match(errorRegex)
  if (found && found.groups) {
    return found.groups.Message
  } else {
    return "Generic Error - see metadata"
  }
}

const trackError = (
  queryName: string,
  queryKind: string,
  handler: "optionalField" | "principalField" | "default"
) => {
  volleyClient.send({
    type: "increment",
    name: "graphql-request-with-errors",
    tags: [
      `query:${queryName}`,
      `kind:${queryKind}`,
      `handler: ${handler}`,
      `OS: ${Platform.OS}`,
      `appVersion: ${deviceInfoModule.getVersion()}`,
    ],
  })
}

export const errorMiddleware = () => {
  return (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
    const res = await next(req)
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
}
