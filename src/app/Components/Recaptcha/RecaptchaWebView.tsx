import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { FC, useRef } from "react"
import { Alert } from "react-native"
import Config from "react-native-config"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes"

type RecaptchaWebViewProps = {
  action: string
  onError?: (error: string) => void
  onLoad?: () => void
  onToken: (token: string) => void
}

export const RecaptchaWebView: FC<RecaptchaWebViewProps> = ({
  action,
  onToken,
  onError,
  onLoad,
}) => {
  const ref = useRef<WebView>(null)
  const isStaging = useIsStaging()

  const recaptchaKey = !isStaging ? Config.RECAPTCHA_KEY_PRODUCTION : Config.RECAPTCHA_KEY_STAGING
  const baseUrl = !isStaging ? "https://artsy.net/" : "https://staging.artsy.net/"

  const handleOnMessage = (e: WebViewMessageEvent) => {
    const message = getMessage(e)
    if (message?.type === "token") {
      onToken(message.payload)
      return
    }
    if (message?.type === "error") {
      onError?.(message.payload)
      return
    }
  }

  return (
    <WebView
      ref={ref}
      javaScriptEnabled
      originWhitelist={["*"]}
      automaticallyAdjustContentInsets
      mixedContentMode="always"
      source={{
        html: html(recaptchaKey as string, action),
        baseUrl,
      }}
      onError={(e) => onError?.(e.nativeEvent.description)}
      onLoad={() => onLoad?.()}
      onMessage={handleOnMessage}
      allowFileAccessFromFileURLs
      javaScriptCanOpenWindowsAutomatically
      onShouldStartLoadWithRequest={(e: ShouldStartLoadRequest) => {
        Alert.alert("onShouldStartLoadWithRequest", e.url)
        if (
          e.url.startsWith("https://www.google.com/recaptcha") ||
          e.url.startsWith("https://staging.artsy.net") ||
          e.url.startsWith("https://artsy.net") ||
          e.url.startsWith("about:blank")
        ) {
          return true
        }
        return false
      }}
    />
  )
}

const html = (recaptchaKey: string, action: string) => `
  <!DOCTYPE html>
  <html>
    <body>
      <script src="https://www.google.com/recaptcha/api.js?render=${recaptchaKey}"></script>
      <script>
        ${loadRecaptcha(recaptchaKey, action)}
      </script>
    </body>
  </html>
`

const loadRecaptcha = (recaptchaKey: string, action: string) => `
  grecaptcha.ready(function () {
    grecaptcha.execute("${recaptchaKey}", { action: "${action}" })
      .then(function(token) {
        window.ReactNativeWebView?.postMessage(JSON.stringify({ payload: token, type: "token" }))
      })
      .catch(function (error) {
        window.ReactNativeWebView?.postMessage(JSON.stringify({ payload: error?.message, type: "error" }))
      })
  })
`

type Message = { payload: string; type: "token" | "error" }
const getMessage = (event: WebViewMessageEvent): null | Message => {
  try {
    const json = JSON.parse(event.nativeEvent.data)
    if (json && ["token", "error"].includes(json.type)) {
      return json
    }

    return null
  } catch (error) {
    console.log("Failed to parse message from RecaptchaWebView", error)
    return null
  }
}
