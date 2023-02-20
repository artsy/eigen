import { Box, Flex } from "@artsy/palette-mobile"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Division } from "app/Components/ThreeUpImageLayout"
import { Image } from "react-native"
import styled from "styled-components/native"

interface FiveUpImageLayoutProps {
  imageURLs: string[]
}

const LARGE_IMAGE_SIZES = { width: 444, height: 918 }
const SMALL_IMAGE_SIZES = { width: 161, height: 332 }
const HORIZONTAL_IMAGE_SIZES = { width: 373, height: 282 }

export const FiveUpImageLayout: React.FC<FiveUpImageLayoutProps> = ({ imageURLs }) => {
  // Ensure we have an array of exactly 3 URLs, copying over the last image if we have less than 3
  const artworkImageURLs = [null, null, null].reduce((acc: string[], _, i) => {
    return [...acc, imageURLs[i] || acc[i - 1]]
  }, [])

  return (
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
  )
}
