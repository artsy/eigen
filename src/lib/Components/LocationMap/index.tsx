import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { LocationMap_location } from "__generated__/LocationMap_location.graphql"
import { Pin } from "lib/Icons/Pin"
import { ArtsyMapStyleURL } from "lib/Scenes/Map/GlobalMap"
import React from "react"
import { ActionSheetIOS, Clipboard, Linking, NativeModules, TouchableOpacity } from "react-native"
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

    const tappedOnMap = () => {
      // Fairs only have a "summary", so we need to
      // be quite conservative about what parts of the address we
      // send to the different services
      const firstLineAddress = address || summary
      const lastLine = cityAndPostalCode()
      const suffix = lastLine && !firstLineAddress.includes(lastLine) ? `, ${lastLine}` : ""
      const title = `${firstLineAddress}${suffix}`
      const addressOrName = address || partnerName

      ActionSheetIOS.showActionSheetWithOptions(
        {
          title,
          options: ["Cancel", "Open in Apple Maps", "Open in City Mapper", "Open in Google Maps", "Copy Address"],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            // Apple Maps
            // https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
            Linking.openURL(`http://maps.apple.com/?addr="${addressOrName}${suffix}"&near=${lat},${lng}`)
          } else if (buttonIndex === 2) {
            // City Mapper
            // https://citymapper.com/tools/1053/launch-citymapper-for-directions
            Linking.openURL(
              `https://citymapper.com/directions?endcoord=${lat},${lng}&endname=${partnerName}&endaddress=${address}`
            )
          } else if (buttonIndex === 3) {
            // Google Maps
            // https://developers.google.com/maps/documentation/urls/guide
            Linking.openURL(`https://www.google.com/maps/dir/?api=1&map_action=map&destination=${lat}, ${lng}`)
          } else if (buttonIndex === 4) {
            // Copy to pasteboard
            Clipboard.setString(title)
          }
        }
      )
    }

    return (
      <TouchableOpacity onPress={tappedOnMap}>
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
      </TouchableOpacity>
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
