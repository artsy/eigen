import { Flex } from "@artsy/palette-mobile"
import {
  extractVimeoVideoDataFromUrl,
  extractYouTubeId,
  isValidVideoUrl,
  isVimeo,
  isYouTube,
} from "app/utils/videoHelpers"
import React, { useRef } from "react"
import { Vimeo } from "react-native-vimeo-iframe"
import YoutubePlayer from "react-native-youtube-iframe"

interface FeatureVideoProps {
  videoUrl: string
  width: number
  height: number
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
