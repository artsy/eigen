import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionTestsQuery } from "__generated__/MyCollectionTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"

import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { MyCollectionQueryRenderer, Tab } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionContainer } from "app/Scenes/MyCollection/MyCollectionLegacy"
import { MyCollectionTabsStoreProvider } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      addListener: mockAddListener,
      navigate: jest.fn(),
    }),
    useIsFocused: () => true,
  }
})

const mockAddListener = jest.fn((event, callback) => {
  if (event === "focus" || event === "blur") {
    callback()
  }
  return jest.fn() // return a function to mimic the unsubscribe function
})

jest.mock("app/utils/queryPrefetching", () => ({
  prefetchQuery: jest.fn(),
  usePrefetch: jest.fn(() => jest.fn()),
}))

jest.mock("app/Scenes/MyCollection/MyCollectionArtworks", () => ({
  MyCollectionArtworksQueryRenderer: () => null,
}))

jest.mock("app/Scenes/MyCollection/MyCollectionListings", () => ({
  MyCollectionListingsQueryRenderer: () => null,
}))

jest.mock("app/Scenes/MyCollection/Components/MyCollectionCollectedArtists", () => ({
  ...jest.requireActual("app/Scenes/MyCollection/Components/MyCollectionCollectedArtists"),
  MyCollectionCollectedArtistsQueryRenderer: () => null,
}))

jest.mock("app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights", () => ({
  MyCollectionInsightsQR: () => null,
}))

jest.mock("app/Scenes/MyProfile/Components/UserAccountHeader/UserAccountHeader", () => ({
  UserAccountHeaderQueryRenderer: () => null,
}))

describe("MyCollection", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return (
          <MyCollectionArtworksKeywordStore.Provider>
            <MyCollectionTabsStoreProvider>
              <ArtworkFiltersStoreProvider>
                <MyCollectionContainer me={props.me} />
              </ArtworkFiltersStoreProvider>
            </MyCollectionTabsStoreProvider>
          </MyCollectionArtworksKeywordStore.Provider>
        )
      }
      return null
    },
    query: graphql`
      query MyCollectionTestsQuery @relay_test_operation {
        me {
          ...MyCollectionLegacy_me
        }
      }
    `,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("collection is empty", () => {
    it("shows zerostate", async () => {
      await renderWithRelay({
        Me: () => ({
          myCollectionConnection: {
            edges: [],
          },
          myCollectionInfo: {
            includesPurchasedArtworks: true,
            artworksCount: 0,
          },
          userInterestsConnection: {
            totalCount: 0,
          },
        }),
      })

      expect(screen.getByText("Know Your Collection Better")).toBeTruthy()
      expect(
        screen.getByText("Manage your collection online and get free market insights.")
      ).toBeTruthy()
    })

    it("tracks analytics event when Add Artwork is pressed", async () => {
      await renderWithRelay({
        Me: () => ({
          myCollectionConnection: {
            edges: [],
          },
          myCollectionInfo: {
            includesPurchasedArtworks: true,
            artworksCount: 0,
          },
          userInterestsConnection: {
            totalCount: 0,
          },
        }),
      })

      await fireEvent.press(screen.getByTestId("add-artwork-button-zero-state"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "addCollectedArtwork",
            "context_module": "myCollectionHome",
            "context_owner_type": "myCollection",
            "platform": "mobile",
          },
        ]
      `)
    })
  })

  describe("collection contains some artists and no artworks", () => {
    it("shows collected artists rail", async () => {
      await renderWithRelay({
        Me: () => ({
          myCollectionConnection: { edges: [] },
          myCollectionInfo: {
            includesPurchasedArtworks: true,
            artworksCount: 0,
          },
          userInterestsConnection: {
            totalCount: 1,
          },
        }),
      })

      expect(screen.getByTestId("my-collection-collected-artists-rail")).toBeTruthy()
    })

    it("shows zero artworks state", async () => {
      await renderWithRelay({
        Me: () => ({
          myCollectionConnection: { edges: [] },
          myCollectionInfo: {
            includesPurchasedArtworks: true,
            artworksCount: 0,
          },
          userInterestsConnection: {
            totalCount: 1,
          },
        }),
      })

      expect(screen.getByText("Add your artworks")).toBeTruthy()
      expect(
        screen.getByText(
          "Access price and market insights and build an online record of your collection."
        )
      ).toBeTruthy()
    })

    it("navigates to MyCollectionArtworkForm when Add Artwork is pressed", async () => {
      await renderWithRelay({
        Me: () => ({
          myCollectionConnection: { edges: [] },
          myCollectionInfo: {
            includesPurchasedArtworks: true,
            artworksCount: 0,
          },
          userInterestsConnection: {
            totalCount: 1,
          },
        }),
      })

      await fireEvent.press(screen.getByTestId("add-artwork-button-zero-artworks-state"))

      expect(navigate).toHaveBeenCalledWith(
        "my-collection/artworks/new",
        expect.objectContaining({
          passProps: { source: Tab.collection },
        })
      )
    })

    it("tracks analytics event when Add Artwork is pressed", async () => {
      await renderWithRelay({
        Me: () => ({
          myCollectionConnection: { edges: [] },
          myCollectionInfo: {
            includesPurchasedArtworks: true,
            artworksCount: 0,
          },
          userInterestsConnection: {
            totalCount: 1,
          },
        }),
      })

      await fireEvent.press(screen.getByTestId("add-artwork-button-zero-artworks-state"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "addCollectedArtwork",
            "context_module": "myCollectionHome",
            "context_owner_type": "myCollection",
            "platform": "mobile",
          },
        ]
      `)
    })
  })

  describe("collection is not empty", () => {
    it("renders without throwing an error", async () => {
      await renderWithRelay()
      expect(screen.getByLabelText("Artworks Content View")).toBeOnTheScreen()
    })
  })
})

describe("MyCollection with AREnableSellMyCollectionArtwork", () => {
  describe("when the flag is disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSellMyCollectionArtwork: false })
    })

    it("shows the Artists tab and no Listings tab", async () => {
      await renderWithWrappers(<MyCollectionQueryRenderer />)

      expect(screen.getByText("Artworks")).toBeOnTheScreen()
      expect(screen.getByText("Artists")).toBeOnTheScreen()
      expect(screen.getByText("Insights")).toBeOnTheScreen()
      expect(screen.queryByText("Listings")).not.toBeOnTheScreen()
    })
  })

  describe("when the flag is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSellMyCollectionArtwork: true })
    })

    it("shows the Listings tab and no Artists tab", async () => {
      await renderWithWrappers(<MyCollectionQueryRenderer />)

      expect(screen.getByText("Artworks")).toBeOnTheScreen()
      expect(screen.getByText("Insights")).toBeOnTheScreen()
      expect(screen.getByText("Listings")).toBeOnTheScreen()
      expect(screen.queryByText("Artists")).not.toBeOnTheScreen()
    })
  })
})
