import { Flex } from "@artsy/palette-mobile"
import { useMemo } from "react"
import { Platform } from "react-native"
import { WebView } from "react-native-webview"

interface FeatureVideoProps {
  videoUrl: string
  width: number
  height: number
}

const ALLOWED_VIDEO_DOMAINS = ["player.vimeo.com", "www.youtube.com", "youtube.com"]

function isValidVideoUrl(url: string): boolean {
  try {
    // Extract hostname from URL string
    const urlPattern = /^https?:\/\/([^/:]+)/
    const match = url.match(urlPattern)
    if (!match) {
      return false
    }
    const hostname = match[1]
    return ALLOWED_VIDEO_DOMAINS.includes(hostname)
  } catch {
    return false
  }
}

export const FeatureVideo: React.FC<FeatureVideoProps> = ({ videoUrl, width, height }) => {
  // Add autoplay and loop parameters while preserving existing params
  const separator = videoUrl.includes("?") ? "&" : "?"
  const adjustedURL = `${videoUrl}${separator}autoplay=1&loop=1&muted=1`

  // Calculate dimensions for 16:9 aspect ratio with object-fit: cover behavior
  const videoAspectRatio = 16 / 9
  const containerAspectRatio = width / height

  let iframeWidth = width
  let iframeHeight = height

  if (containerAspectRatio > videoAspectRatio) {
    // Container is wider than video - scale to width
    iframeHeight = width / videoAspectRatio
  } else {
    // Container is taller than video - scale to height
    iframeWidth = height * videoAspectRatio
  }

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
          body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: fixed;
          }
          .video-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          iframe {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${iframeWidth}px;
            height: ${iframeHeight}px;
            border: 0;
          }
        </style>
      </head>
      <body>
        <div class="video-container">
          <iframe
            src="${adjustedURL}"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </body>
    </html>
  `,
    [adjustedURL, iframeWidth, iframeHeight]
  )

  // Validate URL to prevent XSS attacks
  if (!isValidVideoUrl(videoUrl)) {
    console.warn(`FeatureVideo: Invalid video URL domain: ${videoUrl}`)
    return null
  }

  return (
    <Flex width={width} height={height} testID="FeatureVideo">
      <WebView
        source={{ html }}
        style={{ width, height }}
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
