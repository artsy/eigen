import { Box } from "@artsy/palette-mobile"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { ArtworkListImageBorder } from "app/Scenes/ArtworkLists/ArtworkListImageBorder"
import { ArtworkListNoImage } from "app/Scenes/ArtworkLists/ArtworkListNoImage"

interface StackedImageLayoutProps {
  imageURLs: (string | null)[]
  imageSize: number
}

interface StackImageProps {
  url: string | null
  index: number
  imageSize: number
}

export const StackedImageLayout = ({ imageURLs, imageSize }: StackedImageLayoutProps) => {
  const stackedImageURLs = imageURLs.slice(0, 4)
  const imageOffset = stackedImageURLs.length * 4
  return (
    <Box>
      {stackedImageURLs.map((imageURL, index) => (
        <StackImage
          key={`stacked-image-${index}`}
          imageSize={imageSize - imageOffset}
          url={imageURL}
          index={index}
        />
      ))}
    </Box>
  )
}

const StackImage = ({ imageSize, url, index }: StackImageProps) => {
  const OFFSET_BY_INDEX = `${4 * index}px`

  if (!url) {
    return (
      <ArtworkListNoImage
        width={imageSize}
        height={imageSize}
        position="absolute"
        top={OFFSET_BY_INDEX}
        left={OFFSET_BY_INDEX}
      />
    )
  }

  return (
    <ArtworkListImageBorder position="absolute" top={OFFSET_BY_INDEX} left={OFFSET_BY_INDEX}>
      <OpaqueImageView imageURL={url} width={imageSize} height={imageSize} />
    </ArtworkListImageBorder>
  )
}
