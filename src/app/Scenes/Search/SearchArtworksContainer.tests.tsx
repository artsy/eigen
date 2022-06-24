import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { __renderWithPlaceholderTestUtils__ } from "app/utils/renderWithPlaceholder"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { SearchArtworksQueryRenderer } from "./SearchArtworksContainer"

jest.unmock("react-relay")

describe("SearchArtworks", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => {
    return <SearchArtworksQueryRenderer keyword="keyword" />
  }

  beforeEach(() => {
    mockEnvironment.mockClear()
  })

  it("should render without throwing an error", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        artistNames: "Artist Name",
      }),
    })

    expect(getByText("Artist Name")).toBeTruthy()
  })

  it("should render loading state", () => {
    const { getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByLabelText("Artwork results are loading")).toBeTruthy()
  })

  it("should render error state", () => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = true
    }

    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironment.mock.rejectMostRecentOperation(new Error("Bad connection"))

    expect(getByText("Unable to load")).toBeTruthy()
  })

  it("should track event when an artwork is tapped", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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
