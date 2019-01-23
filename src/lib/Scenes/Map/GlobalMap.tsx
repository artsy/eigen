import { Flex } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import React from "react"
import { NativeModules } from "react-native"
import { createRefetchContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { cities } from "../City/cities"
import { FiltersBar } from "./Components/FiltersBar"

const Emission = NativeModules.Emission || {}

Mapbox.setAccessToken(Emission.mapBoxAPIClientKey)

const Map = styled(Mapbox.MapView)`
  height: 100%;
`

export enum PartnerType {
  gallery = "Gallery",
  museum = "Museum",
  fair = "Fair",
}

interface Props {
  initialCoordinates?: { lat: number; lng: number }
  viewer: GlobalMap_viewer
}

export class GlobalMap extends React.Component<Props> {
  state = {
    currentCity: cities["new-york"],
  }

  get symbolLayerStyle() {
    return Mapbox.StyleSheet.create({
      symbol: {
        iconImage: require("../../../../images/pingalleryon.png"),
        iconSize: 1.4,
        iconOffset: [0, 0],
        iconAllowOverlap: true,
      },
    })
  }

  render() {
    const { city } = this.props.viewer
    const { lat, lng } = this.props.initialCoordinates

    return (
      <Flex mb={0.5}>
        <FiltersBar currentCity={city as any} tabs={["All", "Saved", "Fairs", "Galleries", "Museums"]} />

        <Map
          key={lng}
          styleURL={Mapbox.StyleURL.Light}
          centerCoordinate={[lng, lat]}
          zoomLevel={14}
          logoEnabled={false}
          attributionEnabled={false}
        >
          {city.shows.edges.map(({ node }) => {
            const { id, location } = node
            const { lat, lng } = location.coordinates
            const marker = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
              id,
            }

            return (
              <Mapbox.ShapeSource
                id={id}
                shape={{
                  type: "FeatureCollection",
                  features: [marker],
                }}
              >
                <Mapbox.SymbolLayer id={id} style={this.symbolLayerStyle.symbol} />
              </Mapbox.ShapeSource>
            )
          })}
        </Map>
      </Flex>
    )
  }
}

export const GlobalMapContainer = createRefetchContainer(
  GlobalMap,
  graphql`
    fragment GlobalMap_viewer on Viewer @argumentDefinitions(near: { type: "Near!" }) {
      city(near: $near) {
        name
        coordinates {
          lat
          lng
        }

        shows(first: 10) {
          edges {
            node {
              id
              name
              location {
                coordinates {
                  lat
                  lng
                }
              }
            }
          }
        }
      }
    }
  `,
  graphql`
    query GlobalMapRefetchQuery($near: Near) {
      viewer {
        ...GlobalMap_viewer @arguments(near: $near)
      }
    }
  `
)
