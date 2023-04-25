import { Flex, Spacer, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { useExtraLargeWidth } from "app/Components/ArtworkRail/useExtraLargeWidth"
import { Image, ImageSourcePropType } from "react-native"
import { FlatList } from "react-native-gesture-handler"

const IMAGE_WIDTH = 600

const data: Array<{
  title: string
  text: string
  imageSource: ImageSourcePropType
  height: number
  width: number
}> = [
  {
    title: "Auctions",
    text: "Our curated auctions provide you with multiple opportunities to reach the widest audience and successfully achieve your artwork’s full potential.",
    imageSource: require("images/ways-we-sell-auction.webp"),
    width: IMAGE_WIDTH,
    height: 415,
  },
  {
    title: "Private Sales",
    text: "We offer tailored and discreet sales arrangements for our collectors’ highest value and most sensitive artworks.",
    imageSource: require("images/ways-we-sell-private-sales.webp"),
    width: IMAGE_WIDTH,
    height: 597,
  },
  {
    title: "Online storefront",
    text: "When your work is listed directly on Artsy.net—the world’s largest online art marketplace—it reaches over 3 million art lovers.",
    imageSource: require("images/ways-we-sell-online-storefront.webp"),
    width: IMAGE_WIDTH,
    height: 344,
  },
]

export const WaysWeSell: React.FC = () => {
  const space = useSpace()
  const color = useColor()

  const maxImageWidth = useExtraLargeWidth()

  const maxImageContainerHeight =
    (maxImageWidth * Math.max(...data.map((i) => i.height))) / IMAGE_WIDTH

  return (
    <Flex bg="black100" py={4}>
      <Flex mx={2}>
        <Text variant="lg-display" color={color("white100")} mb={1}>
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
        renderItem={({ item }) => {
          const imageAspectRatio = item.height / item.width

          const imageHeight = maxImageWidth * imageAspectRatio
          return (
            <Flex maxWidth={maxImageWidth} mr={2} alignSelf="flex-start">
              <Flex height={maxImageContainerHeight} justifyContent="flex-end">
                <Image
                  source={item.imageSource}
                  style={{ width: maxImageWidth, height: imageHeight }}
                  resizeMode="cover"
                />
              </Flex>

              <Flex maxWidth={maxImageWidth}>
                <Text variant="md" color={color("white100")} mt={1}>
                  {item.title}
                </Text>
                <Text variant="xs" color={color("white100")} mt={1} maxWidth>
                  {item.text}
                </Text>
              </Flex>
            </Flex>
          )
        }}
        keyExtractor={(item) => item.title}
        ListFooterComponent={() => <Spacer x={4} />}
      />
    </Flex>
  )
}
