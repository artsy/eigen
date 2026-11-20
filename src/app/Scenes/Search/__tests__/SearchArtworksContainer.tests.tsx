import { fireEvent, screen } from "@testing-library/react-native"
import { SearchArtworksQueryRenderer } from "app/Scenes/Search/SearchArtworksContainer"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { __renderWithPlaceholderTestUtils__ } from "app/utils/renderWithPlaceholder"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

describe("SearchArtworks", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  const TestRenderer = () => {
    return <SearchArtworksQueryRenderer keyword="keyword" />
  }

  it("should render without throwing an error", async () => {
    await renderWithWrappers(<TestRenderer />)

    await resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        artistNames: "Artist Name",
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByText("Artist Name")).toBeTruthy()
  })

  it("should render loading state", async () => {
    await renderWithWrappers(<TestRenderer />)

    expect(screen.getByLabelText("Artwork results are loading")).toBeTruthy()
  })

  it("should render error state", async () => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = true
    }

    await renderWithWrappers(<TestRenderer />)

    await rejectMostRecentRelayOperation(mockEnvironment, new Error("Bad connection"))

    expect(screen.getByText("Something went wrong. Please check back later.")).toBeTruthy()
  })

  it("should track event when an artwork is tapped", async () => {
    await renderWithWrappers(<TestRenderer />)

    await resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        internalID: "internalID",
        slug: "artworkSlug",
        artistNames: "Artist Name",
        collectorSignals: null,
      }),
    })

    await fireEvent.press(screen.getByText("Artist Name"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
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
