import { VideoWebView } from "app/Components/VideoWebView"
import { useMemo } from "react"
import { URL } from "react-native-url-polyfill"

interface FeatureVideoProps {
  videoUrl: string
  width: number
  height: number
}

const ALLOWED_VIDEO_DOMAINS = [
  "player.vimeo.com",
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]

function isValidVideoUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return ALLOWED_VIDEO_DOMAINS.includes(url.host)
  } catch {
    return false
  }
}

/**
 * Converts YouTube watch URLs to embed URLs
 * - https://www.youtube.com/watch?v=VIDEO_ID -> https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - https://youtu.be/VIDEO_ID -> https://www.youtube-nocookie.com/embed/VIDEO_ID
 * Uses youtube-nocookie.com for better privacy and potentially better WebView compatibility
 */
function normalizeYouTubeUrl(urlString: string): string {
  try {
    const url = new URL(urlString)

    // Handle youtu.be short URLs
    if (url.host === "youtu.be") {
      const videoId = url.pathname.slice(1) // Remove leading slash
      console.log("[VIDEO] Converting youtu.be URL, videoId:", videoId)
      return `https://www.youtube-nocookie.com/embed/${videoId}`
    }

    // Handle youtube.com watch URLs
    if (
      (url.host === "www.youtube.com" || url.host === "youtube.com") &&
      url.pathname === "/watch"
    ) {
      const videoId = url.searchParams.get("v")
      if (videoId) {
        console.log("[VIDEO] Converting YouTube watch URL, videoId:", videoId)
        return `https://www.youtube-nocookie.com/embed/${videoId}`
      }
    }

    // Return as-is if already an embed URL or not a YouTube URL
    return urlString
  } catch {
    return urlString
  }
}

export const FeatureVideo: React.FC<FeatureVideoProps> = ({ videoUrl, width, height }) => {
  console.log("[VIDEO] Original URL:", videoUrl)
  console.log("[VIDEO] Container dimensions:", { width, height })

  // Normalize YouTube URLs to embed format
  const normalizedUrl = normalizeYouTubeUrl(videoUrl)
  console.log("[VIDEO] Normalized URL:", normalizedUrl)

  // Add autoplay and loop parameters while preserving existing params
  const url = new URL(normalizedUrl)
  console.log("[VIDEO] Parsed URL - host:", url.host, "pathname:", url.pathname)

  // For YouTube embeds, loop requires the playlist parameter set to the video ID
  const isYouTube =
    url.host === "www.youtube.com" ||
    url.host === "youtube.com" ||
    url.host === "www.youtube-nocookie.com" ||
    url.host === "youtube-nocookie.com"

  if (isYouTube && url.pathname.startsWith("/embed/")) {
    const videoId = url.pathname.split("/embed/")[1]
    if (videoId) {
      url.searchParams.set("playlist", videoId)
      console.log("[VIDEO] Added playlist parameter for YouTube loop:", videoId)
    }

    // Add YouTube-specific parameters
    url.searchParams.set("autoplay", "1")
    url.searchParams.set("loop", "1")
    url.searchParams.set("muted", "1")
    url.searchParams.set("playsinline", "1")
    url.searchParams.set("controls", "1")
    url.searchParams.set("modestbranding", "1")
  } else {
    // For Vimeo and other platforms
    url.searchParams.set("autoplay", "1")
    url.searchParams.set("loop", "1")
    url.searchParams.set("muted", "1")
  }

  const adjustedURL = url.toString()

  console.log("[VIDEO] Adjusted URL:", adjustedURL)

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

    console.log("[VIDEO] Iframe dims", { iframeWidth, iframeHeight })

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
        <script>
          // Capture all console logs and errors
          (function() {
            var originalLog = console.log;
            var originalError = console.error;
            var originalWarn = console.warn;

            console.log = function() {
              window.ReactNativeWebView.postMessage('Console.log: ' + Array.prototype.slice.call(arguments).join(' '));
              originalLog.apply(console, arguments);
            };

            console.error = function() {
              window.ReactNativeWebView.postMessage('Console.error: ' + Array.prototype.slice.call(arguments).join(' '));
              originalError.apply(console, arguments);
            };

            console.warn = function() {
              window.ReactNativeWebView.postMessage('Console.warn: ' + Array.prototype.slice.call(arguments).join(' '));
              originalWarn.apply(console, arguments);
            };
          })();

          window.addEventListener('message', function(event) {
            // Log YouTube API messages
            window.ReactNativeWebView.postMessage('postMessage event from: ' + event.origin + ', data: ' + JSON.stringify(event.data));
          });

          window.addEventListener('error', function(event) {
            window.ReactNativeWebView.postMessage('Window error: ' + event.message + ' at ' + event.filename + ':' + event.lineno);
          });

          document.addEventListener('DOMContentLoaded', function() {
            window.ReactNativeWebView.postMessage('DOM loaded');
            var iframe = document.querySelector('iframe');

            iframe.addEventListener('load', function() {
              window.ReactNativeWebView.postMessage('Iframe loaded successfully');

              // Check if iframe is visible
              var rect = iframe.getBoundingClientRect();
              window.ReactNativeWebView.postMessage('Iframe position: ' + JSON.stringify({
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                visible: rect.width > 0 && rect.height > 0
              }));
            });

            iframe.addEventListener('error', function(e) {
              window.ReactNativeWebView.postMessage('Iframe error: ' + e.message);
            });
          });

          // Log when page is fully loaded
          window.addEventListener('load', function() {
            window.ReactNativeWebView.postMessage('Window fully loaded');
          });
        </script>
      </head>
      <body>
        <div class="video-container">
          <iframe
            id="video-iframe"
            src="${adjustedURL}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </body>
    </html>
  `
  }, [adjustedURL, width, height])

  // Validate URL to prevent XSS attacks (use original URL for validation)
  const isValid = isValidVideoUrl(videoUrl)
  console.log("[VIDEO] isValid:", isValid)
  if (!isValid) {
    console.warn("[VIDEO] ❌ Invalid video URL domain:", videoUrl)
    return null
  }

  console.log("[VIDEO] ✅ Rendering VideoWebView")
  console.log("[VIDEO] Testing direct URL load:", adjustedURL)

  // TEMPORARY TEST: Load YouTube directly without iframe wrapper to see if WebView blocks it
  return <VideoWebView url={adjustedURL} width={width} height={height} testID="FeatureVideo" />

  // return <VideoWebView html={html} width={width} height={height} testID="FeatureVideo" />
}
