import * as Sentry from "@sentry/react-native"
import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { volleyClient } from "app/utils/volleyClient"
import { Platform } from "react-native"
import { getVersion } from "react-native-device-info"
import {
  createRequestError,
  formatGraphQLErrors,
  GraphQLResponseErrors,
  RelayNetworkLayerResponse,
} from "react-relay-network-modern"

export const isErrorStatus = (status: number | undefined) => {
  return (status ?? 200) >= 400
}

export const throwError = (req: GraphQLRequest, res: RelayNetworkLayerResponse) => {
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

export const trackError = (
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
      `appVersion: ${getVersion()}`,
    ],
  })
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
