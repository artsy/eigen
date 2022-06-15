import { pluralise } from "app/utils/pluralise"
import { DateTime } from "luxon"
import { Flex, Text } from "palette"
import React from "react"
import { Duration, LineGraphStore } from "./LineGraphStore"

// tslint:disable-next-line:no-empty-interface
interface LineGraphIndexProps {}

export const LineGraphIndex: React.FC<LineGraphIndexProps> = () => {
  const { activeIndex, averagePrice, selectedMedium, totalLots, selectedDuration } =
    LineGraphStore.useStoreState((state) => state)

  const hasSelectedValue = activeIndex.year
  // TODO: Move this logic into metaphysics
  const getTotalLotsDisplay = () => {
    // If the user has no value selected, we show the total number of lots
    if (!hasSelectedValue) {
      const thisMonth = DateTime.local().toLocaleString({ month: "short" })
      const thisYear = DateTime.local().toLocaleString({ year: "numeric" })
      switch (selectedDuration) {
        case Duration.Last3Years:
          // @example "26 lots in the last 3 years (Jun 2019 - Jun 2022)"
          return `${totalLots} lots in the last 3 years (${thisMonth} ${
            Number(thisYear) - 3
          } - ${thisMonth} ${thisYear})`

        case Duration.Last8Years:
          // @example "26 lots in the last 3 years (Jun 2016 - Jun 2022)"
          return `${totalLots} lots in the last 8 years (${thisMonth} ${
            Number(thisYear) - 6
          } - ${thisMonth} ${thisYear})`

        default:
          assertNever(selectedDuration)
      }
    }

    return `${activeIndex.numberOfLots} ${pluralise("lot", activeIndex.numberOfLots || 0)} in ${
      activeIndex.year
    }`
  }

  return (
    <Flex>
      <Text fontWeight="500" variant="md">
        {hasSelectedValue ? activeIndex.averagePrice : averagePrice}
      </Text>
      <Flex flexDirection="row" alignItems="center">
        <ColoredDot color="red" />
        <Text variant="xs" color="black60">
          {selectedMedium || "All"}
        </Text>
      </Flex>
      <Text variant="xs" color="black60">
        {getTotalLotsDisplay()}
      </Text>
    </Flex>
  )
}

const DOT_DIAMETER = 8

const ColoredDot = ({ color }: { color: string }) => (
  <Flex
    backgroundColor={color}
    width={DOT_DIAMETER}
    height={DOT_DIAMETER}
    borderRadius={DOT_DIAMETER / 2}
    marginTop="2px"
    marginRight={0.5}
  />
)
