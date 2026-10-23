import { Flex, Touchable } from "@artsy/palette-mobile"
import { VimeoPlayer, VimeoPlayerRef } from "app/Components/VimeoPlayer/VimeoPlayer"
import { extractVimeoVideoDataFromUrl, useVimeoVideoMetadata } from "app/utils/videoHelpers"
import { useEffect, useRef, useState } from "react"
import { DimensionValue, Image } from "react-native"

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
  const playerRef = useRef<VimeoPlayerRef>(null)
  const containerHeight = maxHeight ?? height
  const imageWidth = width as DimensionValue
  const imageHeight = containerHeight as DimensionValue

  // The player mounts on tap, and starts as soon as its page has loaded
  useEffect(() => {
    if (isPlaying) {
      playerRef.current?.play()
    }
  }, [isPlaying])

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
          <VimeoPlayer
            ref={playerRef}
            videoId={videoId}
            hash={typeof token === "string" ? token : undefined}
            loop
          />
        </Flex>
      )}
    </Flex>
  )
}
