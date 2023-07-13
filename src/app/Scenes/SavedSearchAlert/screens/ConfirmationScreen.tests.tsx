import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
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

    expect(screen.queryByText("Your alert has been saved")).toBeOnTheScreen()
    expect(screen.queryByText("David Hockney")).toBeOnTheScreen()
    expect(screen.queryByText("Unique")).toBeOnTheScreen()
    expect(screen.queryByText("Painting")).toBeOnTheScreen()
  })

  it("displays the matching artworks", async () => {
    renderWithRelay({
      FilterArtworksConnection: () => artworksConnection,
    })
    await flushPromiseQueue()

    expect(screen.getByText("Untitled #1")).toBeOnTheScreen()
    expect(screen.getByText("Untitled #2")).toBeOnTheScreen()
  })

  describe("CTAs", () => {
    it("renders manage-alerts button always", () => {
      renderWithRelay()

      const manageButton = screen.queryByText("Manage your alerts")
      expect(manageButton).toBeOnTheScreen()

      fireEvent.press(manageButton!)
      expect(navigate).toHaveBeenCalledWith("/my-profile/saved-search-alerts")
    })

    it("renders see-all button if there are more works to show", async () => {
      renderWithRelay({
        FilterArtworksConnection: () => ({ counts: { total: NUMBER_OF_ARTWORKS_TO_SHOW + 1 } }),
      })
      await flushPromiseQueue()

      const seeAllButton = screen.queryByText("See all matching works")
      expect(seeAllButton).toBeOnTheScreen()

      fireEvent.press(seeAllButton!)
      expect(navigate).toHaveBeenCalledWith("/artist/david-hockney", {
        passProps: { searchCriteriaID: "foo-bar-42" },
      })
    })

    it("does not render see-all button if there are no more works to show", async () => {
      renderWithRelay({
        FilterArtworksConnection: () => ({ counts: { total: NUMBER_OF_ARTWORKS_TO_SHOW - 1 } }),
      })
      await flushPromiseQueue()

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
  placeholder: "Placeholder title for alert",
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
