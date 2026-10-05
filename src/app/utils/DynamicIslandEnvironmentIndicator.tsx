import { Flex } from "@artsy/palette-mobile"
import { useEnvironmentColor } from "app/utils/hooks/useEnvironmentColor"
import { Platform, useWindowDimensions } from "react-native"
import DeviceInfo from "react-native-device-info"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FullWindowOverlay } from "react-native-screens"

// iPhones with a Dynamic Island have a top inset of at least 59pt. Notch iPhones top out at 50pt.
const MIN_ISLAND_INSET = 59

// The island's top edge sits this far above the end of the top inset, on every model measured so far
const ISLAND_TOP_ABOVE_INSET = 47.67
const ISLAND_HEIGHT = 37.33
const ISLAND_WIDTH = 126

// Models whose island width differs from ISLAND_WIDTH. iOS has no API for the island's frame.
const ISLAND_WIDTH_BY_MODEL: Record<string, number> = {
  "iPhone19,2": 96, // iPhone 18 Pro
  "iPhone19,3": 96, // iPhone 18 Pro Max
}
const RING_GAP = 0.5
const RING_THICKNESS = 1

export const DynamicIslandEnvironmentIndicator = () => {
  const insets = useSafeAreaInsets()
  const color = useEnvironmentColor()
  const { width: screenWidth } = useWindowDimensions()

  const hasDynamicIsland = Platform.OS === "ios" && insets.top >= MIN_ISLAND_INSET

  if (!color || !hasDynamicIsland) {
    return null
  }

  const islandWidth = ISLAND_WIDTH_BY_MODEL[DeviceInfo.getDeviceId()] ?? ISLAND_WIDTH
  const islandTop = insets.top - ISLAND_TOP_ABOVE_INSET
  const outset = RING_GAP + RING_THICKNESS

  // FullWindowOverlay keeps the ring above modals
  return (
    <FullWindowOverlay>
      <Flex
        testID="EnvironmentIndicatorRing"
        pointerEvents="none"
        position="absolute"
        top={islandTop - outset}
        left={(screenWidth - islandWidth) / 2 - outset}
        width={islandWidth + outset * 2}
        height={ISLAND_HEIGHT + outset * 2}
        borderRadius={ISLAND_HEIGHT}
        backgroundColor={color}
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          width={islandWidth + RING_GAP * 2}
          height={ISLAND_HEIGHT + RING_GAP * 2}
          borderRadius={ISLAND_HEIGHT}
          backgroundColor="mono0"
        />
      </Flex>
    </FullWindowOverlay>
  )
}
