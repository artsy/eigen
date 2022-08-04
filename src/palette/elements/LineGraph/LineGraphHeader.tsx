import { Flex, Text } from "palette"
import React from "react"
import { Dimensions } from "react-native"
import { ColoredDot, DEFAULT_DOT_COLOR } from "./ColoredDot"
import { LineChartData } from "./types"

type LineGraphHeaderProps = Omit<LineChartData["dataMeta"], "xHighlightIcon" | "yHighlightIcon">

export const LineGraphHeader: React.FC<LineGraphHeaderProps> = ({
  title,
  description,
  text,
  tintColor,
}) => {
  const maxWidth = Dimensions.get("window").width / 1.35
  return (
    <Flex maxWidth={maxWidth}>
      {!!title && (
        <Text fontWeight="500" variant="md">
          {title}
        </Text>
      )}
      {!!description && (
        <Flex flexDirection="row" alignItems="center">
          <ColoredDot color={tintColor ?? DEFAULT_DOT_COLOR} />
          <Text variant="xs" color="black60">
            {description}
          </Text>
        </Flex>
      )}
      {!!text && (
        <Text variant="xs" color="black60">
          {text}
        </Text>
      )}
    </Flex>
  )
}

// const { activeIndex, averagePrice, selectedMedium, totalLots, selectedDuration } =
//     LineGraphStore.useStoreState((state) => state)

//   const hasSelectedValue = activeIndex.year
//   // TODO: Move this logic into metaphysics
//   const getTotalLotsDisplay = () => {
//     // If the user has no value selected, we show the total number of lots
//     if (!hasSelectedValue) {
//       const thisMonth = DateTime.local().toLocaleString({ month: "short" })
//       const thisYear = DateTime.local().toLocaleString({ year: "numeric" })
//       switch (selectedDuration) {
//         case Duration.Last3Years:
//           // @example "26 lots in the last 3 years (Jun 2019 - Jun 2022)"
//           return `${totalLots} lots in the last 3 years (${thisMonth} ${
//             Number(thisYear) - 3
//           } - ${thisMonth} ${thisYear})`

//         case Duration.Last8Years:
//           // @example "26 lots in the last 3 years (Jun 2016 - Jun 2022)"
//           return `${totalLots} lots in the last 8 years (${thisMonth} ${
//             Number(thisYear) - 6
//           } - ${thisMonth} ${thisYear})`

//         default:
//           assertNever(selectedDuration)
//       }
//     }

//     return `${activeIndex.numberOfLots} ${pluralise("lot", activeIndex.numberOfLots || 0)} in ${
//       activeIndex.year
//     }`
//   }

//   return (
//     <Flex>
//       <Text fontWeight="500" variant="md">
//         {hasSelectedValue ? activeIndex.averagePrice : averagePrice}
//       </Text>
//       <Flex flexDirection="row" alignItems="center">
//         <ColoredDot selectedMedium={selectedMedium} />
//         <Text variant="xs" color="black60">
//           {selectedMedium}
//         </Text>
//       </Flex>
//       <Text variant="xs" color="black60">
//         {getTotalLotsDisplay()}
//       </Text>
//     </Flex>
//   )
