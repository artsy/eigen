import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import {
  ConfirmationScreen,
  NUMBER_OF_ARTWORKS_TO_SHOW,
} from "app/Scenes/SavedSearchAlert/screens/ConfirmationScreen"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { useEffect } from "react"
import { View } from "react-native"

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => {
      return {
        navigate: jest.fn(),
        addListener: jest.fn(),
      }
    },
    useRoute: () => {
      const params: CreateSavedSearchAlertNavigationStack["ConfirmationScreen"] = {
        searchCriteriaID: "foo-bar-42",
        closeModal: jest.fn(),
      }

      return { params }
    },
  }
})

jest.mock("app/Scenes/SavedSearchAlert/useSavedSearchPills", () => {
  return {
    useSavedSearchPills: () => [
      { label: "David Hockney", paramName: "artistIDs", value: "david-hockney" },
      { label: "Unique", paramName: "attributionClass", value: "unique" },
      { label: "Painting", paramName: "additionalGeneIDs", value: "painting" },
    ],
  }
})

jest.mock("app/utils/Sentinel", () => ({
  __esModule: true,
  Sentinel: (props: any) => <MockedVisibleSentinel {...props} />,
}))

const TestWrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <SavedSearchStoreProvider
    runtimeModel={{
      ...savedSearchModel,
      attributes,
      entity,
    }}
  >
    {children}
  </SavedSearchStoreProvider>
)

describe(ConfirmationScreen, () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <TestWrapper>
        <ConfirmationScreen />
      </TestWrapper>
    ),
  })

  it("displays the newly created alert criteria", () => {
    renderWithRelay()

    expect(screen.getByText("Your alert has been saved")).toBeOnTheScreen()
    expect(screen.getByText("David Hockney")).toBeOnTheScreen()
    expect(screen.getByText("Unique")).toBeOnTheScreen()
    expect(screen.getByText("Painting")).toBeOnTheScreen()
  })

  it("displays the correct message when there are many matches", async () => {
    renderWithRelay({
      FilterArtworksConnection: () => ({ counts: { total: NUMBER_OF_ARTWORKS_TO_SHOW + 1 } }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

    expect(
      screen.getByText(
        "11 works currently on Artsy match your criteria. See our top picks for you:"
      )
    ).toBeOnTheScreen()
  })

  it("displays the correct message when there are few matches", async () => {
    renderWithRelay({
      FilterArtworksConnection: () => ({ counts: { total: NUMBER_OF_ARTWORKS_TO_SHOW - 1 } }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

    expect(
      screen.getByText("You might like these 9 works currently on Artsy that match your criteria:")
    ).toBeOnTheScreen()
  })

  it("displays the correct message when there are no matches", async () => {
    renderWithRelay({
      FilterArtworksConnection: () => ({ counts: { total: 0 } }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

    expect(
      screen.getByText("There aren't any works available that meet the criteria at this time.")
    ).toBeOnTheScreen()
  })

  it("displays the matching artworks", async () => {
    renderWithRelay({
      FilterArtworksConnection: () => artworksConnection,
    })
    await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

    expect(screen.getByText("Untitled #1")).toBeOnTheScreen()
    expect(screen.getByText("Untitled #2")).toBeOnTheScreen()
  })

  describe("CTAs", () => {
    it("renders manage-alerts button always", async () => {
      renderWithRelay()

      const manageButton = screen.queryByText("Manage your alerts")
      expect(manageButton).toBeOnTheScreen()

      fireEvent.press(manageButton!)
      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("/favorites/alerts")
    })

    it("renders see-all button if there are more works to show", async () => {
      renderWithRelay({
        FilterArtworksConnection: () => ({ counts: { total: NUMBER_OF_ARTWORKS_TO_SHOW + 1 } }),
      })
      await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

      const seeAllButton = screen.queryByText("See all matching works")
      expect(seeAllButton).toBeOnTheScreen()

      fireEvent.press(seeAllButton!)
      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("/artist/david-hockney", {
        passProps: { search_criteria_id: "foo-bar-42" },
      })
    })

    it("does not render see-all button if there are no more works to show", async () => {
      renderWithRelay({
        FilterArtworksConnection: () => ({ counts: { total: NUMBER_OF_ARTWORKS_TO_SHOW - 1 } }),
      })
      await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

      expect(screen.queryByText("See all matching works")).not.toBeOnTheScreen()
    })
  })

  describe("tracking", () => {
    afterEach(() => {
      jest.clearAllMocks()
      __globalStoreTestUtils__?.reset()
    })

    it("sends a tracking event when an artwork is tapped", async () => {
      renderWithRelay({
        FilterArtworksConnection: () => ({
          edges: [{ node: { title: "Untitled #1", slug: "untitled", collectorSignals: null } }],
        }),
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

      fireEvent.press(screen.getByText("Untitled #1"))

      expect(mockTrackEvent).toBeCalledWith({
        action: "tappedArtworkGroup",
        context_module: "alertConfirmation",
        context_screen_owner_type: "alertConfirmation",
        destination_screen_owner_slug: "untitled",
        destination_screen_owner_type: "artwork",
        type: "thumbnail",
      })
    })

    it("sends a tracking event when an artwork with a partner offer is tapped", async () => {
      renderWithRelay({
        FilterArtworksConnection: () => ({
          edges: [
            {
              node: {
                title: "Untitled #1",
                slug: "untitled",
                collectorSignals: { primaryLabel: "PARTNER_OFFER", auction: null },
              },
            },
          ],
        }),
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

      fireEvent.press(screen.getByText("Untitled #1"))

      expect(mockTrackEvent).toBeCalledWith({
        action: "tappedArtworkGroup",
        context_module: "alertConfirmation",
        context_screen_owner_type: "alertConfirmation",
        destination_screen_owner_slug: "untitled",
        destination_screen_owner_type: "artwork",
        type: "thumbnail",
        signal_label: "Limited-Time Offer",
      })
    })

    it("sends a tracking event when an artwork with a partner offer is tapped", async () => {
      renderWithRelay({
        FilterArtworksConnection: () => ({
          edges: [
            {
              node: {
                title: "Untitled #1",
                slug: "untitled",
                collectorSignals: {
                  primaryLabel: null,
                  auction: { bidCount: 7, lotWatcherCount: 49 },
                },
              },
            },
          ],
        }),
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("MatchingArtworksPlaceholder"))

      fireEvent.press(screen.getByText("Untitled #1"))

      expect(mockTrackEvent).toBeCalledWith({
        action: "tappedArtworkGroup",
        context_module: "alertConfirmation",
        context_screen_owner_type: "alertConfirmation",
        destination_screen_owner_slug: "untitled",
        destination_screen_owner_type: "artwork",
        type: "thumbnail",
        signal_label: "",
        signal_bid_count: 7,
        signal_lot_watcher_count: 49,
      })
    })
  })
})

/* mock data */

const artworksConnection = {
  counts: {
    total: 2,
  },
  edges: [
    {
      node: {
        title: "Untitled #1",
      },
    },
    {
      node: {
        title: "Untitled #2",
      },
    },
  ],
}

const attributes: SearchCriteriaAttributes = {
  artistIDs: ["david-hockney"],
  attributionClass: ["unique"],
  additionalGeneIDs: ["painting"],
}

const entity: SavedSearchEntity = {
  artists: [
    {
      id: "david-hockney",
      name: "David Hockney",
    },
  ],
  owner: {
    id: "some-artwork",
    slug: "some-artwork",
    type: OwnerType.artwork,
  },
}

const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [])

  return <View>{children}</View>
}
