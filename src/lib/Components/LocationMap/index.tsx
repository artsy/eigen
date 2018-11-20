import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { LocationMap_location } from "__generated__/LocationMap_location.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

// TODO: This is a testing access token, will need to regenerate and move to cocoapods-keys
Mapbox.setAccessToken("pk.eyJ1IjoiYXJ0c3lpdCIsImEiOiJjam51dTJibTEwNHNpM3BxamV4dDRibzJhIn0.bhFMJt1mqxNDrE1xSAtxSw")

const Map = styled(Mapbox.MapView)`
  height: 90;
  margin-top: 20px;
`

interface Props {
  location: LocationMap_location
  partnerType: string
  partnerName: string
}

export class LocationMap extends React.Component<Props> {
  render() {
    const { location, partnerType, partnerName } = this.props
    const { lat, lng } = location.coordinates
    const { address_2, address } = location
    let markerAsset
    const galleryIcon = require("../../../../images/pingalleryon.png")
    const museumIcon = require("../../../../images/pinmuseumon.png")
    const fairIcon = require("../../../../images/pinfairon.png")
    if (partnerType === "Museum") {
      markerAsset = museumIcon
    } else if (partnerType === "Fair") {
      markerAsset = fairIcon
    } else {
      markerAsset = galleryIcon
    }
    const style = Mapbox.StyleSheet.create({
      symbol: {
        iconImage: markerAsset,
        iconSize: 1,
        iconOffset: [0, 0],
        iconAllowOverlap: true,
      },
    })
    const marker = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      id: "mapbox-marker",
    }

    return (
      <Flex>
        <Box>
          {partnerName && (
            <Sans size="3" color={color("black100")} textAlign={"center"} weight="medium">
              {partnerName}
            </Sans>
          )}
          {address && (
            <Serif size="3" color="black60" textAlign="center">
              {address}
            </Serif>
          )}
          {address_2 && (
            <Serif size="3" color="black60" textAlign="center">
              {address_2}
            </Serif>
          )}
        </Box>
        <Map
          key={lng}
          styleURL={Mapbox.StyleURL.Light}
          centerCoordinate={[lng, lat]}
          zoomLevel={13}
          logoEnabled={false}
          scrollEnabled={false}
          // zoomEnabled={true}
        >
          <Mapbox.ShapeSource
            id="marker-source"
            shape={{
              type: "FeatureCollection",
              features: [marker],
            }}
          >
            <Mapbox.SymbolLayer id={lng.toString()} style={style.symbol} />
          </Mapbox.ShapeSource>
        </Map>
      </Flex>
    )
  }
}

export const LocationMapContainer = createFragmentContainer(
  LocationMap,
  graphql`
    fragment LocationMap_location on Location {
      __id
      id
      city
      address
      address_2
      display
      coordinates {
        lat
        lng
      }
      day_schedules {
        start_time
        end_time
        day_of_week
      }
    }
  `
)
