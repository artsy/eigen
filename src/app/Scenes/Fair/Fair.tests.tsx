import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { NavigationalTabs, Tab } from "app/Components/LegacyTabs"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { FairCollectionsFragmentContainer } from "./Components/FairCollections"
import { FairEditorialFragmentContainer } from "./Components/FairEditorial"
import { FairExhibitorsFragmentContainer } from "./Components/FairExhibitors"
import { FairFollowedArtistsRailFragmentContainer } from "./Components/FairFollowedArtistsRail"
import { FairHeaderFragmentContainer } from "./Components/FairHeader"
import { FairScreen } from "./Fair"

describe("Fair", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <FairScreen fairID="art-basel-hong-kong-2020" />,
  })

  it("renders without throwing an error", async () => {
    renderWithRelay({
      Fair: () => ({
        isActive: true,
        name: "Art Basel Hong Kong 2020",
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

    expect(screen.queryByText("Art Basel Hong Kong 2020")).toBeOnTheScreen()
  })

  it("renders the necessary components when fair is active", async () => {
    renderWithRelay({
      Fair: () => ({
        isActive: true,
        counts: {
          artworks: 42,
          partnerShows: 42,
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

    expect(screen.UNSAFE_queryAllByType(FairHeaderFragmentContainer)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(FairEditorialFragmentContainer)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(FairCollectionsFragmentContainer)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(NavigationalTabs)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(FairExhibitorsFragmentContainer)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(FairFollowedArtistsRailFragmentContainer)).toHaveLength(1)
  })

  it("renders fewer components when fair is inactive", async () => {
    renderWithRelay({
      Fair: () => ({
        isActive: false,
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

    expect(screen.UNSAFE_queryAllByType(FairHeaderFragmentContainer)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(FairEditorialFragmentContainer)).toHaveLength(1)
    expect(screen.queryByText("This fair is currently unavailable.")).toBeOnTheScreen()

    expect(screen.UNSAFE_queryAllByType(FairCollectionsFragmentContainer)).toHaveLength(0)
    expect(screen.UNSAFE_queryAllByType(NavigationalTabs)).toHaveLength(0)
    expect(screen.UNSAFE_queryAllByType(FairExhibitorsFragmentContainer)).toHaveLength(0)
    expect(screen.UNSAFE_queryAllByType(FairFollowedArtistsRailFragmentContainer)).toHaveLength(0)
  })

  it("does not render components when there is no data for them", async () => {
    renderWithRelay({
      Fair: () => ({
        articles: {
          edges: [],
        },
        marketingCollections: [],
        counts: {
          artworks: 0,
          partnerShows: 0,
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

    expect(screen.UNSAFE_queryAllByType(FairHeaderFragmentContainer)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(FairEditorialFragmentContainer)).toHaveLength(0)
    expect(screen.UNSAFE_queryAllByType(FairCollectionsFragmentContainer)).toHaveLength(0)
    expect(screen.UNSAFE_queryAllByType(NavigationalTabs)).toHaveLength(0)
    expect(screen.UNSAFE_queryAllByType(FairExhibitorsFragmentContainer)).toHaveLength(0)
  })

  it("renders the collections component if there are collections", async () => {
    renderWithRelay({
      Fair: () => ({
        isActive: true,
        marketingCollections: [
          {
            slug: "great-collection",
          },
        ],
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

    expect(screen.UNSAFE_queryAllByType(FairCollectionsFragmentContainer)).toHaveLength(1)
  })

  it("renders the editorial component if there are articles", async () => {
    renderWithRelay({
      Fair: () => ({
        isActive: true,
        articles: {
          edges: [
            {
              __typename: "Article",
              node: {
                slug: "great-article",
              },
            },
          ],
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

    expect(screen.UNSAFE_queryAllByType(FairEditorialFragmentContainer)).toHaveLength(1)
  })

  it("renders the artists you follow rail if there are any artworks", async () => {
    renderWithRelay({
      Fair: () => ({
        isActive: true,
        followedArtistArtworks: {
          edges: [
            {
              __typename: "FilterArtworkEdge",
              artwork: {
                slug: "an-artwork",
              },
            },
          ],
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

    expect(screen.UNSAFE_queryAllByType(FairFollowedArtistsRailFragmentContainer)).toHaveLength(1)
  })

  it("renders the artworks/exhibitors tabs if there are artworks and exhibitors", async () => {
    renderWithRelay({
      Fair: () => ({
        isActive: true,
        counts: {
          artworks: 100,
          partnerShows: 20,
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

    expect(screen.UNSAFE_queryAllByType(Tab)).toHaveLength(2)

    expect(screen.queryByText("Artworks")).toBeOnTheScreen()
    expect(screen.queryByText("Exhibitors")).toBeOnTheScreen()
  })

  describe("tracks", () => {
    it("taps navigating between the artworks tab and exhibitors tab", async () => {
      renderWithRelay({
        Fair: () => ({
          isActive: true,
          slug: "art-basel-hong-kong-2020",
          internalID: "fair1244",
          counts: {
            artworks: 100,
            partnerShows: 20,
          },
        }),
      })

      await waitForElementToBeRemoved(() => screen.getByTestId("FairPlaceholder"))

      fireEvent.press(screen.getByText("Artworks"))

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedNavigationTab",
        context_module: "exhibitorsTab",
        context_screen_owner_type: "fair",
        context_screen_owner_slug: "art-basel-hong-kong-2020",
        context_screen_owner_id: "fair1244",
        subject: "Artworks",
      })

      fireEvent.press(screen.getByText("Exhibitors"))
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedNavigationTab",
        context_module: "artworksTab",
        context_screen_owner_type: "fair",
        context_screen_owner_slug: "art-basel-hong-kong-2020",
        context_screen_owner_id: "fair1244",
        subject: "Exhibitors",
      })
    })
  })
})
