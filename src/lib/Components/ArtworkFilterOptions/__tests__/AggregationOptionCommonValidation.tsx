import { CheckIcon } from "@artsy/palette"
import { FilterParamName } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { extractText } from "lib/tests/extractText"
import { Aggregations, ArtworkFilterContextState } from "lib/utils/ArtworkFiltersStore"
import React from "react"
import { act, create, ReactTestRenderer } from "react-test-renderer"
import { ReactElement } from "simple-markdown"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { aggregationForFilter, OptionListItem } from "../../../../lib/Components/FilterModal"
import { InnerOptionListItem, SingleSelectOptionListItemRow } from "../SingleSelectOption"

type MockScreen = (props: { initialState: ArtworkFilterContextState; navigator: MockNavigator }) => ReactElement

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
    const selectedOption = innerOptions.filter(item => item.findAllByType(CheckIcon).length > 0)[0]
    return selectedOption
  }

  describe(params.name + " filter option", () => {
    let state: ArtworkFilterContextState
    let mockNavigator: MockNavigator

    beforeEach(() => {
      mockNavigator = new MockNavigator()
      state = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: params.aggregations,
      }
    })

    const aggregation = aggregationForFilter(params.filterKey, params.aggregations!)

    it("renders the correct number of " + params.name + " options", () => {
      const tree = create(<params.Screen initialState={state} navigator={mockNavigator} />)
      // Counts returned + all option
      expect(tree.root.findAllByType(OptionListItem)).toHaveLength(aggregation!.counts.length + 1)
    })

    it("adds an all option", () => {
      const tree = create(<params.Screen initialState={state} navigator={mockNavigator} />)
      const firstRow = tree.root.findAllByType(SingleSelectOptionListItemRow)[0]
      expect(extractText(firstRow)).toContain("All")
    })

    describe("selecting a " + params.name + " filter", () => {
      it("displays the default " + params.name + " if no selected filters", () => {
        const component = create(<params.Screen initialState={state} navigator={mockNavigator} />)
        const selectedOption = selectedFilterOption(component)
        expect(extractText(selectedOption)).toContain("All")
      })

      it("displays a " + params.name + " filter option when selected", () => {
        state = {
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
        }

        const component = create(<params.Screen initialState={state} navigator={mockNavigator} />)
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
          const tree = create(<params.Screen initialState={state} navigator={mockNavigator} />)

          const [firstOptionInstance, secondOptionInstance, thirdOptionInstance] = tree.root.findAllByType(
            SingleSelectOptionListItemRow
          )
          const selectedOptionIconBeforePress = tree.root.findAllByType(CheckIcon)

          expect(selectedOptionIconBeforePress).toHaveLength(1)

          act(() => firstOptionInstance.props.onPress())
          act(() => secondOptionInstance.props.onPress())
          act(() => thirdOptionInstance.props.onPress())

          const selectedOptionIconAfterPress = tree.root.findAllByType(CheckIcon)

          expect(selectedOptionIconAfterPress).toHaveLength(1)
        }
      )
    })
  })

  // ** Nice to test **
  // sorts options according to sort order
}
