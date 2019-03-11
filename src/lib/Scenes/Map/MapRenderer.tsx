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
}> = props => {
  return (
    <QueryRenderer<MapRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
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
      render={({ props: mapProps }) => {
        // TODO: Handle error, see LD-318.
        if (mapProps || props.initialCoordinates) {
          // viewer={null} is to handle the case where we want to render the map with initialCoordinates but the Relay
          // response hasn't arrived yet. Relay requires us to pass an explicit null if the missing data is intentional.
          return <GlobalMap viewer={null} {...mapProps} {...props} />
        }
        return <View style={{ backgroundColor: colors["gray-light"] }} />
      }}
      cacheConfig={
        {
          emissionCacheTTL: 86400, // 60 * 60 * 24 = 1 day
        } as any
      }
    />
  )
}
