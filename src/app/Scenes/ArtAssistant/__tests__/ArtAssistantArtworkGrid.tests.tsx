import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtAssistantArtworkGridQuery } from "__generated__/ArtAssistantArtworkGridQuery.graphql"
import { ArtAssistantArtworkGrid } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtworkGrid"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL, renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtAssistantArtworkGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders artworks in the grid", async () => {
    await renderReadyGrid()

    await waitFor(() =>
      expect(screen.queryByTestId("art-assistant-artwork-grid-loading")).not.toBeOnTheScreen()
    )

    expect(screen.getByTestId("art-assistant-artwork-grid")).toBeOnTheScreen()
    expect(screen.getByText("Ai Weiwei")).toBeOnTheScreen()
    expect(screen.getByText("Jean-Michel Basquiat")).toBeOnTheScreen()
  })

  it("navigates to the artwork on tap", async () => {
    await renderReadyGrid()

    await waitFor(() =>
      expect(screen.queryByTestId("art-assistant-artwork-grid-loading")).not.toBeOnTheScreen()
    )

    await fireEvent.press(screen.getByText("Ai Weiwei"))

    expect(navigate).toHaveBeenCalledWith("/artwork/ai-weiwei-sunflower-seeds-exhibition")
  })

  it("reports the tapped artwork against the Art Assistant results", async () => {
    await renderReadyGrid()

    await waitFor(() =>
      expect(screen.queryByTestId("art-assistant-artwork-grid-loading")).not.toBeOnTheScreen()
    )

    await fireEvent.press(screen.getByText("Jean-Michel Basquiat"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedMainArtworkGrid",
        context_module: "artAssistantResults",
        context_screen_owner_type: "artAssistant",
        destination_screen_owner_type: "artwork",
        destination_screen_owner_id: ARTWORK_IDS[1],
        destination_screen_owner_slug: "basquiat-artwork",
        position: 1,
        type: "thumbnail",
      })
    )
  })

  it("renders loading state while the query is pending", async () => {
    await renderWithWrappers(<ArtAssistantArtworkGrid artworkIDs={ARTWORK_IDS} />)

    expect(screen.getByTestId("art-assistant-artwork-grid-loading")).toBeOnTheScreen()
  })

  it("renders empty state for a section with no artworks", async () => {
    await renderWithWrappers(<ArtAssistantArtworkGrid artworkIDs={[]} />)

    expect(screen.getByText("No matching artworks found.")).toBeOnTheScreen()
  })

  it("renders empty state when none of the cited artworks resolve", async () => {
    const { renderWithRelay } = setupTestWrapper<ArtAssistantArtworkGridQuery>({
      Component: () => <ArtAssistantArtworkGrid artworkIDs={ARTWORK_IDS} />,
    })

    await renderWithRelay({ Query: () => ({ artworksConnection: { edges: [] } }) })

    await waitFor(() =>
      expect(screen.queryByTestId("art-assistant-artwork-grid-loading")).not.toBeOnTheScreen()
    )

    expect(screen.getByText("No matching artworks found.")).toBeOnTheScreen()
  })

  it("caps the query at 8 IDs even when more are provided", async () => {
    const manyIDs = Array.from({ length: 12 }, (_, i) => `artwork-id-${i}`)
    const environment = createMockEnvironment()

    await renderWithHookWrappersTL(<ArtAssistantArtworkGrid artworkIDs={manyIDs} />, environment)

    const { variables } = environment.mock.getMostRecentOperation().request
    expect(variables.artworkIDs).toEqual(manyIDs.slice(0, 8))
    expect(variables.first).toBe(8)
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
