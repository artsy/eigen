import { Flex, useColor } from "@artsy/palette-mobile"
import { useMemo } from "react"
import { Platform } from "react-native"
import { WebView } from "react-native-webview"

interface FeatureVideoProps {
  videoUrl: string
  width: number
  height: number
}

export const FeatureVideo: React.FC<FeatureVideoProps> = ({ videoUrl, width, height }) => {
  const color = useColor()
  const backgroundColor = color("mono30")

  // Add autoplay and loop parameters while preserving existing params
  const separator = videoUrl.includes("?") ? "&" : "?"
  const adjustedURL = `${videoUrl}${separator}autoplay=1&loop=1&muted=1`

  // Memoize HTML to prevent re-renders
  const html = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; }
          body, html { width: 100%; height: 100%; overflow: hidden; }
          iframe { width: 100%; height: 100%; border: 0; display: block; }
        </style>
      </head>
      <body>
        <iframe
          src="${adjustedURL}"
          width="100%"
          height="100%"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `,
    [adjustedURL]
  )

  return (
    <Flex width={width} height={height} backgroundColor="mono30" testID="FeatureVideo">
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
