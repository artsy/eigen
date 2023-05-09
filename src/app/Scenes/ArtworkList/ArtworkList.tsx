import { Flex, MoreIcon, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { AnimatableCustomHeader } from "app/Components/AnimatableHeader/AnimatableCustomHeader"
import { AnimatableHeaderFlatList } from "app/Components/AnimatableHeader/AnimatableHeaderFlatList"
import { AnimatableHeaderProvider } from "app/Components/AnimatableHeader/AnimatableHeaderProvider"

export const ArtworkList = () => {
  const DATA = [
    {
      title: "Main dishes",
      data: ["Pizza", "Burger", "Risotto"],
    },
    {
      title: "Sides",
      data: ["French Fries", "Onion Rings", "Fried Shrimps"],
    },
    {
      title: "Drinks",
      data: ["Water", "Coke", "Beer"],
    },
    {
      title: "Desserts",
      data: ["Cheese Cake", "Ice Cream"],
    },
    {
      title: "Main disjhjhes",
      data: ["Pizza", "Burger", "Risotto"],
    },
    {
      title: "Sidejhjs",
      data: ["French Fries", "Onion Rings", "Fried Shrimps"],
    },
    {
      title: "Drinjhjks",
      data: ["Water", "Coke", "Beer"],
    },
    {
      title: "Desjhjhserts",
      data: ["Cheese Cake", "Ice Cream"],
    },
  ]

  const rightButton = () => (
    <Flex flex={1} alignItems="flex-end">
      <Touchable onPress={() => console.log("Yess")}>
        <MoreIcon fill="black100" width={24} height={24} mt="2px" />
      </Touchable>
    </Flex>
  )

  return (
    <AnimatableHeaderProvider>
      <Flex flex={1}>
        <AnimatableCustomHeader title="Custom list A" rightButton={rightButton()} />
        <AnimatableHeaderFlatList
          keyExtractor={(_item, index) => String(index)}
          data={DATA}
          ListHeaderComponent={<Separator borderColor="black10" mt={1} />}
          style={{ flexGrow: 1 }}
          renderItem={({ item }) => {
            return (
              <Flex px={2} mb={6} flexDirection="row">
                <Text>{item.title}</Text>
              </Flex>
            )
          }}
        />
      </Flex>
    </AnimatableHeaderProvider>
  )
}
