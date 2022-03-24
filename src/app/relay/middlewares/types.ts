import { RelayNetworkLayerRequest } from "react-relay-network-modern/node8"
import { CacheConfig, RequestParameters } from "relay-runtime"

type Mutable<T> = { -readonly [P in keyof T]: T[P] } // Remove readonly

type GraphQLRequestOperation = Mutable<RequestParameters>

export type GraphQLRequest = RelayNetworkLayerRequest & {
  cacheConfig: CacheConfig
  operation: GraphQLRequestOperation
  variables: Record<any, any>
}
