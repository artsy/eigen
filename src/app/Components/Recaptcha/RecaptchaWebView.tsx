import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { FC, useRef } from "react"
import Keys from "react-native-keys"
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

  const recaptchaKey = !isStaging
    ? Keys.secureFor("RECAPTCHA_KEY_PRODUCTION")
    : Keys.secureFor("RECAPTCHA_KEY_STAGING")

  const baseUrl = !isStaging ? "https://artsy.net/" : "https://staging.artsy.net/"

  console.log(
    `[RecaptchaWebView] rendering for action ${action} with recaptchaKey: ${recaptchaKey} and baseUrl: ${baseUrl}`
  )

  // const handleOnMessage = (e: WebViewMessageEvent) => {
  //   const message = getMessage(e)
  //   console.log(`[RecaptchaWebView] received message for action ${action}:`, message)
  //   if (message?.type === "token") {
  //     onToken(message.payload)
  //     return
  //   }
  //   if (message?.type === "error") {
  //     onError?.(message.payload)
  //     return
  //   }
  // }

  const handleOnMessage = (e: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(e.nativeEvent.data)
      console.log("[RecaptchaWebView] Message received:", message)

      if (message.type === "token") {
        onToken(message.payload)
      } else if (message.type === "error") {
        onError?.(message.payload)
      } else if (message.type === "READY") {
        console.log("[RecaptchaWebView] Recaptcha is ready")
      } else if (message.type === "script-load-success") {
        console.log("[RecaptchaWebView] Script loaded successfully")
      } else if (message.type === "script-load-failure") {
        console.error("[RecaptchaWebView] Script failed to load:", message.payload)
      }
    } catch (err) {
      console.log("Failed to parse message from WebView:", err)
    }
  }

  console.log(`[RecaptchaWebView] rendering`)
  return (
    <WebView
      ref={ref}
      javaScriptEnabled
      originWhitelist={["*"]}
      webviewDebuggingEnabled={__DEV__}
      automaticallyAdjustContentInsets
      mixedContentMode="always"
      source={{
        html: v3html(recaptchaKey as string, action),
        baseUrl: baseUrl,
      }}
      onError={(e) => onError?.(e.nativeEvent.description)}
      onLoad={() => onLoad?.()}
      onMessage={(e) => {
        console.log(`[RecaptchaWebView] onMessage called for action ${action}`)
        handleOnMessage(e)
      }}
      allowFileAccessFromFileURLs
      javaScriptCanOpenWindowsAutomatically
      onLoadStart={() => {
        console.log(`[RecaptchaWebView] onLoadStart called for action ${action}`)
      }}
      onShouldStartLoadWithRequest={(e: ShouldStartLoadRequest) => {
        console.log(
          `[RecaptchaWebView] onShouldStartLoadWithRequest called for action ${action}`,
          e
        )
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

// const html = (recaptchaKey: string, action: string) => `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     </head>
//     <body>
//       <p>Loading reCAPTCHA...</p>
//       <script>
//         function postMessage(type, payload) {
//           window.ReactNativeWebView?.postMessage(JSON.stringify({ type, ...payload }));
//         }

//         function checkRecaptchaReady() {
//           if (window.grecaptcha && window.grecaptcha.ready) {
//             window.grecaptcha.ready(function() {
//               alert("[Recaptcha] grecaptcha.ready fired");
//               postMessage("READY", {});

//               // Optional: Auto-execute
//               grecaptcha.execute('${recaptchaKey}', { action: '${action}' })
//                 .then(token => {
//                   alert("[Recaptcha] Token: " + token);
//                   postMessage("token", { payload: token });
//                 })
//                 .catch(err => {
//                   postMessage("error", { payload: err.message || "execute failed" });
//                 });
//             });
//           } else {
//             setTimeout(checkRecaptchaReady, 500);
//           }
//         }

//         setTimeout(checkRecaptchaReady, 500);
//       </script>
//       <script src="https://www.google.com/recaptcha/api.js?render=${recaptchaKey}" async defer></script>
//     </body>
//   </html>
// `

const simplehtml = () => `
  <!DOCTYPE html>
  <html>
    <body>
      <p>Hello from WebView</p>
      <script>
        alert("✅ WebView is working!");
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "ping", payload: "webview ok" }));
      </script>
    </body>
  </html>
`

const slightyBetterHtml = () => `
   <p>Trying to load reCAPTCHA script...</p>
      <script>
        window.onload = function () {
          alert("✅ HTML loaded");
        };
      </script>
      <script src="https://www.google.com/recaptcha/api.js?render=explicit" async defer></script>
      `

const evenBetterHtml = (recaptchaKey: string, action: string) => `
  <!DOCTYPE html>
  <html>
    <body>
      <p>Loading reCAPTCHA with your key...</p>
      <script>
        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = function () {
          alert("✅ reCAPTCHA script loaded with your key");
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "script-load-success" }));
        };
        script.onerror = function () {
          alert("❌ reCAPTCHA script failed to load");
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "script-load-failure" }));
        };
        document.head.appendChild(script);
      </script>
    </body>
  </html>
`

const againBetterHtml = (recaptchaKey: string, action: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <p>Loading reCAPTCHA script...</p>

      <script>
        // Global window.onerror to catch script loading issues or runtime problems
        window.onerror = function (msg, url, lineNo, columnNo, error) {
          const details = {
            message: msg,
            url,
            line: lineNo,
            column: columnNo,
            error: error?.message || error
          };
          alert("❌ window.onerror: " + JSON.stringify(details));
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: "error",
            payload: "window.onerror: " + JSON.stringify(details)
          }));
          return false;
        };

        // Dynamically load reCAPTCHA
        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;

        script.onload = function () {
          alert("✅ reCAPTCHA script loaded");
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: "script-load-success"
          }));
        };

        script.onerror = function (e) {
          alert("❌ reCAPTCHA script failed to load: " + JSON.stringify(e));
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: "script-load-failure",
            payload: JSON.stringify(e)
          }));
        };

        document.head.appendChild(script);
      </script>
    </body>
  </html>
