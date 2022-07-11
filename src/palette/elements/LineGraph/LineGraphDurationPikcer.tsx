import { Flex, Spacer, Text, Touchable } from "palette"
import { Duration, LineGraphStore } from "./LineGraphStore"

export const LineGraphDurationPicker = () => {
  const { selectedDuration } = LineGraphStore.useStoreState((state) => state)
  const setSelectedDuration = LineGraphStore.useStoreActions(
    (actions) => actions.setSelectedDuration
  )
  return (
    <Flex flexDirection="row" justifyContent="center">
      <Touchable
        haptic="impactMedium"
        onPress={() => setSelectedDuration(Duration.Last3Years)}
        testID="three-years-button"
        accessibilityLabel="Show Average Sale Price for the last 3 years"
      >
        <Text variant="md" fontWeight={selectedDuration === Duration.Last3Years ? "500" : "400"}>
          3 yrs
        </Text>
      </Touchable>
      <Spacer width={70} />
      <Touchable
        haptic="impactMedium"
        onPress={() => setSelectedDuration(Duration.Last8Years)}
        testID="eight-years-button"
        accessibilityLabel="Show Average Sale Price for the last 8 years"
      >
        <Text variant="md" fontWeight={selectedDuration === Duration.Last8Years ? "500" : "400"}>
          8 yrs
        </Text>
      </Touchable>
    </Flex>
  )
}
