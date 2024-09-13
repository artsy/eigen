import { Box, Flex } from "@artsy/palette-mobile"
import { Image } from "react-native"

interface FiveUpImageLayoutProps {
  imageURLs: string[]
  height?: number
}

const DEFAULT_HEIGHT = 480

export const GAP = 3

const getLargeImageDimensions = ({
  height: heightProp,
  width: widthProp,
}: {
  height: number
  width: number
}) => {
  return { width: (2 / 3) * widthProp, height: (2 / 3) * heightProp }
}

const getSmallImageDimensions = ({
  height: heightProp,
  width: widthProp,
}: {
  height: number
  width: number
}) => {
  return { width: (1 / 3) * widthProp, height: (1 / 3) * heightProp - GAP / 2 }
}

const getHorizontalImageDimensions = ({
  height: heightProp,
  width: widthProp,
}: {
  height: number
  width: number
}) => {
  return { width: (2 / 3) * widthProp, height: (1 / 3) * heightProp - GAP / 2 }
}

export const DEFAULT_LARGE_IMAGE_DIMENSIONS = getLargeImageDimensions({
  height: DEFAULT_HEIGHT - GAP,
  width: 0.65 * DEFAULT_HEIGHT - GAP,
})

export const DEFAULT_SMALL_IMAGE_DIMENSIONS = getSmallImageDimensions({
  height: DEFAULT_HEIGHT,
  width: 0.65 * DEFAULT_HEIGHT - GAP,
})

export const DEFAULT_HORIZONTAL_IMAGE_DIMENSIONS = getHorizontalImageDimensions({
  height: DEFAULT_HEIGHT - GAP,
  width: 0.65 * DEFAULT_HEIGHT - GAP,
})

export const FiveUpImageLayout: React.FC<FiveUpImageLayoutProps> = ({
  imageURLs,
  height: heightProp = DEFAULT_HEIGHT,
}) => {
  // Ensure we have an array of exactly 5 URLs, copying over the last image if we have less than 5
  const artworkImageURLs = backfillImageURLs(imageURLs, 5)

  const height = heightProp - GAP
  const width = 0.65 * height - GAP

  const largeImageDimensions = getLargeImageDimensions({ height, width })
  const smallImageDimensions = getSmallImageDimensions({ height, width })
  const horizontalImageDimensions = getHorizontalImageDimensions({ height, width })

  return (
    <Flex>
      <Flex flexDirection="row">
        <Image
          style={largeImageDimensions}
          source={{ uri: artworkImageURLs[0] }}
          resizeMode="cover"
        />
        <Flex style={{ marginLeft: GAP }}>
          <Image
            style={smallImageDimensions}
            source={{ uri: artworkImageURLs[1] }}
            resizeMode="cover"
          />
          <Box style={{ height: GAP }} />
          <Image
            style={smallImageDimensions}
            source={{ uri: artworkImageURLs[2] }}
            resizeMode="cover"
          />
        </Flex>
      </Flex>
      <Flex flexDirection="row" style={{ marginTop: GAP }}>
        <Image
          style={smallImageDimensions}
          source={{ uri: artworkImageURLs[3] }}
          resizeMode="cover"
        />
        <Box style={{ width: GAP }} />
        <Image
          style={horizontalImageDimensions}
          source={{ uri: artworkImageURLs[4] }}
          resizeMode="cover"
        />
      </Flex>
    </Flex>
  )
}

const backfillImageURLs = (imageURLs: string[], arrayLength: number) => {
  return Array.from({ length: arrayLength }, (_, i) => imageURLs[i % imageURLs.length])
}
