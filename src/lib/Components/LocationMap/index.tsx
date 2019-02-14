import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { LocationMap_location } from "__generated__/LocationMap_location.graphql"
import { Pin } from "lib/Icons/Pin"
import { ArtsyMapStyleURL } from "lib/Scenes/Map/GlobalMap"
import React from "react"
import { NativeModules } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const Emission = NativeModules.Emission || {}

Mapbox.setAccessToken(Emission.mapBoxAPIClientKey)

const Map = styled(Mapbox.MapView)`
  height: 120;
`

const MapWrapper = styled(Flex)`
  border-width: 1px;
  border-color: ${color("black10")};
`

export enum PartnerType {
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
  render() {
    const { location, partnerName } = this.props
    const { lat, lng } = location.coordinates || { lat: null, lng: null }
    const { address_2, address, id, postal_code, city, summary } = location

    if (!lat || !lng) {
      return null
    }

    const cityAndPostalCode = () => {
      if (city && postal_code) {
        return city + ", " + postal_code
      } else if (city) {
        return city
      } else if (postal_code) {
        return postal_code
      }
    }

    const renderSummaryAddress = () => {
      return (
        <Box my={2}>
          {partnerName && (
            <Sans size="3" color="black100" textAlign="center" weight="medium">
              {partnerName}
            </Sans>
          )}
          <Serif size="3t" color="black60" textAlign="center">
            {summary}
          </Serif>
        </Box>
      )
    }

    const renderSegmentedAddress = () => {
      return (
        <Box my={2}>
          {partnerName && (
            <Sans size="3" color="black100" textAlign="center" weight="medium">
              {partnerName}
            </Sans>
          )}
          {address && (
            <Serif size="3t" color="black60" textAlign="center">
              {address}
            </Serif>
          )}
          {address_2 && (
            <Serif size="3t" color="black60" textAlign="center">
              {address_2}
            </Serif>
          )}
          {(city || postal_code) && (
            <Serif size="3t" color="black60" textAlign="center">
              {cityAndPostalCode()}
            </Serif>
          )}
        </Box>
      )
    }

    const renderAddress = () => {
      if (summary) {
        return renderSummaryAddress()
      } else {
        return renderSegmentedAddress()
      }
    }

    return (
      <Box pb={2}>
        <MapWrapper>
          <Map
            key={lng}
            styleURL={ArtsyMapStyleURL}
            centerCoordinate={[lng, lat]}
            zoomLevel={14}
            logoEnabled={false}
            scrollEnabled={false}
            attributionEnabled={false}
          >
            <Mapbox.PointAnnotation id={id} coordinate={[lng, lat]}>
              <Pin />
            </Mapbox.PointAnnotation>
          </Map>
          {renderAddress()}
        </MapWrapper>
      </Box>
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
      postal_code
      summary
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
