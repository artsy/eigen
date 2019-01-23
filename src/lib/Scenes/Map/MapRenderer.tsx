import { MapRendererQuery } from "__generated__/MapRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { GlobalMapContainer as GlobalMap } from "./GlobalMap"
import { Coordinates } from "./types"

export const MapRenderer = ({ coords }: { coords: Coordinates }) => {
  console.log("coords", coords)

  return (
    <QueryRenderer<MapRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MapRendererQuery($near: Near!) {
          viewer {
            ...GlobalMap_viewer @arguments(near: $near)
          }
        }
      `}
      variables={{
        near: coords,
      }}
      render={({ props }) => {
        if (props) {
          console.log(props)
          return <GlobalMap {...props as any} initialCoordinates={coords} />
        }

        return null
      }}
    />
  )
}
