import { Flex } from "@artsy/palette-mobile"
import { Image } from "react-native"

interface FiveUpImageLayoutProps {
  imageURLs: string[]
  height?: number
}

const DEFAULT_HEIGHT = 422

export const FiveUpImageLayout: React.FC<FiveUpImageLayoutProps> = ({
  imageURLs,
  height = DEFAULT_HEIGHT,
}) => {
  // Ensure we have an array of exactly 5 URLs, copying over the last image if we have less than 5
  const artworkImageURLs = backfillImageURLs(imageURLs, 5)

  const width = 0.65 * height

  const largeImageDimensions = { width: (2 / 3) * width, height: (2 / 3) * height }
  const smallImageDimensions = { width: (1 / 3) * width, height: (1 / 3) * height }
  const horizontalImageDimensions = { width: (2 / 3) * width, height: (1 / 3) * height }

  return (
    <Flex>
      <Flex flexDirection="row">
        <Image
          style={largeImageDimensions}
          source={{ uri: artworkImageURLs[0] }}
          resizeMode="cover"
        />
        <Flex>
          <Image
            style={smallImageDimensions}
            source={{ uri: artworkImageURLs[1] }}
            resizeMode="cover"
          />
          <Image
            style={smallImageDimensions}
            source={{ uri: artworkImageURLs[2] }}
            resizeMode="cover"
          />
        </Flex>
      </Flex>
      <Flex flexDirection="row">
        <Image
          style={smallImageDimensions}
          source={{ uri: artworkImageURLs[3] }}
          resizeMode="cover"
        />
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
  return Array.from({ length: arrayLength }, () => null).reduce((acc: string[], _, i) => {
    return [...acc, imageURLs[i] || acc[i - 1]]
  }, [])
}
