import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { RecentSearch } from "app/Scenes/Search/SearchModel"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { isPad } from "app/utils/hardware"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Pill } from "app/Components/Pill"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SearchScreen } from "./Search"

const banksy: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Banksy",
    displayType: "Artist",
    href: "https://artsy.com/artist/banksy",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
    __typename: "Artist",
  },
}

jest.mock("app/utils/hardware", () => ({
  isPad: jest.fn(),
}))
jest.mock("app/utils/useSearchInsightsConfig", () => ({
  useSearchInsightsConfig: () => true,
}))
jest.mock("app/utils/useAlgoliaIndices", () => ({
  useAlgoliaIndices: () => ({
    indicesInfo: {
      Artist_staging: { hasResults: true },
      Sale_staging: { hasResults: false },
      Fair_staging: { hasResults: false },
      Gallery_staging: { hasResults: true },
    },
    updateIndicesInfo: jest.fn(),
  }),
}))
jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  throttle: (fn: any) => {
    fn.flush = jest.fn()

    return fn
  },
}))

describe("Search Screen", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    require("app/system/relay/createEnvironment").reset()
    ;(isPad as jest.Mock).mockReset()
    mockEnvironment = require("app/system/relay/createEnvironment").defaultEnvironment
  })

  const TestRenderer = () => {
    return (
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <SearchScreen />
      </RelayEnvironmentProvider>
    )
  }

  it("should render a text input with placeholder", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system,
      }),
    })

    await flushPromiseQueue()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

    // Pill should not be visible
    expect(screen.queryByText("Artists")).toBeFalsy()

    // should show City Guide
    expect(screen.getByText("City Guide")).toBeTruthy()
    expect(screen.getByText("Recent Searches")).toBeTruthy()

    act(() => fireEvent.changeText(searchInput, "Ba"))

    // Pills should be visible
    await waitFor(() => {
      screen.getByText("Artworks")
      screen.getByText("Artists")
    })
  })

  it("does not show city guide entrance when on iPad", async () => {
    const isPadMock = isPad as jest.Mock
    isPadMock.mockImplementation(() => true)
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system,
      }),
    })

    await flushPromiseQueue()
    expect(screen.queryByText("City Guide")).toBeFalsy()
  })

  it("shows city guide entrance when there are recent searches", async () => {
    __globalStoreTestUtils__?.injectState({
      search: {
        recentSearches: [banksy],
      },
    })
    const isPadMock = isPad as jest.Mock
    isPadMock.mockImplementation(() => false)
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system,
      }),
    })

    await flushPromiseQueue()
    expect(screen.getByText("City Guide")).toBeTruthy()
  })

  it('the "Top" pill should be selected by default', async () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system,
      }),
    })

    await flushPromiseQueue()
    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

    fireEvent.changeText(searchInput, "text")

    expect(screen.getByA11yState({ selected: true })).toHaveTextContent("Top")
  })

  it("should not be able to untoggle the same pill", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system: {
          algolia: {
            appID: "",
            apiKey: "",
            indices: [
              {
                name: "Artist_staging",
                displayName: "Artists",
                key: "artist",
              },
              {
                name: "Gallery_staging",
                displayName: "Gallery",
                key: "partner_gallery",
              },
            ],
          },
        },
      }),
    })

    await flushPromiseQueue()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
    fireEvent(searchInput, "changeText", "prev value")
    fireEvent(screen.getByText("Artists"), "press")

    expect(screen.getByA11yState({ selected: true })).toHaveTextContent("Artists")
  })

  describe("search pills", () => {
    it("are displayed when the user has typed the minimum allowed number of characters", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Query: () => ({
          system: {
            algolia: {
              appID: "",
              apiKey: "",
              indices: INDICES,
            },
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("Top")).toBeFalsy()
      expect(screen.queryByText("Artist")).toBeFalsy()
      expect(screen.queryByText("Auction")).toBeFalsy()
      expect(screen.queryByText("Gallery")).toBeFalsy()
      expect(screen.queryByText("Fair")).toBeFalsy()

      const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
      fireEvent(searchInput, "changeText", "Ba")

      expect(screen.queryByText("Top")).toBeTruthy()
      expect(screen.queryByText("Artist")).toBeTruthy()
      expect(screen.queryByText("Auction")).toBeTruthy()
      expect(screen.queryByText("Gallery")).toBeTruthy()
      expect(screen.queryByText("Fair")).toBeTruthy()
    })

    it("have top pill selected and disabled at the same time", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Query: () => ({
          system: {
            algolia: {
              appID: "",
              apiKey: "",
              indices: INDICES,
            },
          },
        }),
      })

      await flushPromiseQueue()

      const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
      fireEvent(searchInput, "changeText", "Ba")
      const topPill = screen.getByA11yState({ selected: true, disabled: true })
      expect(topPill).toHaveTextContent("Top")
    })

    it("are enabled when they have results", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Query: () => ({
          system: {
            algolia: {
              appID: "",
              apiKey: "",
              indices: INDICES,
            },
          },
        }),
      })
      await flushPromiseQueue()

      const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
      fireEvent(searchInput, "changeText", "Ba")
      const enabledPills = screen
        .UNSAFE_getAllByType(Pill)
        .filter((pill) => pill.props.disabled === false)
      expect(enabledPills).toHaveLength(3)
      expect(enabledPills[0]).toHaveTextContent("Artworks")
      expect(enabledPills[1]).toHaveTextContent("Artist")
      expect(enabledPills[2]).toHaveTextContent("Gallery")
    })
  })

  it("are displayed when the user has typed the minimum allowed number of characters", async () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system: {
          algolia: {
            appID: "",
            apiKey: "",
            indices: INDICES,
          },
        },
      }),
    })

    await flushPromiseQueue()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

    expect(screen.queryByText("Top")).toBeFalsy()
    expect(screen.queryByText("Artist")).toBeFalsy()
    expect(screen.queryByText("Auction")).toBeFalsy()
    expect(screen.queryByText("Gallery")).toBeFalsy()
    expect(screen.queryByText("Fair")).toBeFalsy()

    fireEvent(searchInput, "changeText", "Ba")

    expect(screen.queryByText("Top")).toBeTruthy()
    expect(screen.queryByText("Artist")).toBeTruthy()
    expect(screen.queryByText("Auction")).toBeTruthy()
    expect(screen.queryByText("Gallery")).toBeTruthy()
    expect(screen.queryByText("Fair")).toBeTruthy()
  })

  it("should track event when a pill is tapped", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system: {
          algolia: {
            appID: "",
            apiKey: "",
            indices: [{ name: "Artist_staging", displayName: "Artist", key: "artist" }],
          },
        },
      }),
    })

    await flushPromiseQueue()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
    fireEvent(searchInput, "changeText", "text")

    fireEvent(screen.getByText("Artist"), "press")
    expect(mockTrackEvent.mock.calls[1]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedNavigationTab",
          "context_module": "topTab",
          "context_screen": "Search",
          "context_screen_owner_type": "search",
          "query": "text",
          "subject": "Artist",
        },
      ]
    `)
  })

  it("should correctly track the previously applied pill context module", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system: {
          algolia: {
            appID: "",
            apiKey: "",
            indices: [{ name: "Artist_staging", displayName: "Artist", key: "artist" }],
          },
        },
      }),
    })

    await flushPromiseQueue()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
    fireEvent(searchInput, "changeText", "text")

    fireEvent(screen.getByText("Artist"), "press")
    expect(mockTrackEvent.mock.calls[1]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedNavigationTab",
          "context_module": "topTab",
          "context_screen": "Search",
          "context_screen_owner_type": "search",
          "query": "text",
          "subject": "Artist",
        },
      ]
    `)

    fireEvent(screen.getByText("Artworks"), "press")
    expect(mockTrackEvent.mock.calls[2]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedNavigationTab",
          "context_module": "artistsTab",
          "context_screen": "Search",
          "context_screen_owner_type": "search",
          "query": "text",
          "subject": "Artworks",
        },
      ]
    `)
  })

  it("should render all allowed algolia indices", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system: {
          algolia: {
            appID: "",
            apiKey: "",
            indices: [
              {
                displayName: "Artist",
                key: "artist",
                name: "Artist_staging",
              },
              {
                displayName: "Article",
                key: "article",
                name: "Article_staging",
              },
              {
                displayName: "Auction",
                key: "sale",
                name: "Sale_staging",
              },
              {
                displayName: "Artist Series",
                key: "artist_series",
                name: "ArtistSeries_staging",
              },
              {
                displayName: "Collection",
                key: "marketing_collection",
                name: "MarketingCollection_staging",
              },
              {
                displayName: "Fair",
                key: "fair",
                name: "Fair_staging",
              },
              {
                displayName: "Show",
                key: "partner_show",
                name: "PartnerShow_staging",
              },
              {
                displayName: "Gallery",
                key: "partner_gallery",
                name: "PartnerGallery_staging",
              },
            ],
          },
        },
      }),
    })

    await flushPromiseQueue()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
    act(() => fireEvent(searchInput, "changeText", "value"))

    expect(screen.getByText("Artist")).toBeTruthy()
    expect(screen.getByText("Article")).toBeTruthy()
    expect(screen.getByText("Auction")).toBeTruthy()
    expect(screen.getByText("Artist Series")).toBeTruthy()
    expect(screen.getByText("Collection")).toBeTruthy()
    expect(screen.getByText("Fair")).toBeTruthy()
    expect(screen.getByText("Show")).toBeTruthy()
    expect(screen.getByText("Gallery")).toBeTruthy()
  })

  it("should render only allowed algolia indices", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        system: {
          algolia: {
            appID: "",
            apiKey: "",
            indices: [
              {
                name: "Artist_staging",
                displayName: "Artist",
                key: "artist",
              },
              {
                name: "Gallery_staging",
                displayName: "Gallery",
                key: "partner_gallery",
              },
              {
                name: "Denied_staging",
                displayName: "Denied",
                key: "denied",
              },
            ],
          },
        },
      }),
    })

    await flushPromiseQueue()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
    fireEvent(searchInput, "changeText", "value")

    expect(screen.getByText("Artist")).toBeTruthy()
    expect(screen.getByText("Gallery")).toBeTruthy()
    expect(screen.queryByText("Denied")).toBeFalsy()
  })

  describe("the top pill is selected by default", () => {
    beforeEach(async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Algolia: () => ({
          appID: "",
          apiKey: "",
          indices: [
            {
              name: "Artist_staging",
              displayName: "Artists",
              key: "artist",
            },
          ],
        }),
      })

      await flushPromiseQueue()
    })

    it("when search query is empty", () => {
      const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

      fireEvent(searchInput, "changeText", "prev value")
      fireEvent(screen.getByText("Artists"), "press")
      fireEvent(searchInput, "changeText", "")
      fireEvent(searchInput, "changeText", "new value")

      expect(screen.queryByA11yState({ selected: true })).toHaveTextContent("Top")
    })

    it("when search query is changed", () => {
      const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

      fireEvent(searchInput, "changeText", "12")
      fireEvent(screen.getByText("Artists"), "press")
      fireEvent(searchInput, "changeText", "123")

      expect(screen.queryByA11yState({ selected: true })).toHaveTextContent("Artists")
    })

    it("when clear button is pressed", () => {
      const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

      fireEvent(searchInput, "changeText", "prev value")
      fireEvent(screen.getByText("Artists"), "press")
      fireEvent(screen.getByLabelText("Clear input button"), "press")
      fireEvent(searchInput, "changeText", "new value")

      expect(screen.queryByA11yState({ selected: true })).toHaveTextContent("Top")
    })

    it("when cancel button is pressed", () => {
      const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

      fireEvent(searchInput, "changeText", "prev value")
      fireEvent(screen.getByText("Artists"), "press")
      fireEvent(searchInput, "focus")
      fireEvent(screen.getByText("Cancel"), "press")
      fireEvent(searchInput, "changeText", "new value")

      expect(screen.queryByA11yState({ selected: true })).toHaveTextContent("Top")
    })
  })

  it("should track event when a search result is pressed", async () => {
    renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          system: {
            algolia: {
              appID: "",
              apiKey: "",
              indices: [{ name: "Artist_staging", displayName: "Artist", key: "artist" }],
            },
          },
        }),
      })
    )

    await flushPromiseQueue()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")
    act(() => fireEvent(searchInput, "changeText", "text"))

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        SearchableConnection: () => ({
          edges: [
            {
              node: {
                displayLabel: "Banksy",
              },
            },
          ],
        }),
      })
    )

    await flushPromiseQueue()

    await waitFor(() => screen.getByText("Banksy"))
    act(() => fireEvent.press(screen.getByText("Banksy")))

    expect(mockTrackEvent.mock.calls[1]).toMatchInlineSnapshot(`
      [
        {
          "action": "selectedResultFromSearchScreen",
          "context_module": "topTab",
          "context_screen": "Search",
          "context_screen_owner_type": "Search",
          "position": 0,
          "query": "text",
          "selected_object_slug": "<mock-value-for-field-"slug">",
          "selected_object_type": "<mock-value-for-field-"displayType">",
        },
      ]
    `)
  })

  describe("Search discovery content", () => {
    describe("Treding artists section", () => {
      it("should NOT be rendered when feature flag is disabled", async () => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          AREnableSearchDiscoveryContentIOS: false,
          AREnableSearchDiscoveryContentAndroid: false,
        })

        renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation(mockEnvironment, {
          Query: () => ({
            system,
          }),
        })

        await flushPromiseQueue()

        expect(screen.queryByText("Trending Artists")).toBeNull()
      })

      it("should be rendered when feature flag is enabled", async () => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          AREnableSearchDiscoveryContentIOS: true,
          AREnableSearchDiscoveryContentAndroid: true,
        })

        renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation(mockEnvironment, {
          Query: () => ({
            system,
          }),
        })

        await flushPromiseQueue()

        expect(screen.getByText("Trending Artists")).toBeTruthy()
      })
    })

    describe("Artsy Collections section", () => {
      it("should NOT be rendered when feature flag is disabled", async () => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          AREnableSearchDiscoveryContentIOS: false,
          AREnableSearchDiscoveryContentAndroid: false,
        })

        renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation(mockEnvironment, {
          Query: () => ({
            system,
          }),
        })

        await flushPromiseQueue()

        expect(screen.queryByText("Artsy Collections")).toBeNull()
      })

      it("should be rendered when feature flag is enabled", async () => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          AREnableSearchDiscoveryContentIOS: true,
          AREnableSearchDiscoveryContentAndroid: true,
        })

        renderWithWrappers(<TestRenderer />)
        resolveMostRecentRelayOperation(mockEnvironment, {
          Query: () => ({
            system,
          }),
        })

        await flushPromiseQueue()

        expect(screen.getByText("Artsy Collections")).toBeTruthy()
      })
    })
  })
})

const INDICES = [
  { name: "Artist_staging", displayName: "Artist", key: "artist" },
  { name: "Sale_staging", displayName: "Auction", key: "sale" },
  { name: "Gallery_staging", displayName: "Gallery", key: "partner_gallery" },
  { name: "Fair_staging", displayName: "Fair", key: "fair" },
]

const system = {
  algolia: {
    appID: "",
    apiKey: "",
    indices: [{ name: "Artist_staging", displayName: "Artists", key: "artist" }],
  },
}
