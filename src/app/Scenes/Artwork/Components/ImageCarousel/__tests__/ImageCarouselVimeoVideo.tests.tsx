import { fireEvent, screen } from "@testing-library/react-native"
import { ImageCarouselVimeoVideo } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselVimeoVideo"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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

jest.mock("app/utils/videoHelpers", () => ({
  ...jest.requireActual("app/utils/videoHelpers"),
  useVimeoVideoMetadata: () => ({ coverImage: "https://i.vimeocdn.com/cover.jpg" }),
}))

const PLAY_SCRIPT = "window.playVideo && window.playVideo(); true;"

const renderVideo = () =>
  renderWithWrappers(
    <ImageCarouselVimeoVideo
      width={300}
      height={200}
      vimeoUrl="https://player.vimeo.com/video/696646345?h=cb5e5856b6"
    />
  )

describe("ImageCarouselVimeoVideo", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("shows the cover without loading the player", () => {
    renderVideo()

    expect(screen.getByLabelText("Vimeo Play Button")).toBeOnTheScreen()
    expect(screen.queryByTestId("vimeo-player-webview")).not.toBeOnTheScreen()
  })

  it("loads and starts the player on tap", () => {
    renderVideo()

    fireEvent.press(screen.getByLabelText("Vimeo Play Button"))

    expect(screen.queryByLabelText("Vimeo Play Button")).not.toBeOnTheScreen()
    expect(screen.getByTestId("vimeo-player-webview")).toBeOnTheScreen()
    expect(mockInjectJavaScript).toHaveBeenCalledWith(PLAY_SCRIPT)
  })
})
