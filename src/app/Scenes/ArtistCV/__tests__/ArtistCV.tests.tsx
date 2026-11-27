import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtistCVQueryRenderer } from "app/Scenes/ArtistCV/ArtistCV"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

describe("ArtistCV", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ArtistCVQueryRenderer artistID="artist-id" />,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: true })
  })

  it("opens the artist screen instead with AREnableArtistStory off", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: false })

    await renderWithWrappers(<ArtistCVQueryRenderer artistID="artist-id" />)

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith("/artist/artist-id", { replaceActiveScreen: true })
    )
    expect(screen.toJSON()).toBeNull()
  })

  const show = (internalID: string, name: string, startYear: string, href: string | null) => ({
    node: { internalID, name, startYear, href, is_fair_booth: false, partner: null },
  })

  const soloShows = {
    edges: [
      {
        node: {
          ...show("show-one", "Show One", "2024", "/show/show-one").node,
          partner: { __typename: "Partner", name: "Gallery One" },
        },
      },
      show("show-two", "Show Two", "2019", null),
    ],
  }

  const groupShows = { edges: [show("show-three", "Show Three", "2024", "/show/show-three")] }

  const fairBooths = {
    edges: [show("booth-one", "Gallery One at Fair One", "2024", "/show/booth-one")],
  }

  const resolvers = (shows: { solo: object }): MockResolvers => ({
    // Both queries read the same artist, so it needs one id across them.
    Artist: () => ({ id: "artist-id", name: "Artist Name" }),
    // Checks the field arguments, not the variables: fair booths must have no soloShow at all.
    ShowConnection: ({ args }) => {
      if (args?.atAFair === true && !("soloShow" in args)) return fairBooths
      if (args?.atAFair === false && args?.soloShow === true) return shows.solo
      if (args?.atAFair === false && args?.soloShow === false) return groupShows
      return { edges: [] }
    },
  })

  // The header and list queries start together, so resolve both.
  const renderScreen = async (shows = { solo: soloShows }) => {
    const view = await renderWithRelay(resolvers(shows))
    await view.mockResolveLastOperation(resolvers(shows))
    return view
  }

  it("titles the screen with the artist's name", async () => {
    await renderScreen()

    expect((await screen.findAllByText("Artist Name CV")).length).toBeGreaterThan(0)
  })

  it("lists solo shows first, grouped by year", async () => {
    await renderScreen()

    expect(await screen.findByText("Show One")).toBeOnTheScreen()
    expect(screen.getByText("Gallery One")).toBeOnTheScreen()
    expect(screen.getByText("2024")).toBeOnTheScreen()
    expect(screen.getByText("2019")).toBeOnTheScreen()
    expect(screen.queryByText("Show Three")).not.toBeOnTheScreen()
  })

  it("lists group shows when that pill is picked", async () => {
    const { mockResolveLastOperation } = await renderScreen()

    await fireEvent.press(await screen.findByText("Group shows"))
    await mockResolveLastOperation(resolvers({ solo: soloShows }))

    expect(await screen.findByText("Show Three")).toBeOnTheScreen()
    expect(screen.queryByText("Show One")).not.toBeOnTheScreen()
  })

  it("lists fair booths, without a soloShow filter, when that pill is picked", async () => {
    const { mockResolveLastOperation } = await renderScreen()

    await fireEvent.press(await screen.findByText("Fair booths"))

    expect(
      getMockRelayEnvironment().mock.getMostRecentOperation().request.variables
    ).not.toHaveProperty("soloShow")

    await mockResolveLastOperation(resolvers({ solo: soloShows }))

    expect(await screen.findByText("Gallery One at Fair One")).toBeOnTheScreen()
    expect(screen.queryByText("Show One")).not.toBeOnTheScreen()
  })

  it("opens a show that has an Artsy page", async () => {
    await renderScreen()

    await fireEvent.press(await screen.findByText("Show One"))

    expect(navigate).toHaveBeenCalledWith("/show/show-one")
  })

  it("does not link a CV entry without an Artsy page", async () => {
    await renderScreen()

    await fireEvent.press(await screen.findByText("Show Two"))

    expect(navigate).not.toHaveBeenCalled()
  })

  it("says when the artist has no shows of that kind", async () => {
    await renderScreen({ solo: { edges: [] } })

    expect(await screen.findByText("This artist has no solo shows yet.")).toBeOnTheScreen()
  })
})
