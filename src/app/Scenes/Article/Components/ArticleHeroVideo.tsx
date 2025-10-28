import { useColor } from "@artsy/palette-mobile"
import { VideoWebView } from "app/Components/VideoWebView"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useMemo } from "react"
import performance from "react-native-performance"
import { Video } from "react-native-video"

interface ArticleHeroVideoProps {
  videoUrl: string
  width: number
  height: number
}

export const ArticleHeroVideo: React.FC<ArticleHeroVideoProps> = ({ videoUrl, width, height }) => {
  const useNewVideoComponent = useFeatureFlag("AREnableNewVideoView")
  const color = useColor()
  const backgroundColor = color("mono30")

  // Memoize HTML to prevent re-renders
  const html = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background-color: ${backgroundColor};
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
          }
        </style>
      </head>
      <body>
        <video
          autoplay
          loop
          muted
          playsinline
          preload="auto"
          webkit-playsinline
        >
          <source src="${videoUrl}" type="video/mp4">
        </video>
      </body>
    </html>
  `,
    [videoUrl, backgroundColor]
  )

  if (useNewVideoComponent) {
    console.log("[VIDEO] Using header component with uri", videoUrl)
    performance.mark("video_mount")
    return (
      <Video
        source={{ uri: videoUrl }}
        repeat
        onLoad={() => {
          // mark when the video has loaded
          performance.mark("video_ready")
          // now safely measure between the two marks
          performance.measure("TTFP", "video_mount", "video_ready")

          // read the measure
          const measures = performance.getEntriesByName("TTFP")
          const ttfp = measures[measures.length - 1]?.duration
          console.log(`[VIDEO] Article Hero Time to first play: ${ttfp?.toFixed(2)}ms`)
        }}
        style={{ width: width, height: height, aspectRatio: 16 / 9 }}
        testID="ArticleHeroVideo"
      />
    )
  }

  return <VideoWebView html={html} width={width} height={height} testID="ArticleHeroVideo" />
}
