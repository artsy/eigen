import { Box } from "@artsy/palette-mobile"
import { ArtworkListImage } from "app/Scenes/ArtworkLists/components/ArtworkListImage"
import { ArtworkListNoImage } from "app/Scenes/ArtworkLists/components/ArtworkListNoImage"
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
    <ArtworkListImage
      imageURL={url}
      imageWidth={cardWidth}
      position="absolute"
      top={OFFSET_BY_INDEX}
      left={OFFSET_BY_INDEX}
    />
  )
}
