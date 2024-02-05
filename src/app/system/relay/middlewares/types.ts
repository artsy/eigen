import { RelayNetworkLayerRequest } from "react-relay-network-modern"
import { CacheConfig as RelayCacheConfig, RequestParameters } from "relay-runtime"

type Mutable<T> = { -readonly [P in keyof T]: T[P] } // Remove readonly

type GraphQLRequestOperation = Mutable<RequestParameters>

interface CacheConfig extends RelayCacheConfig {
  emissionCacheTTLSeconds?: number
}

export type GraphQLRequest = RelayNetworkLayerRequest & {
  cacheConfig: CacheConfig
  operation: GraphQLRequestOperation
  variables: Record<any, any>
}
