import { fireEvent } from "@testing-library/react-native"
import { getUnitedSelectedAndAppliedFilters } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  ArtworkFilterOptionCheckboxItem,
  ArtworkFilterOptionCheckboxItemProps,
} from "app/Components/ArtworkFilter/components/ArtworkFilterOptionCheckboxItem"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const defaultProps: ArtworkFilterOptionCheckboxItemProps = {
  item: {
    filterType: "showOnlySubmittedArtworks",
    displayText: "Show Only Submitted Artworks",
    ScreenComponent: "FilterOptionsScreen",
  },
}

describe("ArtworkFilterOptionCheckboxItem", () => {
  let store: ReturnType<typeof ArtworksFiltersStore.useStore>

  const MakeStore = () => {
    store = ArtworksFiltersStore.useStore()
    return null
  }

  const TestWrapper = ({
    itemProps,
    filterStoreData,
  }: {
    itemProps?: Partial<ArtworkFilterOptionCheckboxItemProps>
    filterStoreData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...filterStoreData,
        }}
      >
        <ArtworkFilterOptionCheckboxItem {...defaultProps} {...itemProps} />
        <MakeStore />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders properly", () => {
    const { queryByTestId } = renderWithWrappers(<TestWrapper />)
    expect(queryByTestId("ArtworkFilterOptionItemRow")).toBeDefined()
    expect(queryByTestId("ArtworkFilterOptionCheckboxItemCheckbox")).toBeDefined()
  })

  it("updates the store when pressed", async () => {
    const getCheckedValue = () => {
      const storeState = store.getState()
      const selectedFilters = storeState.selectedFilters
      const previouslyAppliedFilters = storeState.previouslyAppliedFilters
      const storeFilterType = storeState.filterType

      const checkedValue = !!getUnitedSelectedAndAppliedFilters({
        filterType: storeFilterType,
        selectedFilters,
        previouslyAppliedFilters,
      }).find((f) => f.paramName === defaultProps.item.filterType)?.paramValue
      return checkedValue
    }

    const initialData: ArtworkFiltersState = {
      ...store.getState(),
      filterType: "local",
    }

    const { getByTestId } = renderWithWrappers(<TestWrapper filterStoreData={initialData} />)

    const FilterOptionItem = getByTestId("ArtworkFilterOptionItemRow")

    let checked = getCheckedValue()
    expect(checked).toBe(false)

    fireEvent.press(FilterOptionItem)

    checked = getCheckedValue()
    expect(checked).toBe(true)
  })
})
