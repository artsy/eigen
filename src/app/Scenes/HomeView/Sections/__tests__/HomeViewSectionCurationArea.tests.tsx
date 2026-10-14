import { act, fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { HomeViewSectionCurationAreaTestsQuery } from "__generated__/HomeViewSectionCurationAreaTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionCurationArea } from "app/Scenes/HomeView/Sections/HomeViewSectionCurationArea"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/utils/hooks/withSuspense")

// Shows rails self-fetch location-based shows; provide a location so the rail's
// own query fires (same mock the standalone Shows section test uses).
jest.mock("@react-native-community/geolocation", () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success) => {
    success({ coords: { latitude: 1, longitude: 2 } })
  }),
}))

const leadSection = {
  __typename: "HomeViewSectionArtworks",
  internalID: "home-view-section-curators-picks-emerging",
  contextModule: "curatorsPicksEmergingRail",
  ownerType: "collection",
  component: {
    title: "Curators' Picks",
    description: "The best works by rising talents",
    behaviors: {
      viewAll: {
        href: "/collection/curators-picks-emerging",
        ownerType: "collection",
      },
    },
  },
  artworksConnection: {
    edges: [
      {
        node: {
          internalID: "artwork-1-id",
          slug: "artwork-1-slug",
          title: "Artwork 1",
          href: "/artwork-1-href",
        },
      },
      {
        node: {
          internalID: "artwork-2-id",
          slug: "artwork-2-slug",
          title: "Artwork 2",
          href: "/artwork-2-href",
          collectorSignals: { primaryLabel: "PARTNER_OFFER", auction: null },
        },
      },
    ],
  },
}

const chipsConnection = {
  chipsConnection: {
    edges: [
      {
        node: {
          title: "Recommended Artists",
          subtitle: "Explore a curated selection of exciting artists.",
          href: "/recommended-artists-route",
          entityID: "recommended-artists-id",
          entityType: "HomeViewSection",
          contextModule: "curationAreaRail",
          image: { imageURL: "https://url.com/chip.jpg" },
        },
      },
      {
        node: {
          title: "Trending Artists",
          subtitle: null,
          href: "/trending-artists-route",
          entityID: "trending-artists-id",
          entityType: "HomeViewSection",
          contextModule: "curationAreaRail",
          image: null,
        },
      },
    ],
  },
}

const section = (overrides: Record<string, any> = {}) => ({
  internalID: "home-view-section-curation-area",
  contextModule: "curationAreaRail",
  backgroundColor: "#F7F7F7",
  component: { title: "Chosen by our curators", type: "CurationArea" },
  chipsTitle: null,
  chipsHref: null,
  rails: [{ title: null, section: leadSection }],
  ...chipsConnection,
  ...overrides,
})

const editorialLeadSection = {
  __typename: "HomeViewSectionArticles",
  internalID: "home-view-section-latest-articles",
  contextModule: "articleRail",
  ownerType: "articles",
  component: {
    title: "Artsy Editorial",
    // Standalone-rail subtitle — must be suppressed when leadTitle is set.
    description: "The standalone editorial subtitle",
    behaviors: {
      viewAll: { href: "/articles", ownerType: "articles" },
    },
  },
  articlesConnection: {
    edges: [
      {
        node: {
          internalID: "article-1-id",
          slug: "article-1-slug",
          href: "/article/article-1-slug",
          thumbnailTitle: "Article 1",
        },
      },
      {
        node: {
          internalID: "article-2-id",
          slug: "article-2-slug",
          href: "/article/article-2-slug",
          thumbnailTitle: "Article 2",
        },
      },
    ],
  },
}

const editorialSection = (overrides: Record<string, any> = {}) => ({
  internalID: "home-view-section-editorial-curation-area",
  contextModule: "curationAreaRail",
  backgroundColor: "#FEF8ED",
  component: {
    title: "Artsy Editorial",
    description: "Your guide to the art world",
    type: "CurationArea",
  },
  chipsTitle: "Art News",
  chipsHref: "/news",
  chipsOwnerType: "marketNews",
  rails: [{ title: "Editorial", section: editorialLeadSection }],
  chipsConnection: {
    edges: [
      {
        node: {
          title: "News Chip 1",
          href: "/article/news-1-slug",
          entityID: "news-1-id",
          entityType: "Article",
          contextModule: "curationAreaRail",
          image: { imageURL: "https://url.com/news-1.jpg" },
        },
      },
    ],
  },
  ...overrides,
})

