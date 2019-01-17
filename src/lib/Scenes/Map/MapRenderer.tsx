import { MapRendererQuery } from "__generated__/MapRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { City } from "../City/City"

export const MapRenderer = ({ city, render }: { city: City; render: any }) => {
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
