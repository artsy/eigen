import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Aggregations, ArtworkFilterContextState } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { CheckIcon } from "palette"
import React from "react"
import { act, ReactTestRenderer } from "react-test-renderer"
import { ReactElement } from "simple-markdown"
import { InnerOptionListItem, OptionListItem, SingleSelectOptionListItemRow } from "../SingleSelectOption"
import { getEssentialProps } from "./helper"

type MockScreen = (props: { initialState: ArtworkFilterContextState }) => ReactElement

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
    const selectedOption = innerOptions.filter((item) => item.findAllByType(CheckIcon).length > 0)[0]
    return selectedOption
  }

  describe(params.name + " filter option", () => {
    let state: ArtworkFilterContextState

    beforeEach(() => {
      state = {
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
      }
    })

    const aggregation = aggregationForFilter(params.filterKey, params.aggregations!)

    it("renders the correct number of " + params.name + " options", () => {
      const tree = renderWithWrappers(<params.Screen initialState={state} {...getEssentialProps()} />)
      // Counts returned + all option
      expect(tree.root.findAllByType(OptionListItem)).toHaveLength(aggregation!.counts.length + 1)
    })

    it("adds an all option", () => {
      const tree = renderWithWrappers(<params.Screen initialState={state} {...getEssentialProps()} />)
      const firstRow = tree.root.findAllByType(SingleSelectOptionListItemRow)[0]
      expect(extractText(firstRow)).toContain("All")
    })

    describe("selecting a " + params.name + " filter", () => {
      it("displays the default " + params.name + " if no selected filters", () => {
        const component = renderWithWrappers(<params.Screen initialState={state} {...getEssentialProps()} />)
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
          filterType: "artwork",
          counts: {
            total: null,
            followedArtists: null,
          },
        }

        const component = renderWithWrappers(<params.Screen initialState={state} {...getEssentialProps()} />)
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
          const tree = renderWithWrappers(<params.Screen initialState={state} {...getEssentialProps()} />)

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
