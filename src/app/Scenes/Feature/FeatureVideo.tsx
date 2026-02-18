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

  const { videoId: vimeoId } = extractVimeoVideoDataFromUrl(videoUrl)
  const playerRef = useRef(null)

  if (!isValidVideoUrl(videoUrl)) {
    console.warn(`FeatureVideo: Invalid video URL domain: ${videoUrl}`)
    return null
  }

  if (isYouTube(videoUrl) && ytId) {
    // YouTube videos are typically 16:9, calculate height based on width
    const youtubeHeight = width / (16 / 9)

    return (
      <Flex testID="FeatureVideo" width={width} height={youtubeHeight}>
        <YoutubePlayer
          testID="FeatureVideo"
          ref={playerRef}
          width={width}
          height={youtubeHeight}
          play={false}
          videoId={ytId}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
          }}
        />
      </Flex>
    )
  }

  if (isVimeo(videoUrl) && vimeoId) {
    return (
      <Flex
        testID="FeatureVideo"
        accessibilityLabel="Vimeo Video Player Controls"
        width={width}
        height={height}
      >
        <Vimeo videoId={vimeoId} allowsFullscreenVideo />
      </Flex>
    )
  }

  // render nothing if unknown provider
  return null
}
