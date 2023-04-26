import { Box, Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { ArtworkListNoImage } from "app/Scenes/ArtworkLists/ArtworkListNoImage"
import { FC } from "react"

const IMAGE_OFFSET = "2px"
const ROW_IMAGE_COUNT = 4

interface RowImageProps {
  url: string | null
}

export const FourUpImageLayout = () => {
  return (
    <Box>
      <Flex flexDirection="row">
        <RowImage url="" />
        <Spacer x={IMAGE_OFFSET} />
        <RowImage url="" />
      </Flex>

      <Spacer y={IMAGE_OFFSET} />

      <Flex flexDirection="row">
        <RowImage url="" />
        <Spacer x={IMAGE_OFFSET} />
        <RowImage url="" />
      </Flex>
      <Spacer y={1} />
      <Text variant="xs">Saved Artworks</Text>
      <Text variant="xs" color="black60">
        0 Artworks
      </Text>
    </Box>
  )
}

const RowImage: FC<RowImageProps> = () => {
  const { width } = useScreenDimensions()
  const IMAGE_SIZE = width / ROW_IMAGE_COUNT - ROW_IMAGE_COUNT * ROW_IMAGE_COUNT
  return <ArtworkListNoImage width={IMAGE_SIZE} height={IMAGE_SIZE} />
}
