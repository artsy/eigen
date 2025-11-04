import { Flex } from "@artsy/palette-mobile"
import { extractVimeoVideoDataFromUrl } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselVimeoVideo"
import React, { useRef } from "react"
import { URL } from "react-native-url-polyfill"
import { Vimeo } from "react-native-vimeo-iframe"
import YoutubePlayer from "react-native-youtube-iframe"

interface FeatureVideoProps {
  videoUrl: string
  width: number
  height: number
}

const ALLOWED_VIDEO_DOMAINS = ["player.vimeo.com", "www.youtube.com", "youtube.com", "youtu.be"]

const isValidVideoUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString)
    return ALLOWED_VIDEO_DOMAINS.includes(url.host)
  } catch {
    return false
  }
}

const isYouTube = (url: string) => /youtu(\.be|be\.com)/.test(url)
const isVimeo = (url: string) => /vimeo\.com/.test(url)

const extractYouTubeId = (urlString: string): string | null => {
  try {
    const url = new URL(urlString)
    if (url.host.includes("youtu.be")) return url.pathname.slice(1)
    if (url.searchParams.get("v")) return url.searchParams.get("v")
    const match = url.pathname.match(/\/embed\/([^/?]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export const FeatureVideo: React.FC<FeatureVideoProps> = ({ videoUrl, width, height }) => {
  const ytId = extractYouTubeId(videoUrl)

  const { videoId: vimeoId, token } = extractVimeoVideoDataFromUrl(videoUrl)
  const playerRef = useRef(null)

  if (!isValidVideoUrl(videoUrl)) {
    console.warn(`FeatureVideo: Invalid video URL domain: ${videoUrl}`)
    return null
  }

  if (isYouTube(videoUrl) && ytId) {
    return (
      <Flex testID="FeatureVideo">
        <YoutubePlayer
          testID="FeatureVideo"
          ref={playerRef}
          height={height}
          width={width}
          play={true}
          videoId={ytId}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
          }}
        />
      </Flex>
    )
  }

  if (isVimeo(videoUrl) && vimeoId && token) {
    return (
      <Flex
        testID="FeatureVideo"
        accessibilityLabel="Vimeo Video Player Controls"
        width={width}
        height={height}
      >
        <Vimeo
          videoId={vimeoId}
          params={`h=${token}&loop=true&autoplay=0&transparent=0&background=false`}
          allowsFullscreenVideo
        />
      </Flex>
    )
  }

  // render nothing if unknown provider
  return null
}
