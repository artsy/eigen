import { Box, Flex, Spacer } from "@artsy/palette-mobile"
import { ArtworkListImage } from "app/Scenes/ArtworkLists/components/ArtworkListImage"
import { ArtworkListNoImage } from "app/Scenes/ArtworkLists/components/ArtworkListNoImage"
import { FC } from "react"

const IMAGES_PER_ROW = 2
const IMAGE_OFFSET = 2

interface FourUpImageLayoutProps {
  imageURLs: (string | null)[]
  cardWidth: number
}
interface RowImageProps {
  url: string | null
  rowImageWidth: number
}

export const FourUpImageLayout = ({ imageURLs, cardWidth }: FourUpImageLayoutProps) => {
  const rowImageWidth = (cardWidth - IMAGE_OFFSET) / IMAGES_PER_ROW
  return (
    <Box>
      <Flex flexDirection="row">
        <RowImage url={imageURLs[0]} rowImageWidth={rowImageWidth} />
        <Spacer x={`${IMAGE_OFFSET}px`} />
        <RowImage url={imageURLs[1]} rowImageWidth={rowImageWidth} />
      </Flex>

      <Spacer y={`${IMAGE_OFFSET}px`} />

      <Flex flexDirection="row">
        <RowImage url={imageURLs[2]} rowImageWidth={rowImageWidth} />
        <Spacer x={`${IMAGE_OFFSET}px`} />
        <RowImage url={imageURLs[3]} rowImageWidth={rowImageWidth} />
      </Flex>
    </Box>
  )
}

const RowImage: FC<RowImageProps> = ({ url, rowImageWidth }) => {
  if (!url) {
    return <ArtworkListNoImage width={rowImageWidth} height={rowImageWidth} />
  }

  return <ArtworkListImage imageURL={url} imageWidth={rowImageWidth} />
}
