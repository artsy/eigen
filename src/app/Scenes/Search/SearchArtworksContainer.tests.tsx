import { fireEvent } from "@testing-library/react-native"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import {
  rejectMostRecentRelayOperation,
  resolveMostRecentRelayOperation,
} from "app/tests/resolveMostRecentRelayOperation"
import { __renderWithPlaceholderTestUtils__ } from "app/utils/renderWithPlaceholder"
import { SearchArtworksQueryRenderer } from "./SearchArtworksContainer"

describe("SearchArtworks", () => {
  const TestRenderer = () => {
    return <SearchArtworksQueryRenderer keyword="keyword" />
  }

  it("should render without throwing an error", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Artwork: () => ({
        artistNames: "Artist Name",
      }),
    })

    expect(getByText("Artist Name")).toBeTruthy()
  })

  it("should render loading state", () => {
    const { getByLabelText } = renderWithWrappers(<TestRenderer />)

    expect(getByLabelText("Artwork results are loading")).toBeTruthy()
  })

  it("should render error state", () => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = true
    }

    const { getByText } = renderWithWrappers(<TestRenderer />)

    rejectMostRecentRelayOperation(new Error("Bad connection"))

    expect(getByText("Unable to load")).toBeTruthy()
  })

  it("should track event when an artwork is tapped", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Artwork: () => ({
        internalID: "internalID",
        slug: "artworkSlug",
        artistNames: "Artist Name",
      }),
    })

    fireEvent.press(getByText("Artist Name"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "tappedMainArtworkGrid",
          "context_module": "artworkGrid",
          "context_screen": "Search",
          "context_screen_owner_id": undefined,
          "context_screen_owner_slug": undefined,
          "context_screen_owner_type": "search",
          "destination_screen_owner_id": "internalID",
          "destination_screen_owner_slug": "artworkSlug",
          "destination_screen_owner_type": "artwork",
          "position": 0,
          "query": "keyword",
          "sort": "-decayed_merch",
          "type": "thumbnail",
        },
      ]
    `)
  })
})
