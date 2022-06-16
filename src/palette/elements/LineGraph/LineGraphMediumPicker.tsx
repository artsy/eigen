import { Flex, Text, Touchable, useColor, useSpace } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
// @ts-ignore
import { ColoredDot } from "./ColoredDot"
import { LineGraphStore } from "./LineGraphStore"

export const LineGraphMediumPicker = () => {
  const availableMediums = LineGraphStore.useStoreState((state) => state.availableMediums)

  return (
    <FlatList
      data={["All"].concat(availableMediums)}
      renderItem={({ item: medium, index }) => <MediumPill medium={medium} key={index} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      testID="line-graph-medium-picker"
    />
  )
}

export const MediumPill = ({ medium }: { medium: string }) => {
  const selectedMedium = LineGraphStore.useStoreState((state) => state.selectedMedium)
  const setSelectedMedium = LineGraphStore.useStoreActions((actions) => actions.setSelectedMedium)

  const color = useColor()
  const space = useSpace()

  const isEnabled = selectedMedium === medium
  const handlePress = () => {
    setSelectedMedium(medium)
  }

  return (
    <Touchable
      style={{
        height: 30,
        flexDirection: "row",
        borderRadius: 50,
        borderColor: isEnabled ? color("black100") : color("black60"),
        borderWidth: 1,
        paddingHorizontal: space(1),
        marginRight: space(0.5),
      }}
      onPress={handlePress}
      testID="line-graph-medium-picker-pill"
      haptic
    >
      <Flex flexDirection="row" justifyContent="center" alignItems="center">
        <ColoredDot selectedMedium={medium} disabled={!isEnabled} />
        <Text color={isEnabled ? color("black100") : color("black60")} variant="xs" my={0.5}>
          {medium}
        </Text>
      </Flex>
    </Touchable>
  )
}
