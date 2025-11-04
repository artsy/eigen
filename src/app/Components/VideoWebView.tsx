import { Flex } from "@artsy/palette-mobile"
import { Platform } from "react-native"
import { WebView } from "react-native-webview"

interface VideoWebViewProps {
  html?: string
  url?: string
  width: number
  height: number
  testID?: string
}

/**
 * Optimized WebView component for video playback.
 * Includes performance optimizations and mobile-specific configurations.
 */
export const VideoWebView: React.FC<VideoWebViewProps> = ({ html, url, width, height, testID }) => {
  // Use a standard mobile browser user agent for better compatibility with video platforms
  const userAgent = Platform.select({
    ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    android:
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  })

  return (
    <Flex width={width} height={height} testID={testID}>
      <WebView
        source={url ? { uri: url } : { html: html || "" }}
        style={{ width, height }}
        userAgent={userAgent}
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
        // Required for YouTube embeds
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
        // iOS-specific settings for media playback
        allowsBackForwardNavigationGestures={false}
        // Debug handlers
        onLoad={() => console.log("[VideoWebView] onLoad fired")}
        onLoadStart={() => console.log("[VideoWebView] onLoadStart fired")}
        onLoadEnd={() => console.log("[VideoWebView] onLoadEnd fired")}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          console.error("[VideoWebView] onError:", nativeEvent)
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          console.error("[VideoWebView] onHttpError:", nativeEvent)
        }}
        onMessage={(event) => {
          console.log("[VideoWebView] Message from iframe:", event.nativeEvent.data)
        }}
        onNavigationStateChange={(navState) => {
          console.log("[VideoWebView] Navigation:", {
            url: navState.url,
            title: navState.title,
            loading: navState.loading,
            canGoBack: navState.canGoBack,
          })
        }}
        onContentProcessDidTerminate={() => {
          console.error("[VideoWebView] Content process terminated")
        }}
        onShouldStartLoadWithRequest={(request) => {
          console.log("[VideoWebView] Should start load:", request.url)
          // Block navigation to about:blank (YouTube tries to redirect there when blocking WebViews)
          if (request.url === "about:blank" || request.url.startsWith("about:blank")) {
            console.warn("[VideoWebView] Blocked navigation to about:blank")
            return false
          }
          return true
        }}
      />
    </Flex>
  )
}
