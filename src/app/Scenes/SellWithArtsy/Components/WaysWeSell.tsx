import { Spacer, useColor } from "@artsy/palette-mobile"
import { Flex, Text } from "palette"
import { Image } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { useScreenDimensions } from "shared/hooks"

const data = [
  {
    image: require("images/ways-we-sell-auction.png"),
    title: "Auctions",
    text: "Find the highest bidder, with our roster of auction houses in 190 countries.",
  },
  {
    image: require("images/ways-we-sell-private-sales.png"),
    title: "Private Sales",
    text: "We match your work to potential buyers in our global network of collectors.",
  },
  {
    image: require("images/ways-we-sell-online-storefront.png"),
    title: "Online storefront",
    text: "List directly on Artsy.net, the world’s largest online art marketplace.",
  },
]

export const WaysWeSell: React.FC = () => {
  const color = useColor()
  const { width } = useScreenDimensions()
  return (
    <Flex bg="black100" py={4}>
      <Flex mx={2}>
        <Text variant="lg" color={color("white100")} mb={1}>
          Ways we sell your work
        </Text>
        <Text variant="xs" color={color("white100")} mb={2}>
          We create a tailored strategy to find the optimal sales method for your artwork
        </Text>
      </Flex>
      <FlatList
        contentContainerStyle={{ marginLeft: 20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <Flex maxWidth={width / 1.2} mr={2} alignSelf="flex-end">
            <Image source={item.image} style={{ maxWidth: width - 60 }} resizeMode="cover" />

            <Text variant="md" color={color("white100")} mt={1}>
              {item.title}
            </Text>
            <Text variant="xs" color={color("white100")} mt={1}>
              {item.text}
            </Text>
          </Flex>
        )}
        keyExtractor={(item) => item.title}
        ListFooterComponent={() => <Spacer x={4} />}
      />
    </Flex>
  )
}
