import { color, Flex, Sans } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { LocationMap_location } from "__generated__/LocationMap_location.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

// TODO: This is a testing access token, will need to regenerate and move to cocoapods-keys
Mapbox.setAccessToken("pk.eyJ1IjoiYXJ0c3lpdCIsImEiOiJjam51dTJibTEwNHNpM3BxamV4dDRibzJhIn0.bhFMJt1mqxNDrE1xSAtxSw")

const Map = styled(Mapbox.MapView)`
  flex: 1;
  height: 200;
`

interface Props {
  location: LocationMap_location
  partnerName?: string
}

export class LocationMap extends React.Component<Props> {
  render() {
    const { location, partnerName } = this.props
    const { lat, lng } = location.coordinates

    return (
      <Flex>
        <Map
          styleURL={Mapbox.StyleURL.Light}
          centerCoordinate={[lng, lat]}
          zoomLevel={13}
          logoEnabled={false}
          scrollEnabled={false}
          // zoomEnabled={false}
        />
        <Sans size="2" color={color("black100")} weight="medium">
          {partnerName}
        </Sans>
        <Sans size="1">{location.address}</Sans>
        <Sans size="1">{location.address_2}</Sans>
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
