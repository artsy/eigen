import { BackButton, Box, Flex } from "@artsy/palette-mobile"
import { GlobalMap_viewer$data } from "__generated__/GlobalMap_viewer.graphql"
import { BACK_BUTTON_SIZE_SIZE } from "app/Components/constants"
import { CitySwitcherButton } from "app/Scenes/Map/Components/CitySwitcherButton"
import { UserPositionButton } from "app/Scenes/Map/Components/UserPositionButton"
import { isValidLatLng } from "app/Scenes/Map/helpers/isValidLatLng"
import { goBack } from "app/system/navigation/navigate"

interface Props {
  safeAreaInsetTop: number
  city: GlobalMap_viewer$data["city"]
  userLocation?: { lat: number | null | undefined; lng: number | null | undefined } | null
  currentLocation?: { lat: number | null | undefined; lng: number | null | undefined } | null
  onPressCitySwitcherButton: () => void
  onPressUserPositionButton: () => void
}

export const GlobalMapHeader: React.FC<Props> = ({
  safeAreaInsetTop,
  city,
  userLocation,
  currentLocation,
  onPressCitySwitcherButton,
  onPressUserPositionButton,
}) => {
  return (
    <Flex
      style={{
        top: safeAreaInsetTop,
        position: "absolute",
        zIndex: 1000,
        width: "100%",
      }}
      px={2}
      flexDirection="row"
      alignItems="center"
      alignContent="space-between"
      justifyContent="space-between"
    >
      <Flex
        borderRadius={BACK_BUTTON_SIZE_SIZE / 2}
        backgroundColor="mono0"
        width={BACK_BUTTON_SIZE_SIZE}
        height={BACK_BUTTON_SIZE_SIZE}
        justifyContent="center"
        alignItems="center"
      >
        <BackButton
          style={{
            top: 0,
            left: 0,
          }}
          onPress={() => {
            goBack()
          }}
        />
      </Flex>
      <Flex flexDirection="row" justifyContent="flex-end" alignContent="flex-end">
        <CitySwitcherButton city={city} isLoading={!city} onPress={onPressCitySwitcherButton} />
        {!!isValidLatLng(userLocation) && (
          <Box style={{ marginLeft: 10 }}>
            <UserPositionButton
              highlight={userLocation === currentLocation}
              onPress={onPressUserPositionButton}
            />
          </Box>
        )}
      </Flex>
    </Flex>
  )
}
