import {
  aggregationForFilter,
  Aggregations,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { TouchableRow } from "app/Components/TouchableRow"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { RadioDot } from "palette"
import React from "react"
import { act, ReactTestRenderer } from "react-test-renderer"
import { ReactElement } from "simple-markdown"
import { InnerOptionListItem, OptionListItem } from "./SingleSelectOption"

type MockScreen = (props: { initialState?: ArtworkFiltersState }) => ReactElement

export interface ValidationParams {
  Screen: MockScreen
  aggregations: Aggregations
  filterKey: string
  paramName: FilterParamName
  name: string
}

export const sharedAggregateFilterValidation = (params: ValidationParams) => {
  const selectedFilterOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter(
      (item) => item.findByType(RadioDot).props.selected
    )[0]
    return selectedOption
  }

  describe(params.name + " filter option", () => {
    let initialState: ArtworkFiltersState

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
      sizeMetric: "cm",
    }

    const MockScreenWrapper = ({
      initialData = initialState,
    }: {
      initialData?: ArtworkFiltersState
    }) => (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <params.Screen />
      </ArtworkFiltersStoreProvider>
    )

    const aggregation = aggregationForFilter(params.filterKey, params.aggregations!)

    it("renders the correct number of " + params.name + " options", () => {
      const tree = renderWithWrappers(<MockScreenWrapper />)
      // Counts returned + all option
      expect(tree.root.findAllByType(OptionListItem)).toHaveLength(aggregation!.counts.length + 1)
    })

    it("adds an all option", () => {
      const tree = renderWithWrappers(<MockScreenWrapper />)
      const firstRow = tree.root.findAllByType(TouchableRow)[0]
      expect(extractText(firstRow)).toContain("All")
    })

    describe("selecting a " + params.name + " filter", () => {
      it("displays the default " + params.name + " if no selected filters", () => {
        const component = renderWithWrappers(<MockScreenWrapper />)
        const selectedOption = selectedFilterOption(component)
        expect(extractText(selectedOption)).toContain("All")
      })

      it("displays a " + params.name + " filter option when selected", () => {
        const injectedState: ArtworkFiltersState = {
          selectedFilters: [
            {
              paramName: params.paramName,
              paramValue: aggregation!.counts[0].value,
              displayText: aggregation!.counts[0].name,
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
          sizeMetric: "cm",
        }

        const component = renderWithWrappers(<MockScreenWrapper initialData={injectedState} />)

        const selectedOption = selectedFilterOption(component)
        expect(extractText(selectedOption)).toContain(aggregation!.counts[0].name)
      })

      it(
        "allows only one " +
          params.name +
          " filter to be selected at a time when several " +
          params.name +
          " options are tapped",
        () => {
          const tree = renderWithWrappers(<MockScreenWrapper />)

          const [firstOptionInstance, secondOptionInstance, thirdOptionInstance] =
            tree.root.findAllByType(TouchableRow)
          const selectedOptionIconBeforePress = tree.root
            .findAllByType(RadioDot)
            .filter((item) => item.props.selected)

          expect(selectedOptionIconBeforePress).toHaveLength(1)

          act(() => firstOptionInstance.props.onPress())
          act(() => secondOptionInstance.props.onPress())
          act(() => thirdOptionInstance.props.onPress())

          const selectedOptionIconAfterPress = tree.root
            .findAllByType(RadioDot)
            .filter((item) => item.props.selected)

          expect(selectedOptionIconAfterPress).toHaveLength(1)
        }
      )
    })
  })

  // ** Nice to test **
  // sorts options according to sort order
}
