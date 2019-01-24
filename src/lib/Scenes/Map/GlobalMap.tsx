import { Flex } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import React from "react"
import { NativeModules } from "react-native"
import { createRefetchContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { cities } from "../City/cities"
import { FiltersBar } from "./Components/FiltersBar"
import { EventEmitter } from "./EventEmitter"

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

export const GlobalMapContext = React.createContext({ shows: [], fairs: [] })
export class GlobalMap extends React.Component<Props> {
  state = {
    currentCity: cities["new-york"],
  }

  stylesheet = Mapbox.StyleSheet.create({
    symbol: {
      iconImage: require("../../../../images/pingalleryon.png"),
      iconSize: 2,
      iconAllowOverlap: true,
    },
  })

  componentWillReceiveProps(newProps) {
    EventEmitter.dispatch("map:change", newProps.viewer)
  }

  render() {
    const { city } = this.props.viewer
    const { lat: centerLat, lng: centerLng } = this.props.initialCoordinates || city.coordinates

    const features = city.shows.edges
      .map(({ node }) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        const { id, location } = node
        const { lat, lng } = location.coordinates

        return {
          type: "Feature",
          id,
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        }
      })
      .filter(Boolean)

    return (
      <Flex mb={0.5}>
        <FiltersBar currentCity={city as any} tabs={["All", "Saved", "Fairs", "Galleries", "Museums"]} />

        <Map
          showUserLocation={true}
          styleURL={Mapbox.StyleURL.Light}
          userTrackingMode={Mapbox.UserTrackingModes.Follow}
          centerCoordinate={[centerLng, centerLat]}
          zoomLevel={14}
          logoEnabled={false}
          attributionEnabled={false}
          onRegionDidChange={() => {
            EventEmitter.dispatch("map:change", this.props.viewer)
          }}
        >
          <Mapbox.ShapeSource
            id="GalleryIconSource"
            shape={{
              type: "FeatureCollection",
              features,
            }}
          >
            <Mapbox.SymbolLayer id="GalleryIconSymbol" minZoomLevel={1} style={this.stylesheet.symbol} />
          </Mapbox.ShapeSource>
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

        shows(discoverable: true, first: 50, sort: START_AT_ASC) {
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

        fairs(size: 10) {
          id
          name
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
