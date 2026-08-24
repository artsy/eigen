import { Pill, useSpace } from "@artsy/palette-mobile"
import { BACK_BUTTON_SIZE_SIZE } from "app/Components/constants"
import { cityTabs } from "app/Scenes/City/cityTabs"
import { BucketResults } from "app/utils/cityGuide/bucketCityResults"
import { MapTab } from "app/utils/cityGuide/types"
import { FC, useEffect, useMemo } from "react"
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
  /** Live index of the City bottom sheet (-1 closed, 0 collapsed, 1 open) used to fade the pills as it's dragged. */
  bottomSheetAnimatedIndex: SharedValue<number>
  /** Used to figure out which tabs have results, so empty ones can be deprioritized. */
  bucketResults: BucketResults
}

const tabHasResults = (tab: MapTab, bucketResults: BucketResults) =>
  tab.getShows(bucketResults).length > 0 || tab.getFairs(bucketResults).length > 0

export const CityFilterPills: FC<CityFilterPillsProps> = ({
  selectedTabId,
  onSelectTab,
  bottomSheetAnimatedIndex,
  bucketResults,
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
