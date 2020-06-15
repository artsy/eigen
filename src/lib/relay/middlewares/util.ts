import { RelayNetworkLayerRequest, RelayRequestAny } from "react-relay-network-modern/node8"

/**
 * `RelayRequestAny` is a union of `RelayRequest | RelayRequestBatch`
 * only `id` is present in a `RelayRequest`
 */
export const isRelayRequest = (req: RelayRequestAny): req is RelayNetworkLayerRequest => "id" in req
