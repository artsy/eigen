import { Flex, Spacer, Text, Touchable } from "palette"
import { useColor } from "palette/hooks"

// export const LineGraphDurationPicker = () => {
//   const { selectedDuration } = LineGraphStore.useStoreState((state) => state)
//   const setSelectedDuration = LineGraphStore.useStoreActions(
//     (actions) => actions.setSelectedDuration
//   )
//   return (
//     <Flex flexDirection="row" justifyContent="center">
//       <Touchable
//         haptic="impactMedium"
//         onPress={() => setSelectedDuration(Duration.Last3Years)}
//         testID="three-years-button"
//         accessibilityLabel="Show Average Sale Price for the last 3 years"
//       >
//         <Text variant="md" fontWeight={selectedDuration === Duration.Last3Years ? "500" : "400"}>
//           3 yrs
//         </Text>
//       </Touchable>
//       <Spacer width={70} />
//       <Touchable
//         haptic="impactMedium"
//         onPress={() => setSelectedDuration(Duration.Last8Years)}
//         testID="eight-years-button"
//         accessibilityLabel="Show Average Sale Price for the last 8 years"
//       >
//         <Text variant="md" fontWeight={selectedDuration === Duration.Last8Years ? "500" : "400"}>
//           8 yrs
//         </Text>
//       </Touchable>
//     </Flex>
//   )
// }

export interface LineGraphBandProps {
  bands: Array<{ name: string; accessibilityLabel?: string }>
  onBandSelected: (band: string) => void
  selectedBand?: string
}

export const LineGraphBands: React.FC<LineGraphBandProps> = ({
  bands,
  onBandSelected,
  selectedBand,
}) => {
  const color = useColor()
  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      {bands.map((band, index) => (
        <Flex key={band.name + index}>
          <Touchable
            haptic="impactMedium"
            onPress={() => onBandSelected(band.name)}
            testID="band"
            accessibilityLabel={band.accessibilityLabel}
          >
            <Text
              variant="xs"
              color={!(selectedBand === band.name) ? color("black60") : undefined}
              fontWeight={selectedBand === band.name ? "500" : undefined}
            >
              {band.name}
            </Text>
          </Touchable>
          <Spacer mx={2} my={1} />
        </Flex>
      ))}
    </Flex>
  )
}
