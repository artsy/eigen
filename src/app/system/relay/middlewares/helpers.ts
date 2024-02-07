import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { volleyClient } from "app/utils/volleyClient"
import { Platform } from "react-native"
import { getVersion } from "react-native-device-info"
import { RelayNetworkLayerResponse, createRequestError } from "react-relay-network-modern"

export const isErrorStatus = (status: number | undefined) => {
  return (status ?? 200) >= 400
}

export const throwError = (req: GraphQLRequest, res: RelayNetworkLayerResponse) => {
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
