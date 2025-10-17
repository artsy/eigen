import { Flex, useColor } from "@artsy/palette-mobile"
import { useMemo } from "react"
import { Platform } from "react-native"
import { WebView } from "react-native-webview"

interface ArticleHeroVideoProps {
  videoUrl: string
  width: number
  height: number
}

export const ArticleHeroVideo: React.FC<ArticleHeroVideoProps> = ({ videoUrl, width, height }) => {
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

  return (
    <Flex width={width} height={height} backgroundColor="mono30" testID="ArticleHeroVideo">
      <WebView
        source={{ html }}
        style={{ flex: 1, backgroundColor }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        scrollEnabled={false}
        bounces={false}
        // Prevent zooming
        scalesPageToFit={Platform.OS === "android"}
        // Performance optimizations
        androidLayerType="hardware"
        androidHardwareAccelerationDisabled={false}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        // Faster initial load
        startInLoadingState={false}
        // Prevent unnecessary re-renders
        setSupportMultipleWindows={false}
        // Allow mixed content for better Android network performance
        mixedContentMode="always"
      />
    </Flex>
  )
}
