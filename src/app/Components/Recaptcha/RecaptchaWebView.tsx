import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { FC, useRef } from "react"
import Keys from "react-native-keys"
import WebView, { WebViewMessageEvent } from "react-native-webview"
import { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes"

type RecaptchaWebViewProps = {
  action: string
  onError?: (error: string) => void
  onLoad?: () => void
  onToken: (token: string, isFallback?: boolean, fallbackReason?: string) => void
}

export const RecaptchaWebView: FC<RecaptchaWebViewProps> = ({
  action,
  onToken,
  onError,
  onLoad,
}) => {
  const ref = useRef<WebView>(null)
  const isStaging = useIsStaging()

  const recaptchaKey = !isStaging
    ? Keys.secureFor("RECAPTCHA_KEY_PRODUCTION")
    : Keys.secureFor("RECAPTCHA_KEY_STAGING")
  const baseUrl = !isStaging ? "https://artsy.net/" : "https://staging.artsy.net/"

  const handleOnMessage = (e: WebViewMessageEvent) => {
    const message = getMessage(e)
    if (message?.type === "token") {
      onToken(message.payload, message.fallback, message.fallbackReason)
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
function postFallback(fallbackReason) {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({ payload: "artsy-recaptcha-fallback", type: "token", fallback: true, fallbackReason })
  );
}

function checkAndExecuteRecaptcha() {
  if (typeof grecaptcha === "undefined") return postFallback("grecaptcha_undefined");
  if (!grecaptcha.ready) return postFallback("grecaptcha_ready_missing");
  if (typeof grecaptcha.execute !== "function") return postFallback("grecaptcha_execute_not_function");

  try {
    grecaptcha.ready(function () {
      try {
        var executePromise = grecaptcha.execute("${recaptchaKey}", { action: "${action}" });

        if (executePromise == null || executePromise === undefined) return postFallback("grecaptcha_execute_returned_null_or_undefined");
        if (typeof executePromise.then !== "function") return postFallback("grecaptcha_execute_returned_non_promise");

        executePromise
          .then(function (token) {
            window.ReactNativeWebView?.postMessage(JSON.stringify({ payload: token, type: "token" }));
          })
          .catch(function (error) {
            postFallback("grecaptcha_execute_promise_rejected - " + (error ? String(error?.message || error) : "unknown error"));
          });
      } catch (innerError) {
        postFallback("grecaptcha_ready_callback_exception - " + (error ? String(innerError?.message || innerError) : "unknown error"));
      }
    });
  } catch (outerError) {
    postFallback("grecaptcha_ready_call_exception - " + (error ? String(outerError?.message || outerError) : "unknown error"));
  }
}

checkAndExecuteRecaptcha();
`

type Message = {
  payload: string
  type: "token" | "error"
  fallback?: boolean
  fallbackReason?: string
}
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
