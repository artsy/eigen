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
  /** Used to figure out which tabs have results, so empty ones can be deprioritized. */
  bucketResults: BucketResults
  /**
   * Reports the row's rendered height, so a caller drawing something else below it (e.g. the
   * map's scale bar on Android) can offset around it instead of guessing a fixed value.
   */
  onLayout?: (height: number) => void
}

export const CityFilterPills: React.FC<CityFilterPillsProps> = ({
  selectedTabId,
  onSelectTab,
  bottomSheetAnimatedIndex,
  bucketResults,
  onLayout,
}) => {
  const space = useSpace()
  const safeAreaInsets = useSafeAreaInsets()

  // Tabs with results lead the list; empty ones are pushed to the end and shown disabled.
  const orderedTabs = useMemo(() => {
    const withResults: MapTab[] = []
    const withoutResults: MapTab[] = []

    cityTabs.forEach((tab) => {
      if (tabHasResults(tab, bucketResults)) {
        withResults.push(tab)
      } else {
        withoutResults.push(tab)
      }
    })

    return [...withResults, ...withoutResults]
  }, [bucketResults])

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
      onLayout={(event) => onLayout?.(event.nativeEvent.layout.height)}
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
        {orderedTabs.map((tab) => {
          const selected = tab.id === selectedTabId
          const disabled = !tabHasResults(tab, bucketResults)

          return (
            <Pill
              key={tab.id}
              testID={`city-filter-pill-${tab.id}`}
              mr={0.5}
              variant="link"
              selected={selected}
              disabled={disabled}
              accessibilityState={{ selected, disabled }}
              onPress={disabled ? undefined : () => onSelectTab(tab)}
            >
              {tab.text}
            </Pill>
          )
        })}
      </ScrollView>
    </Animated.View>
  )
}