describe("HomeViewSectionCurationArea", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableHidingDislikedArtworks: true })
  })

  const { renderWithRelay } = setupTestWrapper<HomeViewSectionCurationAreaTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }

      return (
        <HomeViewStoreProvider>
          <HomeViewSectionCurationArea section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionCurationAreaTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-curation-area") {
            ... on HomeViewSectionCurationArea {
              ...HomeViewSectionCurationArea_section @arguments(enableHidingDislikedArtworks: true)
            }
          }
        }
      }
    `,
  })

  it("renders the container header", () => {
    renderWithRelay({ HomeViewSectionCurationArea: () => section() })

    expect(screen.getByText("Chosen by Our Curators")).toBeOnTheScreen()
  })

  it("renders the lead rail with its artworks and view-all", () => {
    renderWithRelay({ HomeViewSectionCurationArea: () => section() })

    expect(screen.getByText("Curators' Picks")).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Curators' Picks"))
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "curatorsPicksEmergingRail",
      context_screen_owner_type: "home",
      destination_screen_owner_type: "collection",
      type: "viewAll",
    })
    expect(navigate).toHaveBeenCalledWith("/collection/curators-picks-emerging")
  })

  it("tracks and navigates when a lead artwork is tapped", () => {
    renderWithRelay({ HomeViewSectionCurationArea: () => section() })

    fireEvent.press(screen.getByText(/Artwork 2/))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "curatorsPicksEmergingRail",
      context_screen_owner_type: "home",
      destination_screen_owner_id: "artwork-2-id",
      destination_screen_owner_slug: "artwork-2-slug",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 1,
      module_height: "single",
      signal_label: "Limited-Time Offer",
      type: "thumbnail",
    })
    expect(navigate).toHaveBeenCalledWith("/artwork-2-href")
  })

  it("renders each chip as a collection card, including one without an image", () => {
    renderWithRelay({ HomeViewSectionCurationArea: () => section() })

    expect(screen.getByText("Recommended Artists")).toBeOnTheScreen()
    expect(screen.getByText("Trending Artists")).toBeOnTheScreen()
    // The chip subtitle renders as the card description.
    expect(screen.getByText("Explore a curated selection of exciting artists.")).toBeOnTheScreen()
    // Each card renders an image (or placeholder when absent).
    expect(screen.getAllByTestId("collection-card-image")).toHaveLength(2)
  })

  it("tracks and navigates when a chip is tapped", () => {
    renderWithRelay({ HomeViewSectionCurationArea: () => section() })

    fireEvent.press(screen.getByText("Recommended Artists"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "curationAreaRail",
      context_screen_owner_type: "home",
      destination_screen_owner_id: "recommended-artists-id",
      destination_screen_owner_type: "HomeViewSection",
      destination_path: "/recommended-artists-route",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
    expect(navigate).toHaveBeenCalledWith("/recommended-artists-route")
  })

  it("renders nothing for a rail whose section is an unsupported type", () => {
    renderWithRelay({
      HomeViewSectionCurationArea: () =>
        section({ rails: [{ title: null, section: { __typename: "HomeViewSectionArtists" } }] }),
    })

    // Container + chips still render; no rail.
    expect(screen.getByText("Chosen by Our Curators")).toBeOnTheScreen()
    expect(screen.queryByText("Curators' Picks")).not.toBeOnTheScreen()
    expect(screen.getByText("Recommended Artists")).toBeOnTheScreen()
  })

  describe("editorial instance (articles lead + news chips)", () => {
    it("renders the container header with its subtitle", () => {
      renderWithRelay({ HomeViewSectionCurationArea: () => editorialSection() })

      expect(screen.getByText("Artsy Editorial")).toBeOnTheScreen()
      expect(screen.getByText("Your guide to the art world")).toBeOnTheScreen()
    })

    it("renders the articles rail with the rail-title override and suppresses the rail subtitle", () => {
      renderWithRelay({ HomeViewSectionCurationArea: () => editorialSection() })

      // rail.title overrides the section's own "Artsy Editorial" title.
      expect(screen.getByText("Editorial")).toBeOnTheScreen()
      expect(screen.getByText(/Article 1/)).toBeOnTheScreen()
      expect(screen.getByText(/Article 2/)).toBeOnTheScreen()
      // The standalone-rail subtitle must not repeat under the lead when leadTitle is set.
      expect(screen.queryByText("The standalone editorial subtitle")).not.toBeOnTheScreen()
    })

    it("tracks and navigates when an editorial article is tapped", () => {
      renderWithRelay({ HomeViewSectionCurationArea: () => editorialSection() })

      fireEvent.press(screen.getByText(/Article 1/))

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "tappedArticleGroup",
          context_module: "articleRail",
          context_screen_owner_type: "home",
          destination_screen_owner_id: "article-1-id",
          destination_screen_owner_slug: "article-1-slug",
          destination_screen_owner_type: "article",
          horizontal_slide_position: 0,
          type: "thumbnail",
        })
      )
      expect(navigate).toHaveBeenCalledWith("/article/article-1-slug")
    })

    it("renders the Art News chips header and navigates to its view-all", () => {
      renderWithRelay({ HomeViewSectionCurationArea: () => editorialSection() })

      expect(screen.getByText("Art News")).toBeOnTheScreen()
      expect(screen.getByText("News Chip 1")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Art News"))
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedCardGroup",
        context_module: "curationAreaRail",
        context_screen_owner_type: "home",
        destination_screen_owner_type: "marketNews",
        type: "viewAll",
      })
      expect(navigate).toHaveBeenCalledWith("/news")
    })

    it("renders news chips as cards and tracks/navigates on tap", () => {
      renderWithRelay({ HomeViewSectionCurationArea: () => editorialSection() })

      expect(screen.getByText("News Chip 1")).toBeOnTheScreen()
      expect(screen.getByTestId("news-chip-thumbnail")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("News Chip 1"))

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedCardGroup",
        context_module: "curationAreaRail",
        context_screen_owner_type: "home",
        destination_screen_owner_id: "news-1-id",
        destination_screen_owner_type: "Article",
        destination_path: "/article/news-1-slug",
        horizontal_slide_position: 0,
        type: "thumbnail",
      })
      expect(navigate).toHaveBeenCalledWith("/article/news-1-slug")
    })
  })

  describe("What's Happening instance (rails-only: fairs + shows, no chips)", () => {
    const whatsHappeningSection = (overrides: Record<string, any> = {}) => ({
      internalID: "home-view-section-whats-happening-curation-area",
      contextModule: "curationAreaRail",
      backgroundColor: "#F7F7F7",
      component: {
        title: "What's Happening",
        description: "See art world events around the world",
        type: "CurationArea",
      },
      chipsTitle: null,
      chipsHref: null,
      chipsOwnerType: null,
      rails: [
        {
          title: null,
          section: {
            __typename: "HomeViewSectionFairs",
            internalID: "home-view-section-featured-fairs",
            contextModule: "fairsRail",
            ownerType: "fairs",
            component: { title: "Featured Fairs", description: null, behaviors: { viewAll: null } },
            fairsConnection: {
              edges: [{ node: { href: "/fair/fair-1", internalID: "fair-1-id", slug: "fair-1" } }],
            },
          },
        },
        {
          title: "Shows Near You",
          section: {
            __typename: "HomeViewSectionShows",
            internalID: "home-view-section-shows-for-you",
            contextModule: "showsRail",
            component: { title: "Shows for You" },
          },
        },
      ],
      chipsConnection: { edges: [] },
      ...overrides,
    })

    it("renders the fairs rail and no chips group", () => {
      renderWithRelay({ HomeViewSectionCurationArea: () => whatsHappeningSection() })

      expect(screen.getByText("Featured Fairs")).toBeOnTheScreen()
      // No chips: rails-only area has no header and an empty chips connection.
      expect(screen.queryByText("Art News")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("news-chip-thumbnail")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("curation-chip-thumbnail")).not.toBeOnTheScreen()
    })

    it("renders the shows rail with the 'Shows Near You' title override", async () => {
      const { mockResolveLastOperation } = renderWithRelay({
        HomeViewSectionCurationArea: () => whatsHappeningSection(),
      })

      // The shows rail self-fetches its own location-based connection.
      act(() => {
        mockResolveLastOperation({
          ShowConnection: () => ({ edges: [{ node: { name: "show 1" } }] }),
        })
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("show-rail-placeholder"), {
        timeout: 10000,
      })

      expect(screen.getByText("Shows Near You")).toBeOnTheScreen()
      expect(screen.getByText("show 1")).toBeOnTheScreen()
    })
  })
})
