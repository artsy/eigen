import { PlaceholderBox, PlaceholderRaggedText, PlaceholderText } from "app/utils/placeholders"
import { Flex, Separator, Spacer, useSpace } from "palette"
import { View } from "react-native"
import { useImagePlaceholderDimensions } from "../helpers"

export const AboveTheFoldPlaceholder: React.FC<{ artworkID?: string }> = ({ artworkID }) => {
  const space = useSpace()

  const { width, height } = useImagePlaceholderDimensions(artworkID)

  return (
    <Flex py={2}>
      {/* Artwork thumbnail */}
      <Flex mx="auto">
        <PlaceholderBox width={width} height={height} />
      </Flex>

      <Flex px={2} flex={1}>
        <Spacer mb={2} />
        {/* save/share buttons */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <PlaceholderText width={50} marginHorizontal={space(1)} />
          <PlaceholderText width={50} marginHorizontal={space(1)} />
          <PlaceholderText width={50} marginHorizontal={space(1)} />
        </View>
        <Spacer mb={2} />
        {/* Artist name */}
        <PlaceholderText width={100} />
        <Spacer mb={2} />
        {/* Artwork tombstone details */}
        <View style={{ width: 130 }}>
          <PlaceholderRaggedText numLines={4} />
        </View>
        <Spacer mb={3} />
        {/* more junk */}
        <Separator />
        <Spacer mb={3} />
        <PlaceholderRaggedText numLines={3} />
        <Spacer mb={2} />
        {/* commerce button */}
        <PlaceholderBox height={60} />
      </Flex>
    </Flex>
  )
}
