import { Spacer, Flex, Box, useSpace, Text, Join, Pill } from "@artsy/palette-mobile"
import { DEFAULT_PRICE_RANGE as USER_PREFERRED_DEFAULT_PRICE_RANGE } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import {
  MAX_SHOWN_RECENT_PRICE_RANGES,
  useRecentPriceRanges,
} from "app/store/RecentPriceRangesModel"
import { useRef } from "react"
import { Platform, ScrollView, TouchableOpacity } from "react-native"
import { parsePriceRange, parsePriceRangeLabel, PriceRange } from "./Filters/helpers"

interface RecentPriceRangeEntity {
  value: string
  isCollectorProfileSources: boolean
}

interface RecentPriceRangesListProps {
  selectedRange: PriceRange
  ranges: RecentPriceRangeEntity[]
  onSelected: (priceRange: RecentPriceRangeEntity) => void
}

type RecentPriceRangesProps = Omit<RecentPriceRangesListProps, "ranges">

export const RecentPriceRanges: React.FC<RecentPriceRangesProps> = ({
  selectedRange,
  onSelected,
}) => {
  const priceRanges = usePriceRanges()
  const space = useSpace()
  const recentPriceRangeScrollRef = useRef<ScrollView>(null)
  const isEmptyPriceRanges = priceRanges.length === 0
  const hasCustomPriceRange = priceRanges.some((range) => !range.isCollectorProfileSources)

  const handleClearRecentPriceRanges = () => {
    GlobalStore.actions.recentPriceRanges.clearAllPriceRanges()

    if (Platform.OS === "android" && recentPriceRangeScrollRef.current) {
      recentPriceRangeScrollRef.current.scrollTo({ x: 0, animated: false })
    }
  }

  return (
    <>
      <Flex mx={2} flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="sm">Recent price ranges</Text>

        {!isEmptyPriceRanges && !!hasCustomPriceRange && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Clear price ranges"
            onPress={handleClearRecentPriceRanges}
            hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
          >
            <Text variant="sm" style={{ textDecorationLine: "underline" }}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </Flex>

      <Spacer y={2} />

      {isEmptyPriceRanges ? (
        <EmptyState />
      ) : (
        <RecentPriceRangesList
          ranges={priceRanges}
          selectedRange={selectedRange}
          onSelected={onSelected}
        />
      )}
    </>
  )
}

const EmptyState = () => {
  return (
    <Box bg="mono5" p={2} mx={2}>
      <Text variant="sm-display" color="mono60" textAlign="center">
        Your recent price ranges will show here
      </Text>
    </Box>
  )
}

const RecentPriceRangesList: React.FC<RecentPriceRangesListProps> = ({
  selectedRange,
  onSelected,
}) => {
  const priceRanges = usePriceRanges()
  const priceRangesRef = useRef(priceRanges)
  const space = useSpace()
  const recentPriceRangeScrollRef = useRef<ScrollView>(null)

  const isSelectedPriceRange = (price: string) => {
    const [min, max] = parsePriceRange(price)
    const [selectedMin, selectedMax] = selectedRange

    return min === selectedMin && max === selectedMax
  }

  return (
    <ScrollView
      ref={recentPriceRangeScrollRef}
      horizontal
      contentContainerStyle={{ paddingHorizontal: space(2) }}
      showsHorizontalScrollIndicator={false}
    >
      <Flex flexDirection="row">
        <Join separator={<Spacer x={1} />}>
          {priceRangesRef.current.map((recentPrice) => {
            const { value } = recentPrice
            const [min, max] = parsePriceRange(value)
            const label = parsePriceRangeLabel(min, max)

            return (
              <Pill
                key={value}
                accessibilityLabel="Price range pill"
                selected={isSelectedPriceRange(value)}
                onPress={() => onSelected(recentPrice)}
              >
                {label}
              </Pill>
            )
          })}
        </Join>
      </Flex>
    </ScrollView>
  )
}

const usePriceRanges = (): RecentPriceRangeEntity[] => {
  let recentPriceRanges = useRecentPriceRanges()

  const userPreferredPriceRange = GlobalStore.useAppState((state) => state.userPrefs.priceRange)

  if (userPreferredPriceRange !== USER_PREFERRED_DEFAULT_PRICE_RANGE) {
    const slicedRecentPriceRanges = recentPriceRanges.slice(0, MAX_SHOWN_RECENT_PRICE_RANGES - 1)

    // Remove duplicate price range that matches collector profile-sourced price
    const filtered = slicedRecentPriceRanges.filter((priceRange) => {
      return priceRange !== userPreferredPriceRange
    })

    recentPriceRanges = [...filtered, userPreferredPriceRange]
  }

  recentPriceRanges = recentPriceRanges.filter(
    (value) => value !== USER_PREFERRED_DEFAULT_PRICE_RANGE
  )

  return recentPriceRanges.map((value) => ({
    value,
    isCollectorProfileSources: value === userPreferredPriceRange,
  }))
}
