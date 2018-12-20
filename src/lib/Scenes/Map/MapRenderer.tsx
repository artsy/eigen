import { MapRendererQuery } from "__generated__/MapRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { cities } from "../City/cities"

export const MapRenderer = ({ render }) => {
  // Logic for whether to show a city or cities list
  //
  // 1. Get user location (lat, lng) from native code
  // 2. do a lookup to get nearest city up to a certain threshold
  // 3. if within threshold select nearest city
  // 4. else show cities list
  const city = cities[0]
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
        near: city.epicenter,
      }}
      render={render}
    />
  )
}
