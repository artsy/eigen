import { Box, Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { ArtworkListNoImage } from "app/Scenes/ArtworkLists/ArtworkListNoImage"

interface StackedImageLayoutProps {
  imageURLs: (string | null)[]
}

interface StackImageProps {
  url: string | null
  index: number
}

export const StackedImageLayout = ({ imageURLs }: StackedImageLayoutProps) => {
  return (
    <Flex flex={1}>
      <Box position="relative">
        {imageURLs.slice(0, 4).map((imageURL, index) => (
          <StackImage key={`stacked-image-${index}`} url={imageURL} index={index} />
        ))}
      </Box>
    </Flex>
  )
}

const StackImage = ({ url, index }: StackImageProps) => {
  const { width } = useScreenDimensions()
  const OFFSET_BY_INDEX = `${4 * index}px`
  const IMAGE_SIZE = width / 2 - 40
  return (
    <ArtworkListNoImage
      width={IMAGE_SIZE}
      height={IMAGE_SIZE}
      position="absolute"
      top={OFFSET_BY_INDEX}
      left={OFFSET_BY_INDEX}
    />
  )
}
