import { Flex } from "@artsy/palette-mobile"
import { Platform } from "react-native"
import performance from "react-native-performance"
import { WebView, WebViewMessageEvent } from "react-native-webview"

interface VideoWebViewProps {
  html: string
  width: number
  height: number
  testID?: string
}

/**
 * Optimized WebView component for video playback.
 * Includes performance optimizations and mobile-specific configurations.
 */
export const VideoWebView: React.FC<VideoWebViewProps> = ({ html, width, height, testID }) => {
  // mark the start of load
  performance.mark("webview_mount")

  const injectedJavaScript = `
    (function() {
      const video = document.querySelector('video');
      if (!video) return;

      const send = (type) => window.ReactNativeWebView.postMessage(type);

      // When video element metadata loads (roughly equivalent to onLoad)
      video.addEventListener('loadeddata', () => send('video_ready'));

      // When it actually starts playback
      video.addEventListener('play', () => send('video_play'));

      // Optionally, measure buffering
      video.addEventListener('waiting', () => send('video_buffering_start'));
      video.addEventListener('playing', () => send('video_buffering_end'));
    })();
    true; // required for injected JS to evaluate
  `

  const handleMessage = (event: WebViewMessageEvent) => {
    const type = event.nativeEvent.data
    if (type === "video_ready") {
      performance.mark("webview_video_ready")
      performance.measure("WebView_TTFP", "webview_mount", "webview_video_ready")
      const measures = performance.getEntriesByName("WebView_TTFP")
      const duration = measures[measures.length - 1]?.duration
      console.log(`[WEBVIEW] TTFP (metadata): ${duration?.toFixed(2)}ms`)
    }

    if (type === "video_play") {
      performance.mark("webview_video_play")
      performance.measure("WebView_PlayDelay", "webview_mount", "webview_video_play")
      const measures = performance.getEntriesByName("WebView_PlayDelay")
      const duration = measures[measures.length - 1]?.duration
      console.log(`[WEBVIEW] Time to first play: ${duration?.toFixed(2)}ms`)
    }
  }

  return (
    <Flex width={width} height={height} testID={testID}>
      <WebView
        source={{ html }}
        style={{ width, height }}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
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
