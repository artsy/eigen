import { Flex, Touchable } from "@artsy/palette-mobile"
import { extractVimeoVideoDataFromUrl, useVimeoVideoMetadata } from "app/utils/videoHelpers"
import { useState } from "react"
import { DimensionValue, Image } from "react-native"
import { Vimeo } from "react-native-vimeo-iframe"

interface ImageCarouselVimeoVideoProps {
  width: number | string
  height: number | string
  maxHeight?: number | string
  vimeoUrl: string
}

export const ImageCarouselVimeoVideo: React.FC<ImageCarouselVimeoVideoProps> = ({
  width,
  height,
  maxHeight,
  vimeoUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const { videoId, token } = extractVimeoVideoDataFromUrl(vimeoUrl)
  const { coverImage } = useVimeoVideoMetadata(videoId)
  const containerHeight = maxHeight ?? height
  const imageWidth = width as DimensionValue
  const imageHeight = containerHeight as DimensionValue

  return (
    <Flex
      width={width}
      height={containerHeight}
      accessibilityLabel="Vimeo Video Player"
      alignContent="center"
    >
      {!!coverImage && !isPlaying && (
        <Touchable onPress={() => setIsPlaying(true)} accessibilityLabel="Vimeo Play Button">
          <Image
            source={{ uri: coverImage }}
            style={{ width: imageWidth, height: imageHeight }}
            resizeMode="contain"
          />
        </Touchable>
      )}
      {!!isPlaying && (
        <Flex accessibilityLabel="Vimeo Video Player Controls" width="100%" height="100%">
          <Vimeo
            videoId={videoId}
            params={`h=${token}&loop=true&autoplay=${
              isPlaying ? 1 : 0
            }&transparent=1&background=false`}
            allowsFullscreenVideo
          />
        </Flex>
      )}
    </Flex>
  )
}