`

const lodashHtml = () => `
  <!DOCTYPE html>
  <html>
    <body>
      <script>
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js";
        script.async = true;
        script.onload = function () {
          alert("✅ lodash script loaded successfully");
        };
        script.onerror = function () {
          alert("❌ lodash script failed to load");
        };
        document.head.appendChild(script);
      </script>
    </body>
  </html>
`

const v3html = (recaptchaKey: string, action: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <p>Loading reCAPTCHA v3 script with key...</p>

      <script>
        // Catch any unexpected runtime JS errors
        window.onerror = function (msg, url, lineNo, columnNo, error) {
          const details = {
            message: msg,
            url,
            line: lineNo,
            column: columnNo,
            error: error?.message || error
          };
          alert("❌ window.onerror: " + JSON.stringify(details));
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: "error",
            payload: "window.onerror: " + JSON.stringify(details)
          }));
          return false;
        };

        // Load reCAPTCHA v3 with your key
        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js?render=${recaptchaKey}";
        script.async = true;
        script.defer = true;

        script.onload = function () {
          alert("✅ reCAPTCHA v3 script loaded");

          // Now attempt to call grecaptcha.ready and execute
          if (window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(function () {
              alert("✅ grecaptcha.ready triggered");

              window.grecaptcha.execute('${recaptchaKey}', { action: '${action}' })
                .then(function (token) {
                  alert("✅ Token received: " + token);
                  window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: "token",
                    payload: token
                  }));
                })
                .catch(function (err) {
                  alert("❌ grecaptcha.execute failed: " + (err?.message || err));
                  window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: "error",
                    payload: "grecaptcha.execute failed: " + (err?.message || err)
                  }));
                });
            });
          } else {
            alert("❌ grecaptcha or grecaptcha.ready is not available");
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              type: "error",
              payload: "grecaptcha.ready not available"
            }));
          }
        };

        script.onerror = function (e) {
          alert("❌ reCAPTCHA script failed to load: " + JSON.stringify(e));
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: "script-load-failure",
            payload: JSON.stringify(e)
          }));
        };

        document.head.appendChild(script);
      </script>
    </body>
  </html>
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

// const loadRecaptchaOld = (recaptchaKey: string, action: string) => `
//  alert("[Recaptcha] Script started for action: ${action}");
//   grecaptcha.ready(function () {
//     alert("[Recaptcha] grecaptcha.ready triggered for action: ${action}");
//     grecaptcha.execute("${recaptchaKey}", { action: "${action}" })
//       .then(function(token) {
//         alert("[Recaptcha] Token received for action: ${action}", token);
//         window.ReactNativeWebView?.postMessage(JSON.stringify({ payload: token, type: "token" }))
//       })
//       .catch(function (error) {
//         alert("[Recaptcha] Error received for action: ${action}", error);
//         window.ReactNativeWebView?.postMessage(JSON.stringify({ payload: error?.message, type: "error" }))
//       })
//   })
// `

// const loadRecaptcha = (recaptchaKey: string, action: string) => `
//   try {
//     alert("[Recaptcha] Script started for action: ${action}");

//     // if (typeof grecaptcha === 'undefined') {
//     //   alert("[Recaptcha] grecaptcha is undefined — script may not have loaded");
//     //   return;
//     // }

//     grecaptcha.ready(function () {
//       alert("[Recaptcha] grecaptcha.ready triggered for action: ${action}");

//       grecaptcha.execute("${recaptchaKey}", { action: "${action}" })
//         .then(function(token) {
//           alert("[Recaptcha] Token received for action: ${action}\\n" + token);
//           window.ReactNativeWebView?.postMessage(JSON.stringify({ payload: token, type: "token" }));
//         })
//         .catch(function (error) {
//           alert("[Recaptcha] Error received for action: ${action}\\n" + (error?.message || error));
//           window.ReactNativeWebView?.postMessage(JSON.stringify({ payload: error?.message, type: "error" }));
//         });
//     });
//   } catch (e) {
//     alert("[Recaptcha] Exception caught:\\n" + (e?.message || e));
//   }
// `
