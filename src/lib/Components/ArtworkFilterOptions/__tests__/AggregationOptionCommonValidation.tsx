import { Box, CheckIcon } from "@artsy/palette"
import { FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { extractText } from "lib/tests/extractText"
import { Aggregations, ArtworkFilterContextState, FilterActions } from "lib/utils/ArtworkFiltersStore"
import React, { Dispatch } from "react"
import { act, create, ReactTestRenderer } from "react-test-renderer"
import { ReactElement } from "simple-markdown"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { aggregationForFilterType, OptionListItem } from "../../../../lib/Components/FilterModal"
import { InnerOptionListItem, SingleSelectOptionListItemRow } from "../SingleSelectOption"

type MockScreen = ({ initialState, aggregations, dispatch }: any) => ReactElement

export interface ValidationParams {
  Screen: MockScreen
  aggregations: Aggregations
  filterType: FilterType
  paramName: FilterParamName
  name: string
}

export const sharedAggregateFilterValidation = (params: ValidationParams) => {
  const selectedFilterOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter(item => item.findAllByType(Box).length > 0)[0]
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
      }
    })

    const aggregation = aggregationForFilterType(params.filterType, params.aggregations!)

    it("renders the correct number of " + params.name + " options", () => {
      const tree = create(
        <params.Screen initialState={state} aggregations={params.aggregations} navigator={mockNavigator} />
      )
      // Counts returned + all option
      expect(tree.root.findAllByType(OptionListItem)).toHaveLength(aggregation.counts.length + 1)
    })

    it("adds an all option", () => {
      const tree = create(
        <params.Screen initialState={state} aggregations={params.aggregations} navigator={mockNavigator} />
      )
      const firstRow = tree.root.findAllByType(SingleSelectOptionListItemRow)[0]
      expect(extractText(firstRow)).toContain("All")
    })

    describe("selecting a " + params.name + " filter", () => {
      it("displays the default " + params.name + " if no selected filters", () => {
        const component = create(
          <params.Screen initialState={state} aggregations={params.aggregations} navigator={mockNavigator} />
        )
        const selectedOption = selectedFilterOption(component)
        expect(extractText(selectedOption)).toContain("All")
      })

      it("displays a " + params.name + " filter option when selected", () => {
        state = {
          selectedFilters: [
            {
              filterType: params.filterType,
              paramName: params.paramName,
              paramValue: aggregation.counts[0].value,
              displayText: aggregation.counts[0].name,
            },
          ],
          appliedFilters: [],
          previouslyAppliedFilters: [],
          applyFilters: false,
        }

        const component = create(
          <params.Screen initialState={state} aggregations={params.aggregations} navigator={mockNavigator} />
        )
        const selectedOption = selectedFilterOption(component)
        expect(extractText(selectedOption)).toContain(aggregation.counts[0].name)
      })

      // TODO: Shouldn't we be passing 2 here?
      it("allows only one " + params.name + " filter to be selected at a time", () => {
        const initialState: ArtworkFilterContextState = {
          selectedFilters: [
            {
              filterType: params.filterType,
              paramName: params.paramName,
              paramValue: aggregation.counts[0].value,
              displayText: aggregation.counts[0].name,
            },
          ],
          appliedFilters: [],
          previouslyAppliedFilters: [],
          applyFilters: false,
        }

        const tree = create(
          <params.Screen initialState={initialState} aggregations={params.aggregations} navigator={mockNavigator} />
        )

        // TODO: Not a safe assumption or a good test for sorted filters
        const selectedRow = tree.root.findAllByType(SingleSelectOptionListItemRow)[1]
        expect(extractText(selectedRow)).toEqual(aggregation.counts[0].name)
        expect(selectedRow.findAllByType(CheckIcon)).toHaveLength(1)
      })

      it(
        "allows only one " +
          params.name +
          " filter to be selected at a time when several " +
          params.name +
          " options are tapped",
        () => {
          const dispatch: Dispatch<FilterActions> = () => {
            return {
              type: "selectFilters",
              payload: {
                displayText: "All",
                paramName: params.paramName,
                filterType: params.filterType,
              },
            }
          }

          const tree = create(
            <params.Screen
              initialState={state}
              aggregations={params.aggregations}
              dispatch={dispatch}
              navigator={mockNavigator}
            />
          )

          const firstOptionInstance = tree.root.findAllByType(SingleSelectOptionListItemRow)[0]
          const secondOptionInstance = tree.root.findAllByType(SingleSelectOptionListItemRow)[1]
          const thirdOptionInstance = tree.root.findAllByType(SingleSelectOptionListItemRow)[3]
          const selectedOptionIcon = tree.root.findAllByType(CheckIcon)

          act(() => firstOptionInstance.props.onPress())
          act(() => secondOptionInstance.props.onPress())
          act(() => thirdOptionInstance.props.onPress())

          expect(selectedOptionIcon).toHaveLength(1)
        }
      )
    })
  })

  // ** Nice to test **
  // sorts options according to sort order
}
