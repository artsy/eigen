import { Flex, Spacer, Text, useColor } from "palette"
import { FlatList } from "react-native"
import { CareerHighlightsCard } from "./CareerHighlightCard"

const types = [
  "SOLO_SHOW",
  "GROUP_SHOW",
  "COLLECTED",
  "REVIEWED",
  "BIENNIAL",
  "ACTIVE_SECONDARY_MARKET",
] as const

const data = [...Array(5)].map((x, i) => {
  const num = Math.ceil(Math.random() * 24)
  return {
    artists: num,
    type: types[i],
    isNew: !!(num % 2),
  }
})

export const CareerHighlightsRail = () => {
  const color = useColor()

  return (
    <Flex px={2} py={1} mb={2} backgroundColor={color("black5")}>
      <FlatList
        testID="career-highlight-cards-flatlist"
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Spacer mx={1} />}
        ListFooterComponent={() => <Text ml={2}>Yee</Text>}
        style={{ overflow: "visible" }}
        data={data}
        renderItem={({ item }) => {
          return (
            <CareerHighlightsCard artistsNum={item.artists} type={item.type} isNew={item.isNew} />
          )
        }}
      />
    </Flex>
  )
}
