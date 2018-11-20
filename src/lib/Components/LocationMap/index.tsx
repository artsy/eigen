import { Box, Flex, Sans, Serif } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { LocationMap_location } from "__generated__/LocationMap_location.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

// TODO: This is a testing access token, will need to regenerate and move to cocoapods-keys
Mapbox.setAccessToken("pk.eyJ1IjoiYXJ0c3lpdCIsImEiOiJjam51dTJibTEwNHNpM3BxamV4dDRibzJhIn0.bhFMJt1mqxNDrE1xSAtxSw")

const Map = styled(Mapbox.MapView)`
  height: 90;
`

const MapWrapper = styled(Flex)`
  border-width: 1px;
  border-color: #ebeaec;
`

const TextWrapper = styled(Box)`
  margin-top: 20px;
  margin-bottom: 20px;
`

enum PartnerType {
  gallery = "Gallery",
  museum = "Museum",
  fair = "Fair",
}

interface Props {
  location: LocationMap_location
  partnerType: PartnerType
  partnerName?: string
}

export class LocationMap extends React.Component<Props> {
  get symbolLayerStyle() {
    return Mapbox.StyleSheet.create({
      symbol: {
        iconImage: this.returnPinType(this.props.partnerType),
        iconSize: 1,
        iconOffset: [0, 0],
        iconAllowOverlap: true,
      },
    })
  }

  returnPinType = partnerType => {
    switch (partnerType) {
      case "Fair":
        return require("../../../../images/pinfairon.png")
      case "Museum":
        return require("../../../../images/pinmuseumon.png")
      case "Gallery":
        return require("../../../../images/pingalleryon.png")
    }
  }

  render() {
    const { location, partnerName } = this.props
    const { lat, lng } = location.coordinates
    const { address_2, address } = location

    const marker = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      id: "mapbox-marker",
    }
    // style={this.symbolLayerStyle.symbol}
    return (
      <MapWrapper>
        <Map
          key={lng}
          styleURL={Mapbox.StyleURL.Light}
          centerCoordinate={[lng, lat]}
          zoomLevel={13}
          logoEnabled={false}
          scrollEnabled={false}
        >
          <Mapbox.ShapeSource
            id="marker-source"
            shape={{
              type: "FeatureCollection",
              features: [marker],
            }}
          >
            <Mapbox.SymbolLayer id={lng.toString()} />
          </Mapbox.ShapeSource>
        </Map>
        <TextWrapper>
          {partnerName && (
            <Sans size="3" color="black100" textAlign="center" weight="medium">
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
        </TextWrapper>
      </MapWrapper>
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
