import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { Flex, Separator, Spacer, useSpace } from "palette"
import { useImagePlaceholderDimensions } from "../helpers"

export const AboveTheFoldPlaceholder: React.FC<{ artworkID?: string }> = ({ artworkID }) => {
  const space = useSpace()

  const { width, height } = useImagePlaceholderDimensions(artworkID)

  return (
    <Flex pt={5} pb={2}>
      {/* Artwork thumbnail */}
      <Flex mx="auto">
        <PlaceholderBox width={width} height={height} />
      </Flex>
      <Spacer mb={2} />

      {/* Content */}
      <Flex px={2} flex={1}>
        {/* save/share buttons */}
        <Flex flexDirection="row" justifyContent="center" alignItems="center" height={30}>
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
        </Flex>
        <Spacer mb={4} />

        {/* Artist name */}
        <PlaceholderText width={100} height={26} />

        {/* Artwork tombstone details */}
        <PlaceholderText width={250} height={26} marginBottom={0} />

        {/* more junk */}
        <Spacer mb={3} />
        <Separator />
        <Spacer mb={3} />

        {/* Artwork price */}
        <PlaceholderText width={100} height={36} />
        <Spacer mb={1} />

        {/* commerce button */}
        <PlaceholderBox height={50} />
      </Flex>
    </Flex>
  )
}
