import { Flex, Touchable } from "@artsy/palette-mobile"
import { VimeoPlayer, VimeoPlayerRef } from "app/Components/VimeoPlayer/VimeoPlayer"
import { ImageCarouselContext } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { extractVimeoVideoDataFromUrl, useVimeoVideoMetadata } from "app/utils/videoHelpers"
import { useContext, useEffect, useRef, useState } from "react"
import { DimensionValue, Image } from "react-native"

interface ImageCarouselVimeoVideoProps {
  index: number
  width: number | string
  height: number | string
  maxHeight?: number | string
  vimeoUrl: string
}

export const ImageCarouselVimeoVideo: React.FC<ImageCarouselVimeoVideoProps> = ({
  index,
  width,
  height,
  maxHeight,
  vimeoUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCoverLoaded, setIsCoverLoaded] = useState(false)
  const { videoId, token } = extractVimeoVideoDataFromUrl(vimeoUrl)
  const { coverImage, isCoverUnavailable } = useVimeoVideoMetadata(videoId)
  const playerRef = useRef<VimeoPlayerRef>(null)
  const containerHeight = maxHeight ?? height
  const imageWidth = width as DimensionValue
  const imageHeight = containerHeight as DimensionValue

  /*
    Load the player once this slide is on screen or next to it, and keep it loaded after.
    The cover hides it while it loads and buffers, so a tap only has to start playback.
    Without a cover there is no play button of ours, so the player loads anyway and its own
    play button takes over.
  */
  const { imageIndex } = useContext(ImageCarouselContext)
  imageIndex.useUpdates()
  const isNearby = Math.abs(imageIndex.current - index) <= 1
  const [shouldLoadPlayer, setShouldLoadPlayer] = useState(isNearby)

  useEffect(() => {
    if (isNearby || isCoverUnavailable) {
      setShouldLoadPlayer(true)
    }
  }, [isNearby, isCoverUnavailable])

  return (
    <Flex
      width={width}
      height={containerHeight}
      accessibilityLabel="Vimeo Video Player"
      alignContent="center"
    >
      {!!shouldLoadPlayer && (
        <Flex flex={1} accessibilityLabel="Vimeo Video Player Controls">
          <VimeoPlayer
            ref={playerRef}
            videoId={videoId}
            hash={typeof token === "string" ? token : undefined}
            loop
            preload
            // Playback can also start from the player's own button, so hide a cover that loads late
            onPlay={() => setIsPlaying(true)}
          />
        </Flex>
      )}
      {!!coverImage && !isPlaying && (
        // Stays see-through until the cover has loaded, so it never blanks out a ready player
        <Flex
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg={isCoverLoaded ? "mono0" : undefined}
        >
          <Touchable
            // The slide is on screen, so the player is already mounted behind the cover
            onPress={() => {
              setIsPlaying(true)
              playerRef.current?.play()
            }}
            accessibilityLabel="Vimeo Play Button"
          >
            <Image
              source={{ uri: coverImage }}
              style={{ width: imageWidth, height: imageHeight, opacity: isCoverLoaded ? 1 : 0 }}
              resizeMode="contain"
              onLoad={() => setIsCoverLoaded(true)}
            />
          </Touchable>
        </Flex>
      )}
    </Flex>
  )
}
