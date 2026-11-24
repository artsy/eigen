import { fireEvent, screen } from "@testing-library/react-native"
import {
  aggregationForFilter,
  Aggregations,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ReactElement } from "react"

type MockScreen = (props: { initialState?: ArtworkFiltersState }) => ReactElement

export interface ValidationParams {
  Screen: MockScreen
  aggregations: Aggregations
  filterKey: string
  paramName: FilterParamName
  name: string
}

export const sharedAggregateFilterValidation = (params: ValidationParams) => {
  const getOptionRows = () => screen.getAllByTestId("single-select-option")

  const getSelectedOptionRows = () =>
    getOptionRows().filter((row) => !!row.props.accessibilityState?.selected)

  describe(params.name + " filter option", () => {
    let initialState: ArtworkFiltersState

    // eslint-disable-next-line prefer-const
    initialState = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: params.aggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const MockScreenWrapper = ({
      initialData = initialState,
    }: {
      initialData?: ArtworkFiltersState
    }) => (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <params.Screen />
      </ArtworkFiltersStoreProvider>
    )

    const counts = aggregationForFilter(params.filterKey, params.aggregations)?.counts ?? []

    it("renders the correct number of " + params.name + " options", () => {
      renderWithWrappers(<MockScreenWrapper />)
      // Counts returned + all option
      expect(getOptionRows()).toHaveLength(counts.length + 1)
    })

    it("adds an all option", () => {
      renderWithWrappers(<MockScreenWrapper />)
      const firstRow = getOptionRows()[0]
      expect(firstRow).toHaveTextContent("All", { exact: false })
    })

    describe("selecting a " + params.name + " filter", () => {
      it("displays the default " + params.name + " if no selected filters", () => {
        renderWithWrappers(<MockScreenWrapper />)
        const [selectedOption] = getSelectedOptionRows()
        expect(selectedOption).toHaveTextContent("All", { exact: false })
      })

      it("displays a " + params.name + " filter option when selected", () => {
        const injectedState: ArtworkFiltersState = {
          selectedFilters: [
            {
              paramName: params.paramName,
              paramValue: counts[0].value,
              displayText: counts[0].name,
            },
          ],
          appliedFilters: [],
          previouslyAppliedFilters: [],
          applyFilters: false,
          aggregations: params.aggregations,
          filterType: "artwork",
          counts: {
            total: null,
            followedArtists: null,
          },
          showFilterArtworksModal: false,
          sizeMetric: "cm",
        }

        renderWithWrappers(<MockScreenWrapper initialData={injectedState} />)

        const [selectedOption] = getSelectedOptionRows()
        expect(selectedOption).toHaveTextContent(counts[0].name, { exact: false })
      })

      it(
        "allows only one " +
          params.name +
          " filter to be selected at a time when several " +
          params.name +
          " options are tapped",
        () => {
          renderWithWrappers(<MockScreenWrapper />)

          expect(getSelectedOptionRows()).toHaveLength(1)

          fireEvent.press(getOptionRows()[0])
          fireEvent.press(getOptionRows()[1])
          fireEvent.press(getOptionRows()[2])

          expect(getSelectedOptionRows()).toHaveLength(1)
          expect(getOptionRows()[2]).toBeSelected()
        }
      )
    })
  })

  // ** Nice to test **
  // sorts options according to sort order
}
