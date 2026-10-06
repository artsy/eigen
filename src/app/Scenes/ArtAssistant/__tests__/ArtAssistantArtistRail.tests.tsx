import { act, fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ArtAssistantArtistRailQuery } from "__generated__/ArtAssistantArtistRailQuery.graphql"
import { ArtAssistantArtistRail } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtistRail"
import { navigate } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ArtAssistantArtistRail", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders artist cards", async () => {
    renderReadyRail()

    await waitForElementToBeRemoved(() => screen.queryByTestId("art-assistant-artist-rail-loading"))

    expect(screen.getByTestId("art-assistant-artist-rail")).toBeOnTheScreen()
    expect(screen.getByText("Jean-Michel Basquiat")).toBeOnTheScreen()
    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
  })

  it("keeps the order the answer chose, whatever order the server answered in", async () => {
    renderReadyRail()

    await waitForElementToBeRemoved(() => screen.queryByTestId("art-assistant-artist-rail-loading"))

    // The mocked response comes back reversed, so this order can only come from the rail.
    expect(screen.getByTestId("art-assistant-artist-rail")).toHaveTextContent(
      /Jean-Michel Basquiat[\s\S]*Andy Warhol/
    )
  })

  it("navigates to the artist", async () => {
    renderReadyRail()

    await waitForElementToBeRemoved(() => screen.queryByTestId("art-assistant-artist-rail-loading"))

    fireEvent.press(screen.getByText("Andy Warhol"))

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  it("renders a skeleton while the query is pending", () => {
    renderWithWrappers(<ArtAssistantArtistRail artistIDs={ARTIST_IDS} />)

    expect(screen.getByTestId("art-assistant-artist-rail-loading")).toBeOnTheScreen()
  })

  it("renders empty state for a section with no artists", () => {
    renderWithWrappers(<ArtAssistantArtistRail artistIDs={[]} />)

    expect(screen.getByText("No matching artists found.")).toBeOnTheScreen()
  })

  it("renders empty state when none of the cited artists resolve", async () => {
    const { renderWithRelay } = setupTestWrapper<ArtAssistantArtistRailQuery>({
      Component: () => <ArtAssistantArtistRail artistIDs={ARTIST_IDS} />,
    })

    renderWithRelay({ Query: () => ({ artistsConnection: { edges: [] } }) })

    await waitForElementToBeRemoved(() => screen.queryByTestId("art-assistant-artist-rail-loading"))

    expect(screen.getByText("No matching artists found.")).toBeOnTheScreen()
  })

  it("renders an error state when the query fails", async () => {
    renderWithWrappers(<ArtAssistantArtistRail artistIDs={ARTIST_IDS} />)

    act(() => {
      getMockRelayEnvironment().mock.rejectMostRecentOperation(new Error("Artists unavailable"))
    })

    expect(await screen.findByText("Artist suggestions are unavailable.")).toBeOnTheScreen()
  })
})

const renderReadyRail = () => {
  const { renderWithRelay } = setupTestWrapper<ArtAssistantArtistRailQuery>({
    Component: () => <ArtAssistantArtistRail artistIDs={ARTIST_IDS} />,
  })

  // Deliberately reversed: the rail, not Gravity, owns the display order.
  return renderWithRelay({ Query: () => mockResponse })
}

const ARTIST_IDS = ["artist-id-1", "artist-id-2"]

const artistNode = (internalID: string, name: string, slug: string) => ({
  id: `relay-${internalID}`,
  internalID,
  slug,
  href: `/artist/${slug}`,
  name,
  formattedNationalityAndBirthday: "American",
  isFollowed: false,
  basedOn: null,
  filterArtworksConnection: { edges: [] },
})

const mockResponse = {
  artistsConnection: {
    edges: [
      { node: artistNode(ARTIST_IDS[1], "Andy Warhol", "andy-warhol") },
      { node: artistNode(ARTIST_IDS[0], "Jean-Michel Basquiat", "jean-michel-basquiat") },
    ],
  },
}
