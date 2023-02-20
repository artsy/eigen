import { Flex, Spacer, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { Image } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { useScreenDimensions } from "shared/hooks"

const data = [
  {
    title: "Auctions",
    text: "Find the highest bidder, with our roster of auction houses in 190 countries.",
  },
  {
    title: "Private Sales",
    text: "We match your work to potential buyers in our global network of collectors.",
  },
  {
    title: "Online storefront",
    text: "List directly on Artsy.net, the world’s largest online art marketplace.",
  },
]

export const WaysWeSell: React.FC = () => {
  const space = useSpace()
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
        contentContainerStyle={{ marginLeft: space(2) }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) => (
          <Flex maxWidth={width / 1.2} mr={2} alignSelf="flex-end">
            <Image
              source={
                // because these images are suffixed @1x, @2x etc we cannot `require` outside Image
                // as this would break tests since in test env the module would not be found without
                // the suffixes included literally
                index === 0
                  ? require("images/ways-we-sell-auction.png")
                  : index === 1
                  ? require("images/ways-we-sell-private-sales.png")
                  : require("images/ways-we-sell-online-storefront.png")
              }
              style={{ maxWidth: width - space(6) }}
              resizeMode="cover"
            />

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
