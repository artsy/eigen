import { OwnerType } from "@artsy/cohesion"
import { act, fireEvent } from "@testing-library/react-native"
import { SavedSearchSuggestedFilters } from "app/Scenes/SavedSearchAlert/Components/SavedSearchSuggestedFilters"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"

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
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    jest.clearAllMocks()
    env = getMockRelayEnvironment()
  })

  it("shows all suggested filters unselected", async () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchSuggestedFilters />
      </SavedSearchStoreProvider>
    )

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "SavedSearchSuggestedFiltersFetchQuery"
    )

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          previewSavedSearch: {
            suggestedFilters: mockSuggestedFilters,
          },
        },
      })
    })

    await flushPromiseQueue()

    mockSuggestedFilters.forEach((filter) => {
      expect(getByText(filter.displayValue)).toBeTruthy()
    })
  })

  it("shows only the supported suggested filters", async () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchSuggestedFilters />
      </SavedSearchStoreProvider>
    )

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "SavedSearchSuggestedFiltersFetchQuery"
    )

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
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          previewSavedSearch: {
            suggestedFilters: [...mockSuggestedFilters, ...notSupportedFilters],
          },
        },
      })
    })

    await flushPromiseQueue()

    mockSuggestedFilters.forEach((filter) => {
      expect(getByText(filter.displayValue)).toBeTruthy()
    })

    notSupportedFilters.forEach((filter) => {
      expect(() => getByText(filter.displayValue)).toThrow()
    })
  })

  it("navigates to filters screen on See More press", async () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchSuggestedFilters />
      </SavedSearchStoreProvider>
    )

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "SavedSearchSuggestedFiltersFetchQuery"
    )

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          previewSavedSearch: {
            suggestedFilters: mockSuggestedFilters,
          },
        },
      })
    })

    await flushPromiseQueue()

    const moreFiltersButton = getByText("More Filters")
    fireEvent(moreFiltersButton, "onPress")

    expect(mockNavigate).toHaveBeenCalledWith("SavedSearchFilterScreen")
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
]
