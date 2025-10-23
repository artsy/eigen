import { VideoWebView } from "app/Components/VideoWebView"
import { useMemo } from "react"
import { URL } from "react-native-url-polyfill"

interface FeatureVideoProps {
  videoUrl: string
  width: number
  height: number
}

const ALLOWED_VIDEO_DOMAINS = ["player.vimeo.com", "www.youtube.com", "youtube.com"]

function isValidVideoUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return ALLOWED_VIDEO_DOMAINS.includes(url.host)
  } catch {
    return false
  }
}

export const FeatureVideo: React.FC<FeatureVideoProps> = ({ videoUrl, width, height }) => {
  // Add autoplay and loop parameters while preserving existing params
  const url = new URL(videoUrl)
  url.searchParams.set("autoplay", "1")
  url.searchParams.set("loop", "1")
  url.searchParams.set("muted", "1")
  const adjustedURL = url.toString()

  // Memoize HTML to prevent re-renders
  const html = useMemo(() => {
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

    return `
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
  `
  }, [adjustedURL, width, height])

  // Validate URL to prevent XSS attacks
  if (!isValidVideoUrl(videoUrl)) {
    console.warn(`FeatureVideo: Invalid video URL domain: ${videoUrl}`)
    return null
  }

  return <VideoWebView html={html} width={width} height={height} testID="FeatureVideo" />
}
