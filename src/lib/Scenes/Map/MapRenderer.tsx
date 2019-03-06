import { MapRendererQuery } from "__generated__/MapRendererQuery.graphql"
import colors from "lib/data/colors"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { View } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { GlobalMapContainer as GlobalMap } from "./GlobalMap"

// Are you seeing "cannot read .fairs of null"? You might need to set your simulator location.

// This sentinel value essentially means, load /all/ records.
// See https://github.com/artsy/metaphysics/pull/1533
const MAX_GRAPHQL_INT = 2147483647

export const MapRenderer: React.SFC<{
  citySlug: string
  hideMapButtons: boolean
  initialCoordinates?: { lat: number; lng: number }
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
          return <GlobalMap {...mapProps} {...props} />
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
