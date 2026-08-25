import { BackButton, Box, Flex } from "@artsy/palette-mobile"
import { CityGuideMap_viewer$data } from "__generated__/CityGuideMap_viewer.graphql"
import { BACK_BUTTON_SIZE_SIZE } from "app/Components/constants"
import { CityGuideCitySwitcherButton } from "app/Scenes/CityGuide/Components/CityGuideCitySwitcherButton"
import { CityGuideUserPositionButton } from "app/Scenes/CityGuide/Components/CityGuideUserPositionButton"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

interface Props {
  safeAreaInsetTop: number
  city: CityGuideMap_viewer$data["city"]
  userLocation?: { lat: number | null | undefined; lng: number | null | undefined } | null
  currentLocation?: { lat: number | null | undefined; lng: number | null | undefined } | null
  onPressCitySwitcherButton: () => void
  onPressUserPositionButton: () => void
}

export const CityGuideMapHeader: React.FC<Props> = ({
  safeAreaInsetTop,
  city,
  userLocation,
  currentLocation,
  onPressCitySwitcherButton,
  onPressUserPositionButton,
}) => {
  const showGlobalMapList = useFeatureFlag("AREnableGlobalMapList")

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
        <CityGuideCitySwitcherButton
          city={city}
          isLoading={!city}
          onPress={onPressCitySwitcherButton}
        />
        {!showGlobalMapList && !!isValidLatLng(userLocation) && (
          <Box style={{ marginLeft: 10 }}>
            <CityGuideUserPositionButton
              highlight={userLocation === currentLocation}
              onPress={onPressUserPositionButton}
            />
          </Box>
        )}
      </Flex>
    </Flex>
  )
}
