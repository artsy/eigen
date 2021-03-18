import { color } from "@artsy/palette-tokens"
import { goBack } from "lib/navigation/navigate"
import { getCurrentEmissionState, useEnvironment } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef, useState } from "react"
import { View } from "react-native"
import WebView from "react-native-webview"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"

export interface ArtsyWebViewConfig {
  title?: string
}

export const ArtsyReactWebView: React.FC<
  {
    url: string
    isPresentedModally?: boolean
  } & ArtsyWebViewConfig
> = ({ url, title, isPresentedModally }) => {
  const paddingTop = useScreenDimensions().safeAreaInsets.top
  const userAgent = getCurrentEmissionState().userAgent

  const ref = useRef<WebView>(null)
  const [loadProgress, setLoadProgress] = useState<number | null>(null)
  const webURL = useEnvironment().webURL
  const uri = url.startsWith("/") ? webURL + url : url

  return (
    <View style={{ flex: 1, paddingTop }}>
      <FancyModalHeader useXButton={isPresentedModally} onLeftButtonPress={goBack}>
        {title}
      </FancyModalHeader>
      <View style={{ flex: 1 }}>
        <WebView
          ref={ref}
          source={{ uri }}
          style={{ flex: 1 }}
          userAgent={userAgent}
          onLoadStart={() => setLoadProgress(0.02)}
          onLoadEnd={() => setLoadProgress(null)}
          onLoadProgress={(e) => setLoadProgress(e.nativeEvent.progress)}
        />
        <ProgressBar loadProgress={loadProgress} />
      </View>
    </View>
  )
}

const ProgressBar: React.FC<{ loadProgress: number | null }> = ({ loadProgress }) => {
  if (loadProgress === null) {
    return null
  }
  const progressPercent = Math.max(loadProgress * 100, 2)
  return (
    <View
      testID="progress-bar"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: progressPercent + "%",
        height: 2,
        backgroundColor: color("purple100"),
      }}
    />
  )
}

// tslint:disable-next-line:variable-name
export const __webViewTestUtils__ = __TEST__
  ? {
      ProgressBar,
    }
  : null
