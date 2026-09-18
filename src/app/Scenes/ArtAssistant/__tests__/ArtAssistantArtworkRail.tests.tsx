import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ArtAssistantArtworkRailQuery } from "__generated__/ArtAssistantArtworkRailQuery.graphql"
import { ArtAssistantArtworkRail } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtworkRail"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ArtAssistantArtworkRail", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders artworks in the standard artwork rail", async () => {
    renderReadyRail()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("art-assistant-artwork-rail-loading")
    )

    expect(screen.getByTestId("art-assistant-artwork-rail")).toBeOnTheScreen()
    expect(screen.getByText("Ai Weiwei")).toBeOnTheScreen()
    expect(screen.getByText("Jean-Michel Basquiat")).toBeOnTheScreen()
  })

  it("navigates to the artwork from the standard card", async () => {
    renderReadyRail()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("art-assistant-artwork-rail-loading")
    )

    fireEvent.press(screen.getByText("Ai Weiwei"))

    expect(navigate).toHaveBeenCalledWith("/artwork/ai-weiwei-sunflower-seeds-exhibition")
  })

  it("reports the tapped artwork against the Art Assistant results", async () => {
    renderReadyRail()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("art-assistant-artwork-rail-loading")
    )

    fireEvent.press(screen.getByText("Jean-Michel Basquiat"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "artAssistantResults",
      context_screen_owner_type: "artAssistant",
      destination_screen_owner_type: "artwork",
      destination_screen_owner_id: ARTWORK_IDS[1],
      destination_screen_owner_slug: "basquiat-artwork",
      horizontal_slide_position: 1,
      type: "thumbnail",
    })
  })

  it("renders loading state using the standard rail placeholder", () => {
    renderWithWrappers(<ArtAssistantArtworkRail state={{ status: "loading" }} />)

    expect(screen.getByTestId("art-assistant-artwork-rail-loading")).toBeOnTheScreen()
  })

  it("renders empty state", () => {
    renderWithWrappers(<ArtAssistantArtworkRail state={{ status: "empty" }} />)

    expect(screen.getByText("No matching artworks found.")).toBeOnTheScreen()
  })

  it("renders empty state for a completed response without artworks", () => {
    renderWithWrappers(<ArtAssistantArtworkRail state={{ status: "ready", artworkIDs: [] }} />)

    expect(screen.getByText("No matching artworks found.")).toBeOnTheScreen()
  })

  it("renders error state", () => {
    renderWithWrappers(
      <ArtAssistantArtworkRail state={{ status: "error", message: "Could not load artworks." }} />
    )

    expect(screen.getByText("Could not load artworks.")).toBeOnTheScreen()
  })
})

const renderReadyRail = () => {
  const { renderWithRelay } = setupTestWrapper<ArtAssistantArtworkRailQuery>({
    Component: () => (
      <ArtAssistantArtworkRail state={{ status: "ready", artworkIDs: ARTWORK_IDS }} />
    ),
  })

  return renderWithRelay({ Query: () => mockResponse })
}

const ARTWORK_IDS = ["artwork-id-1", "artwork-id-2"]

const mockResponse = {
  artworksConnection: {
    edges: [
      {
        node: {
          id: "artwork-1",
          internalID: ARTWORK_IDS[0],
          slug: "ai-weiwei-sunflower-seeds-exhibition",
          href: "/artwork/ai-weiwei-sunflower-seeds-exhibition",
          artistNames: "Ai Weiwei",
          title: "Sunflower Seeds Exhibition",
          date: "2010",
          saleMessage: "US$1,750",
          image: {
            aspectRatio: 1.27,
            url: "https://example.com/ai-weiwei.jpg",
          },
          collectorSignals: null,
          sale: null,
          saleArtwork: null,
        },
      },
      {
        node: {
          id: "artwork-2",
          internalID: ARTWORK_IDS[1],
          slug: "basquiat-artwork",
          href: "/artwork/basquiat-artwork",
          artistNames: "Jean-Michel Basquiat",
          title: "Hollywood Africans Triptych Skate Decks",
          date: "ca. 2014",
          saleMessage: "£1,095",
          image: {
            aspectRatio: 1,
            url: "https://example.com/basquiat.jpg",
          },
          collectorSignals: null,
          sale: null,
          saleArtwork: null,
        },
      },
    ],
  },
}
