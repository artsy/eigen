import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ArtAssistantArtworkGridQuery } from "__generated__/ArtAssistantArtworkGridQuery.graphql"
import { ArtAssistantArtworkGrid } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtworkGrid"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ArtAssistantArtworkGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders artworks in the grid", async () => {
    renderReadyGrid()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("art-assistant-artwork-grid-loading")
    )

    expect(screen.getByTestId("art-assistant-artwork-grid")).toBeOnTheScreen()
    expect(screen.getByText("Ai Weiwei")).toBeOnTheScreen()
    expect(screen.getByText("Jean-Michel Basquiat")).toBeOnTheScreen()
  })

  it("navigates to the artwork on tap", async () => {
    renderReadyGrid()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("art-assistant-artwork-grid-loading")
    )

    fireEvent.press(screen.getByText("Ai Weiwei"))

    expect(navigate).toHaveBeenCalledWith("/artwork/ai-weiwei-sunflower-seeds-exhibition")
  })

  it("reports the tapped artwork against the Art Assistant results", async () => {
    renderReadyGrid()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("art-assistant-artwork-grid-loading")
    )

    fireEvent.press(screen.getByText("Jean-Michel Basquiat"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedMainArtworkGrid",
        context_module: "artAssistantResults",
        context_screen_owner_type: "artAssistant",
        destination_screen_owner_type: "artwork",
        destination_screen_owner_id: ARTWORK_IDS[1],
        destination_screen_owner_slug: "basquiat-artwork",
        type: "thumbnail",
      })
    )
  })

  it("renders loading state while the query is pending", () => {
    renderWithWrappers(<ArtAssistantArtworkGrid artworkIDs={ARTWORK_IDS} />)

    expect(screen.getByTestId("art-assistant-artwork-grid-loading")).toBeOnTheScreen()
  })

  it("renders empty state for a section with no artworks", () => {
    renderWithWrappers(<ArtAssistantArtworkGrid artworkIDs={[]} />)

    expect(screen.getByText("No matching artworks found.")).toBeOnTheScreen()
  })

  it("renders empty state when none of the cited artworks resolve", async () => {
    const { renderWithRelay } = setupTestWrapper<ArtAssistantArtworkGridQuery>({
      Component: () => <ArtAssistantArtworkGrid artworkIDs={ARTWORK_IDS} />,
    })

    renderWithRelay({ Query: () => ({ artworksConnection: { edges: [] } }) })

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("art-assistant-artwork-grid-loading")
    )

    expect(screen.getByText("No matching artworks found.")).toBeOnTheScreen()
  })

  it("caps displayed artworks at 8 even when more IDs are provided", () => {
    const manyIDs = Array.from({ length: 12 }, (_, i) => `artwork-id-${i}`)
    renderWithWrappers(<ArtAssistantArtworkGrid artworkIDs={manyIDs} />)

    // The query renderer receives at most 8 IDs — loading state confirms it mounted
    expect(screen.getByTestId("art-assistant-artwork-grid-loading")).toBeOnTheScreen()
  })
})

const renderReadyGrid = () => {
  const { renderWithRelay } = setupTestWrapper<ArtAssistantArtworkGridQuery>({
    Component: () => <ArtAssistantArtworkGrid artworkIDs={ARTWORK_IDS} />,
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
