import { Box, Button, Flex, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native"
import { useSurveyTracking } from "app/Scenes/Typeform/useSurveyTracking"
import React, { useCallback, useRef, useState } from "react"
import { WebView, WebViewMessageEvent } from "react-native-webview"

interface TypeformRouteParams {
  id: string
}

export const Typeform: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<{ params: TypeformRouteParams }, "params">>()
  const { id } = route.params
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const hasTrackedSubmission = useRef(false)
  const { trackSurveyViewed, trackSurveySubmitted, trackSurveyAbandoned } = useSurveyTracking()

  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const rawData = event.nativeEvent.data
      if (typeof rawData !== "string") return

      let data
      try {
        data = JSON.parse(rawData)
      } catch {
        return
      }

      if (!data?.type) return

      switch (data.type) {
        case "form-submit":
          if (!hasTrackedSubmission.current) {
            hasTrackedSubmission.current = true
            trackSurveySubmitted(id)
            setSubmitted(true)
          }
          break
        case "form-ready":
          trackSurveyViewed(id)
          setLoading(false)
          break
        case "form-close":
          trackSurveyAbandoned(id)
          break
      }
    },
    [id, trackSurveyViewed, trackSurveySubmitted, trackSurveyAbandoned]
  )

  // HTML that loads Typeform SDK and creates an embedded form
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            position: fixed;
          }
          #typeform-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
          }
          #typeform-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
          }
          /* Hide Typeform close button */
          button[aria-label="Close"],
          [data-qa="close-button"] {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div id="typeform-container"></div>
        <script src="https://embed.typeform.com/next/embed.js"></script>
        <script>
          window.tf.createWidget('${id}', {
            container: document.getElementById('typeform-container'),
            hideHeaders: true,
            hideFooter: true,
            opacity: 100,
            width: '100%',
            height: '100%',
            onReady: function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'form-ready' }));
            },
            onSubmit: function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'form-submit' }));
            },
            onClose: function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'form-close' }));
            }
          });
        </script>
      </body>
    </html>
  `

  if (submitted) {
    return (
      <Box flex={1} backgroundColor="white" justifyContent="center" alignItems="center" px={4}>
        <Text variant="lg-display" textAlign="center">
          Thanks for your feedback!
        </Text>
        <Spacer y={2} />
        <Text variant="sm" color="black60" textAlign="center">
          Your response has been recorded.
        </Text>
        <Spacer y={4} />
        <Button block onPress={() => navigation.goBack()}>
          Close
        </Button>
      </Box>
    )
  }

  return (
    <Box flex={1} backgroundColor="white">
      {!!loading && (
        <Flex flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" />
        </Flex>
      )}
      <WebView
        source={{ html }}
        style={{ flex: 1, opacity: loading ? 0 : 1 }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </Box>
  )
}
