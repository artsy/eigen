import { act, fireEvent, screen } from "@testing-library/react-native"
import { VimeoPlayer, VimeoPlayerRef } from "app/Components/VimeoPlayer/VimeoPlayer"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createRef } from "react"

const mockInjectJavaScript = jest.fn()

// The global mock forwards the ref to a View, which has no `injectJavaScript`
jest.mock("react-native-webview", () => {
  const React = require("react")
  const { View } = require("react-native")

  const MockWebView = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ injectJavaScript: mockInjectJavaScript }))
    return <View {...props} />
  })

  return { __esModule: true, default: MockWebView, WebView: MockWebView }
})

const PLAY_SCRIPT = "window.playVideo && window.playVideo(); true;"

const playerHTML = (): string => screen.getByTestId("vimeo-player-webview").props.source.html

describe("VimeoPlayer", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("embeds the video with its hash", () => {
    renderWithWrappers(<VimeoPlayer videoId="1227796325" hash="e76414347e" />)

    expect(playerHTML()).toContain(
      "https://player.vimeo.com/video/1227796325?autoplay=0&playsinline=1&transparent=1&h=e76414347e"
    )
  })

  it("only loops and preloads when asked to", () => {
    renderWithWrappers(<VimeoPlayer videoId="76979871" />)

    expect(playerHTML()).not.toContain("loop=1")
    expect(playerHTML()).not.toContain("preload=auto")

    renderWithWrappers(<VimeoPlayer videoId="76979871" loop preload />)

    expect(screen.getAllByTestId("vimeo-player-webview")[1].props.source.html).toContain(
      "loop=1&preload=auto"
    )
  })

  it("starts playback on play()", () => {
    const ref = createRef<VimeoPlayerRef>()
    renderWithWrappers(<VimeoPlayer ref={ref} videoId="76979871" />)

    act(() => ref.current?.play())

    expect(mockInjectJavaScript).toHaveBeenCalledWith(PLAY_SCRIPT)
  })

  it("starts playback once the page loads when play() came first", () => {
    const ref = createRef<VimeoPlayerRef>()
    renderWithWrappers(<VimeoPlayer ref={ref} videoId="76979871" />)

    act(() => ref.current?.play())
    fireEvent(screen.getByTestId("vimeo-player-webview"), "loadEnd")

    expect(mockInjectJavaScript).toHaveBeenCalledTimes(2)
    expect(mockInjectJavaScript).toHaveBeenLastCalledWith(PLAY_SCRIPT)
  })

  it("does not start playback on load without play()", () => {
    renderWithWrappers(<VimeoPlayer videoId="76979871" />)

    fireEvent(screen.getByTestId("vimeo-player-webview"), "loadEnd")

    expect(mockInjectJavaScript).not.toHaveBeenCalled()
  })

  it("reports playback starting", () => {
    const onPlay = jest.fn()
    renderWithWrappers(<VimeoPlayer videoId="76979871" onPlay={onPlay} />)

    fireEvent(screen.getByTestId("vimeo-player-webview"), "message", {
      nativeEvent: { data: "play" },
    })

    expect(onPlay).toHaveBeenCalledTimes(1)
  })
})
