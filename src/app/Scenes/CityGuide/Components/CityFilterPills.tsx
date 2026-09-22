import { Pill, useSpace } from "@artsy/palette-mobile"
import { BACK_BUTTON_SIZE_SIZE } from "app/Components/constants"
import { BucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { cityTabs, tabHasResults } from "app/Scenes/CityGuide/utils/cityTabs"
import { MapTab } from "app/Scenes/CityGuide/utils/types"
import React, { useEffect, useMemo } from "react"
import { ScrollView } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface CityFilterPillsProps {
  selectedTabId: MapTab["id"]
  onSelectTab: (tab: MapTab) => void
  /**
   * Live index of a bottom sheet (-1 closed, 0 collapsed, 1 open) used to fade the pills as
   * it's dragged. Optional because the itineraries-flagged map never mounts a bottom sheet —
   * the pills must still render without one to fade against.
   */
  bottomSheetAnimatedIndex?: SharedValue<number>
  /** Used to figure out which tabs have results, so empty ones can be hidden. */
  bucketResults: BucketResults
}

export const CityFilterPills: React.FC<CityFilterPillsProps> = ({
  selectedTabId,
  onSelectTab,
  bottomSheetAnimatedIndex,
  bucketResults,
}) => {
  const space = useSpace()
  const safeAreaInsets = useSafeAreaInsets()

  // Tabs with no content aren't shown at all, since a disabled pill reads as barely-there
  // rather than intentionally hidden. "All" always renders, since it's the selection anchor
  // and its own content mirrors what's already on the map.
  const visibleTabs = useMemo(
    () => cityTabs.filter((tab) => tab.id === "all" || tabHasResults(tab, bucketResults)),
    [bucketResults]
  )

  // The drawer/pager can select a tab that has since dropped out of visibleTabs (e.g. it has
  // no results). Fall back to "All" rather than showing no pill highlighted.
  const effectiveSelectedTabId = visibleTabs.some((tab) => tab.id === selectedTabId)
    ? selectedTabId
    : "all"

  const mountOpacity = useSharedValue(0)

  useEffect(() => {
    mountOpacity.value = withTiming(1, { duration: 100 })
  }, [mountOpacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity:
      mountOpacity.value *
      (bottomSheetAnimatedIndex
        ? interpolate(bottomSheetAnimatedIndex.value, [0, 1], [1, 0], Extrapolation.CLAMP)
        : 1),
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
        {visibleTabs.map((tab) => {
          const selected = tab.id === effectiveSelectedTabId

          return (
            <Pill
              key={tab.id}
              testID={`city-filter-pill-${tab.id}`}
              mr={0.5}
              variant="link"
              color={selected ? "mono0" : "mono100"}
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
