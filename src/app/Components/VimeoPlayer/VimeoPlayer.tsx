import { useEnvironment } from "app/utils/hooks/useEnvironment"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { WebView, WebViewMessageEvent } from "react-native-webview"

const PLAY_SCRIPT = "window.playVideo && window.playVideo(); true;"

interface VimeoPlayerHTMLOptions {
  videoId: string
  hash?: string
  loop: boolean
  preload: boolean
}

/*
  A Vimeo iframe driven by Vimeo's player.js, so the app can start playback with `playVideo`.
  It tells the app when playback starts, including from the player's own button.
*/
const vimeoPlayerHTML = ({ videoId, hash, loop, preload }: VimeoPlayerHTMLOptions) => {
  const params = [
    "autoplay=0",
    "playsinline=1",
    "transparent=1",
    loop ? "loop=1" : null,
    preload ? "preload=auto" : null,
    hash ? `h=${encodeURIComponent(hash)}` : null,
  ]
    .filter(Boolean)
    .join("&")
  const src = `https://player.vimeo.com/video/${encodeURIComponent(videoId)}?${params}`

  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; height: 100%; overflow: hidden; background: transparent; }
      iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
    </style>
    <script src="https://player.vimeo.com/api/player.js"></script>
  </head>
  <body>
    <iframe id="player" src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
    <script>
      var player = new Vimeo.Player(document.getElementById("player"))
      player.on("play", function () { window.ReactNativeWebView.postMessage("play") })
      window.playVideo = function () { player.play() }
    </script>
  </body>
</html>`
}

interface VimeoPlayerProps {
  videoId: string
  /** The `h` hash an unlisted video needs before Vimeo will play it */
  hash?: string
  loop?: boolean
  /** Loads the first seconds of video straight away, so playback starts sooner */
  preload?: boolean
  /** Playback started, from `play()` or from the player's own button */
  onPlay?: () => void
}

export interface VimeoPlayerRef {
  play: () => void
}

export const VimeoPlayer = forwardRef<VimeoPlayerRef, VimeoPlayerProps>(
  ({ videoId, hash, loop = false, preload = false, onPlay }, ref) => {
    const { webURL } = useEnvironment()
    const webViewRef = useRef<WebView>(null)
    // Set by play(), so a page that finishes loading afterwards still starts playing
    const wantsToPlay = useRef(false)

    const injectPlay = () => {
      webViewRef.current?.injectJavaScript(PLAY_SCRIPT)
    }

    useImperativeHandle(ref, () => ({
      play: () => {
        wantsToPlay.current = true
        injectPlay()
      },
    }))

    const handleMessage = (event: WebViewMessageEvent) => {
      if (event.nativeEvent.data === "play") {
        onPlay?.()
      }
    }

    return (
      <WebView
        ref={webViewRef}
        testID="vimeo-player-webview"
        source={{ html: vimeoPlayerHTML({ videoId, hash, loop, preload }), baseUrl: webURL }}
        style={{ flex: 1, backgroundColor: "transparent" }}
        // No `allowsInlineMediaPlayback`, so iOS opens its fullscreen player on play
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        scrollEnabled={false}
        bounces={false}
        onMessage={handleMessage}
        onLoadEnd={() => {
          if (wantsToPlay.current) {
            injectPlay()
          }
        }}
      />
    )
  }
)
