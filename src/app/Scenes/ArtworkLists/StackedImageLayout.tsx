import { Box } from "@artsy/palette-mobile"
import { ArtworkListImage } from "app/Components/ArtworkLists/components/ArtworkListImage"
import { times } from "lodash"

interface StackedImageLayoutProps {
  imageURLs: (string | null)[]
  cardWidth: number
}

interface StackImageProps {
  url: string | null
  index: number
  cardWidth: number
}

const IMAGE_OFFSET = 9

export const StackedImageLayout = ({ imageURLs, cardWidth }: StackedImageLayoutProps) => {
  const stackedImageURLs = times(4).map((index) => {
    return imageURLs[index] ?? null
  })

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
  const OFFSET_BY_INDEX = `${(IMAGE_OFFSET / 3) * index}px`

  return (
    <ArtworkListImage
      size={cardWidth}
      imageURL={url}
      position="absolute"
      top={OFFSET_BY_INDEX}
      left={OFFSET_BY_INDEX}
    />
  )
}
