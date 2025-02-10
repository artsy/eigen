import { Flex, Touchable } from "@artsy/palette-mobile"
import { parse } from "query-string"
import { useEffect, useState } from "react"
import { DimensionValue, Image } from "react-native"
import Keys from "react-native-keys"
import { Vimeo } from "react-native-vimeo-iframe"

interface ImageCarouselVimeoVideoProps {
  width: number | string
  height: number | string
  maxHeight?: number | string
  vimeoUrl: string
}

type VimeoAPIResponse = {
  pictures: {
    sizes: Array<{
      height: number
      link: string
      link_with_play_button: string
      width: number
    }>
  }
} | null

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

const useVimeoVideoMetadata = (videoId: string) => {
  const [videoMetadata, setVideoMetadata] = useState<VimeoAPIResponse>(null)
  const coverImage = videoMetadata?.pictures?.sizes?.[4]?.link_with_play_button

  useEffect(() => {
    const fetchVideoMetadata = async () => {
      try {
        const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
          headers: {
            Accept: "application/vnd.vimeo.*+json;version=3.4",
            Authorization: `Bearer ${Keys.secureFor("VIMEO_PUBLIC_TOKEN")}`,
          },
        })
        const data = await response.json()
        setVideoMetadata(data)
      } catch (error) {
        console.log("[ImageCarouselVimeoVideo] Error:", error)
      }
    }

    fetchVideoMetadata()
  }, [])

  return {
    videoMetadata,
    coverImage,
  }
}

export const extractVimeoVideoDataFromUrl = (playerUrl: string) => {
  const [url, queryParams] = playerUrl.split("?")
  const videoId = url.replace("https://player.vimeo.com/video/", "")
  const params = parse("?" + queryParams)

  return {
    videoId,
    token: params.h,
    width: params.width,
    height: params.height,
  }
}
