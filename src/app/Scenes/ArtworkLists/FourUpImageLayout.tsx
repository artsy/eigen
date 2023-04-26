import { Box, Flex, Spacer } from "@artsy/palette-mobile"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { ArtworkListImageBorder } from "app/Scenes/ArtworkLists/ArtworkListImageBorder"
import { ArtworkListNoImage } from "app/Scenes/ArtworkLists/ArtworkListNoImage"
import { FC } from "react"

const IMAGE_OFFSET = 4

interface FourUpImageLayoutProps {
  imageURLs: string[]
  imageSize: number
}
interface RowImageProps {
  url: string | null
  imageSize: number
}

export const FourUpImageLayout = ({ imageURLs, imageSize }: FourUpImageLayoutProps) => {
  const rowImageSize = imageSize / 2
  const calculatedImageSize = rowImageSize - IMAGE_OFFSET
  return (
    <Box>
      <Flex flexDirection="row">
        <RowImage url={imageURLs[0]} imageSize={calculatedImageSize} />
        <Spacer x={`${IMAGE_OFFSET / 2}px`} />
        <RowImage url={imageURLs[1]} imageSize={calculatedImageSize} />
      </Flex>

      <Spacer y={`${IMAGE_OFFSET / 2}px`} />

      <Flex flexDirection="row">
        <RowImage url={imageURLs[2]} imageSize={calculatedImageSize} />
        <Spacer x={`${IMAGE_OFFSET / 2}px`} />
        <RowImage url={imageURLs[3]} imageSize={calculatedImageSize} />
      </Flex>
    </Box>
  )
}

const RowImage: FC<RowImageProps> = ({ url, imageSize }) => {
  if (!url) {
    return <ArtworkListNoImage width={imageSize} height={imageSize} />
  }

  return (
    <ArtworkListImageBorder>
      <OpaqueImageView imageURL={url} width={imageSize} height={imageSize} />
    </ArtworkListImageBorder>
  )
}
