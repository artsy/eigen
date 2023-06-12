import { Box, Flex, Spacer } from "@artsy/palette-mobile"
import { ArtworkListImage } from "app/Components/ArtworkLists/components/ArtworkListImage"

const IMAGES_PER_ROW = 2
const IMAGE_OFFSET = 2

interface FourUpImageLayoutProps {
  imageURLs: (string | null)[]
  cardWidth: number
}

export const FourUpImageLayout = ({ imageURLs, cardWidth }: FourUpImageLayoutProps) => {
  const rowImageWidth = (cardWidth - IMAGE_OFFSET) / IMAGES_PER_ROW
  return (
    <Box>
      <Flex flexDirection="row">
        <ArtworkListImage imageURL={imageURLs[0]} size={rowImageWidth} />
        <Spacer x={`${IMAGE_OFFSET}px`} />
        <ArtworkListImage imageURL={imageURLs[1]} size={rowImageWidth} />
      </Flex>

      <Spacer y={`${IMAGE_OFFSET}px`} />

      <Flex flexDirection="row">
        <ArtworkListImage imageURL={imageURLs[2]} size={rowImageWidth} />
        <Spacer x={`${IMAGE_OFFSET}px`} />
        <ArtworkListImage imageURL={imageURLs[3]} size={rowImageWidth} />
      </Flex>
    </Box>
  )
}
