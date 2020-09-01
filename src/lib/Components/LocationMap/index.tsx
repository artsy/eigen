// @ts-ignore STRICTNESS_MIGRATION
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { LocationMap_location } from "__generated__/LocationMap_location.graphql"
import { Pin } from "lib/Icons/Pin"
import { ArtsyMapStyleURL } from "lib/Scenes/Map/GlobalMap"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { ActionSheetIOS, Clipboard, Linking, TouchableOpacity } from "react-native"
import Config from "react-native-config"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

Mapbox.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

const Map: React.ComponentType<any /* STRICTNESS_MIGRATION */> = styled(Mapbox.MapView)`
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
  partnerName: string | null
}

export const cityAndPostalCode = (city: string | null, postalCode: string | null) => {
  if (city && postalCode) {
    return city + ", " + postalCode
  } else if (city) {
    return city
  } else if (postalCode) {
    return postalCode
  }
}

enum MapServiceURLType {
  Apple,
  CityMapper,
  GoogleApp,
  GoogleWeb,
}

const mapLinkForService = (
  urlType: MapServiceURLType,
  lat: number | null,
  lng: number | null,
  addressOrName: string | null,
  partnerName: string | null,
  address: string | null,
  suffix: string | null
) => {
  switch (urlType) {
    case MapServiceURLType.Apple:
      // https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
      return `http://maps.apple.com/?q=${addressOrName}${suffix}&ll=${lat},${lng}`
    case MapServiceURLType.CityMapper:
      // https://citymapper.com/tools/1053/launch-citymapper-for-directions
      return `https://citymapper.com/directions?endcoord=${lat},${lng}&endname=${partnerName}&endaddress=${address}`
    case MapServiceURLType.GoogleApp:
      // https://developers.google.com/maps/documentation/urls/ios-urlscheme
      return `comgooglemaps-x-callback://?daddr=${lat},${lng}&x-success=artsy://?resume=true&x-source=Artsy`
    case MapServiceURLType.GoogleWeb:
      // https://developers.google.com/maps/documentation/urls/guide
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }
}

export const tappedOnMap = (
  lat: number | null,
  lng: number | null,
  address: string | null,
  summary: string | null,
  partnerName: string | null,
  city: string | null,
  postalCode: string | null
) => {
  // Fairs only have a "summary", so we need to
  // be quite conservative about what parts of the address we
  // send to the different services
  const firstLineAddress = address || summary
  const lastLine = cityAndPostalCode(city, postalCode)
  const suffix = lastLine && !firstLineAddress?.includes(lastLine) ? `, ${lastLine}` : ""
  const addressOrName = address || partnerName
  const title = firstLineAddress ? `${firstLineAddress}${suffix}` : addressOrName ?? ""

  ActionSheetIOS.showActionSheetWithOptions(
    {
      title,
      options: ["Cancel", "Open in Apple Maps", "Open in City Mapper", "Open in Google Maps", "Copy Address"],
      cancelButtonIndex: 0,
    },
    buttonIndex => {
      if (buttonIndex === 1) {
        const mapLink = mapLinkForService(
          MapServiceURLType.Apple,
          lat,
          lng,
          addressOrName,
          partnerName,
          address,
          suffix
        )
        Linking.openURL(mapLink)
      } else if (buttonIndex === 2) {
        const mapLink = mapLinkForService(
          MapServiceURLType.CityMapper,
          lat,
          lng,
          addressOrName,
          partnerName,
          address,
          suffix
        )
        Linking.openURL(mapLink)
      } else if (buttonIndex === 3) {
        const appLink = mapLinkForService(
          MapServiceURLType.GoogleApp,
          lat,
          lng,
          addressOrName,
          partnerName,
          address,
          suffix
        )
        const webLink = mapLinkForService(
          MapServiceURLType.GoogleWeb,
          lat,
          lng,
          addressOrName,
          partnerName,
          address,
          suffix
        )
        Linking.canOpenURL(appLink)
          .then(canOpenURL => {
            if (canOpenURL) {
              Linking.openURL(appLink)
            } else {
              Linking.openURL(webLink)
            }
          })
          .catch(() => {
            Linking.openURL(webLink)
          })
      } else if (buttonIndex === 4) {
        // Copy to pasteboard
        Clipboard.setString(title)
      }
    }
  )
}

export class LocationMap extends React.Component<Props> {
  render() {
    const { location, partnerName } = this.props
    const { lat, lng } = location.coordinates || { lat: null, lng: null }
    const { address_2, address, internalID, postal_code, city, summary } = location

    if (!lat || !lng) {
      return null
    }

    const renderSummaryAddress = () => {
      return (
        <Box my={2}>
          {!!partnerName && (
            <Sans size="3" color="black100" textAlign="center" weight="medium">
              {partnerName}
            </Sans>
          )}
          <Sans size="3t" color="black60" textAlign="center">
            {summary}
          </Sans>
        </Box>
      )
    }

    const renderSegmentedAddress = () => {
      return (
        <Box my={2}>
          {!!partnerName && (
            <Sans size="3" color="black100" textAlign="center" weight="medium">
              {partnerName}
            </Sans>
          )}
          {!!address && (
            <Sans size="3t" color="black60" textAlign="center">
              {address}
            </Sans>
          )}
          {!!address_2 && (
            <Sans size="3t" color="black60" textAlign="center">
              {address_2}
            </Sans>
          )}
          {(!!city || !!postal_code) && (
            <Sans size="3t" color="black60" textAlign="center">
              {cityAndPostalCode(city, postal_code)}
            </Sans>
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
      <TouchableOpacity onPress={() => tappedOnMap(lat, lng, address, summary, partnerName, city, postal_code)}>
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
            <Mapbox.PointAnnotation id={internalID} coordinate={[lng, lat]}>
              <Pin />
            </Mapbox.PointAnnotation>
          </Map>
          {renderAddress()}
        </MapWrapper>
      </TouchableOpacity>
    )
  }
}

export const LocationMapContainer = createFragmentContainer(LocationMap, {
  location: graphql`
    fragment LocationMap_location on Location {
      id
      internalID
      city
      address
      address_2: address2
      postal_code: postalCode
      summary
      coordinates {
        lat
        lng
      }
      day_schedules: daySchedules {
        start_time: startTime
        end_time: endTime
        day_of_week: dayOfWeek
      }
      openingHours {
        ... on OpeningHoursArray {
          schedules {
            days
            hours
          }
        }
        ... on OpeningHoursText {
          text
        }
      }
    }
  `,
})
