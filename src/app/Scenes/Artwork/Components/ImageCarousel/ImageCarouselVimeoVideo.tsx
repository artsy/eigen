import querystring from "querystring"
import { Flex, Touchable } from "palette"
import { useEffect, useState } from "react"
import { Image } from "react-native"
import { Config } from "react-native-config"
import { Vimeo } from "react-native-vimeo-iframe"

interface ImageCarouselVimeoVideoProps {
  width: number
  height: number
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
  vimeoUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoMeta, setVideoMeta] = useState<VimeoAPIResponse>(null)
  const { videoId, token } = extractVimeoVideoDataFromUrl(vimeoUrl)

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(
          `https://api.vimeo.com/videos/${videoId}?access_token=${Config.VIMEO_PUBLIC_TOKEN}`,
          {
            headers: {
              Accept: "application/vnd.vimeo.*+json;version=3.4",
              Authorization: `Bearer ${Config.VIMEO_PUBLIC_TOKEN}`,
            },
          }
        )
        const data = await response.json()
        setVideoMeta(data)
      } catch (error) {
        console.log("[ImageCarouselVimeoVideo] Error:", error)
      }
    }

    fetchVideoData()
  }, [])

  const coverImage = videoMeta?.pictures.sizes[4].link_with_play_button

  return (
    <Flex background="transparent" width={width} height={height}>
      {coverImage && !isPlaying && (
        <Touchable onPress={() => setIsPlaying(true)}>
          <Image source={{ uri: coverImage }} style={{ width, height }} />
        </Touchable>
      )}
      {isPlaying && (
        <Vimeo
          videoId={videoId}
          params={`h=${token}&loop=true&autoplay=${isPlaying ? 1 : 0}`}
          allowsInlineMediaPlayback={true}
          contentMode="recommended"
        />
      )}
    </Flex>
  )
}

export const extractVimeoVideoDataFromUrl = (playerUrl: string) => {
  const [url, queryParams] = playerUrl.split("?")
  const videoId = url.replace("https://player.vimeo.com/video/", "")
  const params = querystring.parse("?" + queryParams)

  return {
    videoId,
    token: params["?h"],
    width: params.width,
    height: params.height,
  }
}
