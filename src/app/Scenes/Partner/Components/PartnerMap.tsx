import { Box, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import MapboxGL from "@rnmapbox/maps"
import { themeGet } from "@styled-system/theme-get"
import { PartnerMap_location$data } from "__generated__/PartnerMap_location.graphql"
import { Pin } from "app/Components/Icons/Pin"
import { cityAndPostalCode, tappedOnMap } from "app/Components/LocationMap/LocationMap"
import { ArtsyMapStyleURL } from "app/Scenes/Map/GlobalMap"
import { TouchableOpacity } from "react-native"
import Keys from "react-native-keys"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

MapboxGL.setAccessToken(Keys.secureFor("MAPBOX_API_CLIENT_KEY"))

const PartnerMap: React.FC<{
  location: PartnerMap_location$data
}> = ({ location }) => {
  const { address, address2, city, postalCode, internalID } = location
  let { lat, lng } = location.coordinates ?? { lat: null, lng: null }
  if (lat === null || lat === undefined) {
    lat = 0
  }
  if (lng === null || lng === undefined) {
    lng = 0
  }

  const { showActionSheetWithOptions } = useActionSheet()

  return (
    <Box px={2} mt={2}>
      <Text variant="sm" weight="medium">
        {city}
      </Text>
      <Spacer y={0.5} />
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() =>
          showActionSheetWithOptions(
            ...tappedOnMap(lat, lng, address, null, null, city, postalCode)
          )
        }
      >
        <MapWrapper>
          <MapboxGL.MapView
            style={{ height: 120 }}
            key={`${lng}`}
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
          <Box my={2}>
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
        </MapWrapper>
      </TouchableOpacity>
    </Box>
  )
}

export const PartnerMapContainer = createFragmentContainer(PartnerMap, {
  location: graphql`
    fragment PartnerMap_location on Location {
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

const MapWrapper = styled(Flex)`
  border-width: 1px;
  border-color: ${themeGet("colors.mono10")};
`
