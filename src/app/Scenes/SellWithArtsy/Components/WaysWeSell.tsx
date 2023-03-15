import { Flex, Spacer, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { useExtraLargeWidth } from "app/Components/ArtworkRail/useExtraLargeWidth"
import { Image } from "react-native"
import { FlatList } from "react-native-gesture-handler"

const data = [
  {
    title: "Auctions",
    text: "Our curated auctions provide you with multiple opportunities to reach the widest audience and successfully achieve your artwork’s full potential.",
  },
  {
    title: "Private Sales",
    text: "We offer tailored and discreet sales arrangements for our collectors’ highest value and most sensitive artworks.",
  },
  {
    title: "Online storefront",
    text: "When your work is listed directly on Artsy.net—the world’s largest online art marketplace—it reaches over 3 million art lovers.",
  },
]

export const WaysWeSell: React.FC = () => {
  const space = useSpace()
  const color = useColor()
  const maxImageWidth = useExtraLargeWidth()
  return (
    <Flex bg="black100" py={4}>
      <Flex mx={2}>
        <Text variant="lg" color={color("white100")} mb={1}>
          A sales strategy tailored to your artwork
        </Text>
        <Text variant="xs" color={color("white100")} mb={2}>
          A dedicated specialist works with you to select the best sales option for your artwork.
        </Text>
      </Flex>
      <FlatList
        contentContainerStyle={{ marginLeft: space(2) }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) => (
          <Flex maxWidth={maxImageWidth} mr={2} alignSelf="flex-end">
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
              style={{ maxWidth: maxImageWidth }}
              resizeMode="cover"
            />

            <Text variant="md" color={color("white100")} mt={1}>
              {item.title}
            </Text>
            <Text variant="xs" color={color("white100")} mt={1} maxWidth>
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
