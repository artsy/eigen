import { MapRendererQuery } from "__generated__/MapRendererQuery.graphql"
import colors from "lib/data/colors"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { View } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { GlobalMapContainer as GlobalMap } from "./GlobalMap"
import { SafeAreaInsets } from "./types"

// Are you seeing "cannot read .fairs of null"? You might need to set your simulator location.

// This sentinel value essentially means, load /all/ records.
// See https://github.com/artsy/metaphysics/pull/1533
const MAX_GRAPHQL_INT = 2147483647

export const MapRenderer: React.SFC<{
  citySlug: string
  hideMapButtons: boolean
  initialCoordinates?: { lat: number; lng: number }
  safeAreaInsets: SafeAreaInsets
  userLocationWithinCity: boolean
}> = props => {
  let isRetrying = false
  return (
    <QueryRenderer<MapRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        # Don't rename this query withou also updating the generate-cities-cache.js script.
        query MapRendererQuery($citySlug: String!, $maxInt: Int!) {
          viewer {
            ...GlobalMap_viewer @arguments(citySlug: $citySlug, maxInt: $maxInt)
          }
        }
      `}
      variables={{
        citySlug: props.citySlug,
        maxInt: MAX_GRAPHQL_INT,
      }}
      render={({ props: mapProps, error, retry }) => {
        // viewer={null} is to handle the case where we want to render the map with initialCoordinates but the Relay
        // response hasn't arrived yet. Relay requires us to pass an explicit null if the missing data is intentional.
        const computedProps: any = { viewer: null, ...mapProps, ...props }

        if (error) {
          // Error indicates this is the first render with the error.
          return (
            <GlobalMap
              {...computedProps}
              viewer={null}
              relayErrorState={{
                error,
                retry: () => {
                  isRetrying = true
                  retry()
                },
                isRetrying,
              }}
            />
          )
        } else if (isRetrying) {
          // isRetrying that the user hit the retry button on the last render. The next time we render, the request will
          // have completed (with success or error).
          isRetrying = false
          return <GlobalMap {...computedProps} viewer={null} relayErrorState={{ isRetrying: true }} />
        } else if (mapProps || props.initialCoordinates) {
          return <GlobalMap {...computedProps} />
        } else {
          // This shouldn't happen in practice, but let's return something in case it does.
          return <View style={{ backgroundColor: colors["gray-light"] }} />
        }
      }}
      cacheConfig={
        {
          emissionCacheTTL: 7200000, // 1000 * 60 * 60 * 2 = 2 hours
        } as any
      }
    />
  )
}
