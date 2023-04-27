import { Box, Flex, Spacer } from "@artsy/palette-mobile"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { ArtworkListImageBorder } from "app/Scenes/ArtworkLists/ArtworkListImageBorder"
import { ArtworkListNoImage } from "app/Scenes/ArtworkLists/components/ArtworkListNoImage"
import { FC } from "react"

const BORDER_SIZE = 1
interface FourUpImageLayoutProps {
  imageURLs: string[]
  cardWidth: number
}
interface RowImageProps {
  url: string | null
  rowImageWidth: number
}

export const FourUpImageLayout = ({ imageURLs, cardWidth }: FourUpImageLayoutProps) => {
  const rowImageWidth = cardWidth / 2 - BORDER_SIZE * 2
  return (
    <Box>
      <Flex flexDirection="row">
        <RowImage url={imageURLs[0]} rowImageWidth={rowImageWidth} />
        <Spacer x={`${BORDER_SIZE}px`} />
        <RowImage url={imageURLs[1]} rowImageWidth={rowImageWidth} />
      </Flex>

      <Spacer y={`${BORDER_SIZE}px`} />

      <Flex flexDirection="row">
        <RowImage url={imageURLs[2]} rowImageWidth={rowImageWidth} />
        <Spacer x={`${BORDER_SIZE}px`} />
        <RowImage url={imageURLs[3]} rowImageWidth={rowImageWidth} />
      </Flex>
    </Box>
  )
}

const RowImage: FC<RowImageProps> = ({ url, rowImageWidth }) => {
  if (!url) {
    return <ArtworkListNoImage width={rowImageWidth} height={rowImageWidth} />
  }

  return (
    <ArtworkListImageBorder>
      <OpaqueImageView imageURL={url} width={rowImageWidth} height={rowImageWidth} />
    </ArtworkListImageBorder>
  )
}
