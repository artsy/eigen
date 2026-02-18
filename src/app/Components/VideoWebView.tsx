import { Flex } from "@artsy/palette-mobile"
import { Platform } from "react-native"
import { WebView } from "react-native-webview"

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
  return (
    <Flex width={width} height={height} testID={testID}>
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
