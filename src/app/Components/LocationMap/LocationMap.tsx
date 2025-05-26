import { Flex, Box, Text } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import Clipboard from "@react-native-clipboard/clipboard"
import MapboxGL from "@rnmapbox/maps"
import { themeGet } from "@styled-system/theme-get"
import { LocationMap_location$data } from "__generated__/LocationMap_location.graphql"
import { Pin } from "app/Components/Icons/Pin"
import { ArtsyMapStyleURL } from "app/Scenes/Map/GlobalMap"
import { Linking, TouchableOpacity } from "react-native"
import Keys from "react-native-keys"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

MapboxGL.setAccessToken(Keys.secureFor("MAPBOX_API_CLIENT_KEY"))

const MapWrapper = styled(Flex)`
  border-width: 1px;
  border-color: ${themeGet("colors.mono10")};
`

interface Props {
  location: LocationMap_location$data
  partnerName: string | null | undefined
}

export const cityAndPostalCode = (
  city: string | null | undefined,
  postalCode: string | null | undefined
) => {
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
  lat: number | null | undefined,
  lng: number | null | undefined,
  addressOrName: string | null | undefined,
  partnerName: string | null | undefined,
  address: string | null | undefined,
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
  lat: number | null | undefined,
  lng: number | null | undefined,
  address: string | null | undefined,
  summary: string | null | undefined,
  partnerName: string | null | undefined,
  city: string | null | undefined,
  postalCode: string | null | undefined
): Parameters<ReturnType<typeof useActionSheet>["showActionSheetWithOptions"]> => {
  // Fairs only have a "summary", so we need to
  // be quite conservative about what parts of the address we
  // send to the different services
  const firstLineAddress = address || summary
  const lastLine = cityAndPostalCode(city, postalCode)
  const suffix = lastLine && !firstLineAddress?.includes(lastLine) ? `, ${lastLine}` : ""
  const addressOrName = address || partnerName
  const title = firstLineAddress ? `${firstLineAddress}${suffix}` : addressOrName ?? ""

  return [
    {
      title,
      options: [
        "Open in Apple Maps",
        "Open in City Mapper",
        "Open in Google Maps",
        "Copy Address",
        "Cancel",
      ],
      get cancelButtonIndex() {
        return this.options.length - 1
      },
    },
    (buttonIndex: number | undefined) => {
      if (buttonIndex === 0) {
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
      } else if (buttonIndex === 1) {
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
      } else if (buttonIndex === 2) {
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
          .then((canOpenURL) => {
            if (canOpenURL) {
              Linking.openURL(appLink)
            } else {
              Linking.openURL(webLink)
            }
          })
          .catch(() => {
            Linking.openURL(webLink)
          })
      } else if (buttonIndex === 3) {
        // Copy to pasteboard
        Clipboard.setString(title)
      }
    },
  ]
}

export const LocationMap: React.FC<Props> = (props) => {
  const { showActionSheetWithOptions } = useActionSheet()
  const { location, partnerName } = props
  const { lat, lng } = location.coordinates || { lat: null, lng: null }
  const { address2, address, internalID, postalCode, city, summary } = location

  if (!lat || !lng) {
    return null
  }

  const renderSummaryAddress = () => {
    return (
      <Box m={2}>
        {!!partnerName && (
          <Text variant="sm" color="mono100" textAlign="center">
            {partnerName}
          </Text>
        )}
        <Text variant="sm" color="mono60" textAlign="center">
          {summary}
        </Text>
      </Box>
    )
  }

  const renderSegmentedAddress = () => {
    return (
      <Box m={2}>
        {!!partnerName && (
          <Text variant="sm" color="mono100" textAlign="center">
            {partnerName}
          </Text>
        )}
        {!!address && (
          <Text variant="sm" color="mono60" textAlign="center">
            {address}
          </Text>
        )}
        {!!address2 && (
          <Text variant="sm" color="mono60" textAlign="center">
            {address2}
          </Text>
        )}
        {(!!city || !!postalCode) && (
          <Text variant="sm" color="mono60" textAlign="center">
            {cityAndPostalCode(city, postalCode)}
          </Text>
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
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() =>
        showActionSheetWithOptions(
          ...tappedOnMap(lat, lng, address, summary, partnerName, city, postalCode)
        )
      }
    >
      <MapWrapper>
        <MapboxGL.MapView
          style={{ height: 120 }}
          key={lng}
          styleURL={ArtsyMapStyleURL}
          logoEnabled={false}
          scrollEnabled={false}
          attributionEnabled={false}
        >
          <MapboxGL.Camera centerCoordinate={[lng, lat]} zoomLevel={14} />
          <MapboxGL.PointAnnotation id={internalID} coordinate={[lng, lat]}>
            <Pin />
          </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
        {renderAddress()}
      </MapWrapper>
    </TouchableOpacity>
  )
}

export const LocationMapContainer = createFragmentContainer(LocationMap, {
  location: graphql`
    fragment LocationMap_location on Location {
      id
      internalID
      city
      address
      address2
      postalCode
      summary
      coordinates {
        lat
        lng
      }
    }
  `,
})
