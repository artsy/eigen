import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { SavedSearchSuggestedFilters } from "app/Scenes/SavedSearchAlert/Components/SavedSearchSuggestedFilters"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"

const mockNavigate = jest.fn()

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => {
      return {
        navigate: mockNavigate,
      }
    },
  }
})

describe("SavedSearchSuggestedFilters", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={null}>
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchSuggestedFilters />
        </SavedSearchStoreProvider>
      </Suspense>
    ),
  })

  describe("when there are suggested filters", () => {
    it("show Add Filters Menu", async () => {
      renderWithRelay({ PreviewSavedSearch: () => ({ suggestedFilters: [] }) })

      await flushPromiseQueue()

      expect(screen.getByText("Add Filters")).toBeTruthy()
    })
  })
  describe("when there are suggested filters", () => {
    it("shows all suggested filters unselected", async () => {
      renderWithRelay({ PreviewSavedSearch: () => ({ suggestedFilters: mockSuggestedFilters }) })

      await flushPromiseQueue()

      mockSuggestedFilters.forEach((filter) => {
        expect(screen.getByText(filter.displayValue)).toBeTruthy()
      })
    })

    it("shows only the supported suggested filters", async () => {
      const notSupportedFilters = [
        {
          displayValue: "Valid value but not yet supported filter",
          field: "notSupportedFilter",
          name: "NotSuupported Filter",
          value: "valid-value-but-not-yet-supported-filter",
        },

        {
          displayValue: "invalid value",
          field: "invalid-filter",
          name: "Invalid filter",
          value: "invalid-value",
        },
      ]

      renderWithRelay({
        PreviewSavedSearch: () => ({
          suggestedFilters: [...mockSuggestedFilters, ...notSupportedFilters],
        }),
      })

      await flushPromiseQueue()

      mockSuggestedFilters.forEach((filter) => {
        expect(screen.getByText(filter.displayValue)).toBeTruthy()
      })

      notSupportedFilters.forEach((filter) => {
        expect(() => screen.getByText(filter.displayValue)).toThrow()
      })
    })

    it("navigates to filters screen on See More press", async () => {
      renderWithRelay({ PreviewSavedSearch: () => ({ suggestedFilters: mockSuggestedFilters }) })

      await flushPromiseQueue()

      const moreFiltersButton = screen.getByText("More Filters")
      fireEvent(moreFiltersButton, "onPress")

      expect(mockNavigate).toHaveBeenCalledWith("SavedSearchFilterScreen")
    })
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {},
  entity: {
    artists: [{ id: "artistID", name: "Banksy" }],
    owner: {
      type: OwnerType.artist,
      id: "ownerId",
      slug: "ownerSlug",
    },
  },
}

const mockSuggestedFilters = [
  {
    displayValue: "Painting",
    field: "additionalGeneIDs",
    name: "Medium",
    value: "painting",
  },
  {
    displayValue: "Unique",
    field: "attributionClass",
    name: "Rarity",
    value: "unique",
  },
  {
    displayValue: "$0-$10,000",
    field: "priceRange",
    name: "Price",
    value: "*-10000",
  },
  {
    displayValue: "Toys",
    field: "artistSeriesIDs",
    name: "Artist Series",
    value: "kaws-toys",
  },
]
