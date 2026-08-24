import { Pill, useSpace } from "@artsy/palette-mobile"
import { BACK_BUTTON_SIZE_SIZE } from "app/Components/constants"
import { cityTabs } from "app/Scenes/City/cityTabs"
import { MapTab } from "app/utils/cityGuide/types"
import { FC, useEffect } from "react"
import { ScrollView, ViewProps } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface CityFilterPillsProps {
  selectedTabId: MapTab["id"]
  onSelectTab: (tab: MapTab) => void
  /** Live index of the City bottom sheet (-1 closed, 0 collapsed, 1 open) used to fade the pills as it's dragged. */
  bottomSheetAnimatedIndex: SharedValue<number>
}

export const CityFilterPills: FC<CityFilterPillsProps> = ({
  selectedTabId,
  onSelectTab,
  bottomSheetAnimatedIndex,
}) => {
  const space = useSpace()
  const safeAreaInsets = useSafeAreaInsets()

  const mountOpacity = useSharedValue(0)

  useEffect(() => {
    mountOpacity.value = withTiming(1, { duration: 100 })
  }, [mountOpacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity:
      mountOpacity.value *
      interpolate(bottomSheetAnimatedIndex.value, [0, 1], [1, 0], Extrapolation.CLAMP),
  }))

  return (
    <Animated.View
      style={[
        {
          top: safeAreaInsets.top + BACK_BUTTON_SIZE_SIZE + space(1),
          position: "absolute",
          zIndex: 1000,
          width: "100%",
        },
        animatedStyle,
      ]}
    >
      <ScrollView
        horizontal
        accessible
        accessibilityLabel="Scroll view for city guide filter pills"
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: space(2) }}
      >
        {cityTabs.map((tab) => {
          const selected = tab.id === selectedTabId

          return (
            <Pill
              key={tab.id}
              mr={0.5}
              variant="link"
              selected={selected}
              accessibilityState={{ selected }}
              onPress={() => onSelectTab(tab)}
            >
              {tab.text}
            </Pill>
          )
        })}
      </ScrollView>
    </Animated.View>
  )
}
