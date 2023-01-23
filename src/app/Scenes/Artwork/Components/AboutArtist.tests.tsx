import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"
import { AboutArtist } from "./AboutArtist"

jest.unmock("react-relay")

describe("AboutArtist", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders about artist correctly for one artist", () => {
    const { queryByText } = renderWithHookWrappersTL(
      <AboutArtist artwork={ArtworkFixture as any} />,
      mockEnvironment
    )

    expect(queryByText("About the artist")).toBeTruthy()
    expect(queryByText("Abbas Kiarostami")).toBeTruthy()
  })

  it("renders about artist correctly for more than one artists", () => {
    const artworkMultipleArtists = {
      ...ArtworkFixture,
      artists: ArtworkFixture.artists.concat(ArtworkFixture.artists),
    }
    const { queryAllByText, queryByText } = renderWithHookWrappersTL(
      <AboutArtist artwork={artworkMultipleArtists as any} />
    )

    expect(queryByText("About the artists")).toBeTruthy()
    expect(queryAllByText("Abbas Kiarostami")).toHaveLength(2)
  })
})
