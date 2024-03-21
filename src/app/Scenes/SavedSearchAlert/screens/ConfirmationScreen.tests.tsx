import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { ConfirmationScreen, NUMBER_OF_ARTWORKS_TO_SHOW } from "./ConfirmationScreen"

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

const TestWrapper: React.FC = ({ children }) => (
  <SavedSearchStoreProvider
    runtimeModel={{
      ...savedSearchModel,
      attributes,
      aggregations,
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

      expect(navigate).toHaveBeenCalledWith("/settings/alerts")
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

const aggregations: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [{ name: "Painting", value: "painting", count: 42 }],
  },
]

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
