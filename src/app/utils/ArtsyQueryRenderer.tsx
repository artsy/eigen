import React from "react"
import { FetchPolicy, QueryRenderer, QueryRendererProps } from "react-relay"
import { CacheConfig, OperationType } from "relay-runtime"

const TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

type ArtsyQueryRendererProps<TOperation extends OperationType> = {
  cacheConfig?: CacheConfig | null | undefined
  fetchPolicy?: FetchPolicy | undefined
} & QueryRendererProps<TOperation>

/** Wraps Relay's `QueryRenderer` sets the fetchPolicy to "store-and-network" and the ttl to 30 days */
export function ArtsyQueryRenderer<TOperation extends OperationType>({
  cacheConfig,
  ...restProps
}: ArtsyQueryRendererProps<TOperation>) {
  return (
    <QueryRenderer<TOperation>
      {...restProps}
      fetchPolicy="store-and-network"
      cacheConfig={{ ttl: TTL, ...cacheConfig }}
    />
  )
}
