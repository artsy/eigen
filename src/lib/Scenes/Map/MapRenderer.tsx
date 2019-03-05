import { MapRendererQuery } from "__generated__/MapRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { GlobalMapContainer as GlobalMap } from "./GlobalMap"
import { Coordinates } from "./types"

// Are you seeing "cannot read .fairs of null"? You might need to set your simulator location.

// This sentinel value essentially means, load /all/ records.
// See https://github.com/artsy/metaphysics/pull/1533
const MAX_GRAPHQL_INT = 2147483647

export const MapRenderer = ({ coords, hideMapButtons }: { coords: Coordinates; hideMapButtons: boolean }) => {
  return (
    <QueryRenderer<MapRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MapRendererQuery($near: Near!, $maxInt: Int!) {
          viewer {
            ...GlobalMap_viewer @arguments(near: $near, maxInt: $maxInt)
          }
        }
      `}
      variables={{
        near: coords,
        maxInt: MAX_GRAPHQL_INT,
      }}
      render={({ props }) => {
        if (props) {
          return <GlobalMap {...props as any} initialCoordinates={coords} hideMapButtons={hideMapButtons} />
        }

        return null
      }}
    />
  )
}
