import { Flex } from "@artsy/palette-mobile"
import { Image } from "react-native"

interface FiveUpImageLayoutProps {
  imageURLs: string[]
}

const LARGE_IMAGE_SIZES = { width: 200, height: 300 }
const SMALL_IMAGE_SIZES = { width: 80, height: 150 }
const HORIZONTAL_IMAGE_SIZES = { width: 200, height: 150 }

export const FiveUpImageLayout: React.FC<FiveUpImageLayoutProps> = ({ imageURLs }) => {
  // Ensure we have an array of exactly 5 URLs, copying over the last image if we have less than 5
  const artworkImageURLs = [null, null, null, null, null].reduce((acc: string[], _, i) => {
    return [...acc, imageURLs[i] || acc[i - 1]]
  }, [])

  return (
    <Flex>
      <Flex flexDirection="row">
        <Image
          style={{ width: LARGE_IMAGE_SIZES["width"], height: LARGE_IMAGE_SIZES["height"] }}
          source={{ uri: artworkImageURLs[0] }}
          resizeMode="cover"
        />
        <Flex>
          <Image
            style={{ width: SMALL_IMAGE_SIZES["width"], height: SMALL_IMAGE_SIZES["height"] }}
            source={{ uri: artworkImageURLs[1] }}
            resizeMode="cover"
          />
          <Image
            style={{ width: SMALL_IMAGE_SIZES["width"], height: SMALL_IMAGE_SIZES["height"] }}
            source={{ uri: artworkImageURLs[2] }}
            resizeMode="cover"
          />
        </Flex>
      </Flex>
      <Flex flexDirection="row">
        <Image
          style={{
            width: SMALL_IMAGE_SIZES["width"],
            height: SMALL_IMAGE_SIZES["height"],
          }}
          source={{ uri: artworkImageURLs[3] }}
          resizeMode="cover"
        />
        <Image
          style={{
            width: HORIZONTAL_IMAGE_SIZES["width"],
            height: HORIZONTAL_IMAGE_SIZES["height"],
          }}
          source={{ uri: artworkImageURLs[4] }}
          resizeMode="cover"
        />
      </Flex>
    </Flex>
  )
}
