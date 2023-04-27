import { Box } from "@artsy/palette-mobile"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { ArtworkListImageBorder } from "app/Scenes/ArtworkLists/ArtworkListImageBorder"
import { ArtworkListNoImage } from "app/Scenes/ArtworkLists/components/ArtworkListNoImage"

interface StackedImageLayoutProps {
  imageURLs: (string | null)[]
  cardWidth: number
}

interface StackImageProps {
  url: string | null
  index: number
  cardWidth: number
}

const IMAGE_OFFSET = 14

export const StackedImageLayout = ({ imageURLs, cardWidth }: StackedImageLayoutProps) => {
  // The length of stackedImageURLs will always be 4.
  // If there are fewer than 4 imageURLs, the remaining elements will be filled with empty strings.
  const stackedImageURLs = [
    ...(imageURLs.slice(0, 4) || []),
    ...(imageURLs.length > 0 ? Array(4 - Math.min(imageURLs.length, 4)).fill("") : []),
  ]
  return (
    <Box>
      {stackedImageURLs.reverse().map((imageURL, index) => (
        <StackImage
          key={`stacked-image-${index}`}
          cardWidth={cardWidth - IMAGE_OFFSET}
          url={imageURL}
          index={index}
        />
      ))}
    </Box>
  )
}

const StackImage = ({ cardWidth, url, index }: StackImageProps) => {
  const OFFSET_BY_INDEX = `${4 * index}px`

  if (!url) {
    return (
      <ArtworkListNoImage
        width={cardWidth}
        height={cardWidth}
        position="absolute"
        top={OFFSET_BY_INDEX}
        left={OFFSET_BY_INDEX}
      />
    )
  }

  return (
    <ArtworkListImageBorder position="absolute" top={OFFSET_BY_INDEX} left={OFFSET_BY_INDEX}>
      <OpaqueImageView imageURL={url} width={cardWidth} height={cardWidth} />
    </ArtworkListImageBorder>
  )
}
