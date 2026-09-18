import { screen } from "@testing-library/react-native"
import { FeatureVideo } from "app/Scenes/Feature/FeatureVideo"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Vimeo } from "react-native-vimeo-iframe"

jest.mock("react-native-vimeo-iframe", () => ({
  Vimeo: jest.fn(() => null),
}))

describe("FeatureVideo", () => {
  const VimeoMock = Vimeo as unknown as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const propsFor = (call: number) => VimeoMock.mock.calls[call][0]

  /*
    Videos uploaded through the CMS are unlisted, and Vimeo only plays those for a request
    carrying the `h` hash from the player url. Dropping it makes the player answer
    "Sorry, we're having a little trouble" while the same url plays in a browser.
  */
  it("passes an unlisted video's hash through to the player", () => {
    renderWithWrappers(
      <FeatureVideo
        videoUrl="https://player.vimeo.com/video/1227796325?h=e76414347e&width=400&height=300"
        width={400}
        height={300}
      />
    )

    expect(VimeoMock).toHaveBeenCalled()
    expect(propsFor(0).videoId).toBe("1227796325")
    expect(propsFor(0).params).toContain("h=e76414347e")
  })

  // A public video has no hash, so the player keeps the bare url it had before.
  it("sends no params for a video without a hash", () => {
    renderWithWrappers(
      <FeatureVideo videoUrl="https://player.vimeo.com/video/76979871" width={400} height={300} />
    )

    expect(VimeoMock).toHaveBeenCalled()
    expect(propsFor(0).videoId).toBe("76979871")
    expect(propsFor(0).params).toBeUndefined()
  })

  it("renders nothing for a url the player cannot handle", () => {
    renderWithWrappers(
      <FeatureVideo videoUrl="https://example.com/clip.mp4" width={400} height={300} />
    )

    expect(VimeoMock).not.toHaveBeenCalled()
    expect(screen.queryByTestId("FeatureVideo")).not.toBeOnTheScreen()
  })
})
