import React, { useEffect, useState } from "react"
import { LayoutAnimation, Linking } from "react-native"
import WebView from "react-native-webview"
import SimpleMarkdown from "simple-markdown"

export const StyledWebView: React.FC<{ body: string }> = ({ body }) => {
  const [webViewHeight, setWebViewHeight] = useState(0)

  const parser = SimpleMarkdown.parserFor(SimpleMarkdown.defaultRules)
  const parseTree = parser(body)

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [webViewHeight])

  // @ts-ignore
  const htmlOutput = SimpleMarkdown.htmlFor(
    // @ts-ignore
    SimpleMarkdown.ruleOutput(SimpleMarkdown.defaultRules, "html")
  )

  const html = `
  <html>
    <head>
      <style>${styles}</style>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    </head>
    <body>
      ${htmlOutput(parseTree)}
    </body>
  </html>
  `

  const injectedJavascript = `(function() {
    window.setTimeout(_ => window.ReactNativeWebView.postMessage(JSON.stringify(document.body.scrollHeight)), 500)
  })();`

  return (
    <WebView
      injectedJavaScript={injectedJavascript}
      onMessage={(e) => {
        const msg = decodeURIComponent(decodeURIComponent(e.nativeEvent.data))
        setWebViewHeight(parseInt(msg, 10))
      }}
      decelerationRate="normal"
      onShouldStartLoadWithRequest={(e) => {
        if (e.navigationType === "click") {
          Linking.openURL(e.url)
          return false
        } else {
          return true
        }
      }}
      scalesPageToFit={false}
      source={{ html }}
      style={{ height: webViewHeight, padding: 0, margin: 0, marginBottom: 10 }}
      scrollEnabled={false}
    />
  )
}

const styles = `
@font-face {
  font-family: "unica";
  src: url('https://webfonts.artsy.net/ll-unica77_regular.woff2')
    format("woff");
}
  body {
    font-size: 15px;
    font-family: 'unica';
    line-height: 1.5;
    margin: 0;
  }

  strong {
    font-size: 15px;
    font-family: 'unica';
    letter-spacing: -0.5px;
    line-height: 1.5;
    margin: 0;
  }

  a, a:visited {
    color: black;
  }

  p, .paragraph:not(:last-of-type) {
    margin-bottom: 20px;
  }
`
