import { fireEvent, screen } from "@testing-library/react-native"
import {
  ImageCarouselContext,
  useNewImageCarouselContext,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
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

const mockUseVimeoVideoMetadata = jest.fn()

jest.mock("app/utils/videoHelpers", () => ({
  ...jest.requireActual("app/utils/videoHelpers"),
  useVimeoVideoMetadata: () => mockUseVimeoVideoMetadata(),
}))

const withCover = { coverImage: "https://i.vimeocdn.com/cover.jpg", isCoverUnavailable: false }

const withoutCover = { coverImage: undefined, isCoverUnavailable: true }

const PLAY_SCRIPT = "window.playVideo && window.playVideo(); true;"

const TestWrapper = ({ index }: { index: number }) => {
  const context = useNewImageCarouselContext({ images: [] })

  return (
    <ImageCarouselContext.Provider value={context}>
      <ImageCarouselVimeoVideo
        index={index}
        width={300}
        height={200}
        vimeoUrl="https://player.vimeo.com/video/696646345?h=cb5e5856b6"
      />
    </ImageCarouselContext.Provider>
  )
}

describe("ImageCarouselVimeoVideo", () => {
  beforeEach(() => {
    mockUseVimeoVideoMetadata.mockReturnValue(withCover)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("shows the player without our play button while there is no cover", () => {
    mockUseVimeoVideoMetadata.mockReturnValue({ coverImage: undefined, isCoverUnavailable: false })
    renderWithWrappers(<TestWrapper index={0} />)

    expect(screen.getByTestId("vimeo-player-webview")).toBeOnTheScreen()
    expect(screen.queryByLabelText("Vimeo Play Button")).not.toBeOnTheScreen()
  })

  it("loads the player of a far away slide once the cover request fails", () => {
    mockUseVimeoVideoMetadata.mockReturnValue(withoutCover)
    renderWithWrappers(<TestWrapper index={3} />)

    expect(screen.getByTestId("vimeo-player-webview")).toBeOnTheScreen()
  })

  it("hides the cover once playback starts from the player's own button", () => {
    renderWithWrappers(<TestWrapper index={0} />)

    fireEvent(screen.getByTestId("vimeo-player-webview"), "message", {
      nativeEvent: { data: "play" },
    })

    expect(screen.queryByLabelText("Vimeo Play Button")).not.toBeOnTheScreen()
  })

  it("loads the player behind the cover when the slide is next to the current one", () => {
    renderWithWrappers(<TestWrapper index={1} />)

    expect(screen.getByTestId("vimeo-player-webview")).toBeOnTheScreen()
    expect(screen.getByLabelText("Vimeo Play Button")).toBeOnTheScreen()
  })

  it("does not load the player when the slide is far from the current one", () => {
    renderWithWrappers(<TestWrapper index={3} />)

    expect(screen.queryByTestId("vimeo-player-webview")).not.toBeOnTheScreen()
  })

  it("hides the cover and starts the player on tap", () => {
    renderWithWrappers(<TestWrapper index={0} />)

    fireEvent.press(screen.getByLabelText("Vimeo Play Button"))

    expect(screen.queryByLabelText("Vimeo Play Button")).not.toBeOnTheScreen()
    expect(mockInjectJavaScript).toHaveBeenCalledWith(PLAY_SCRIPT)
  })
})
