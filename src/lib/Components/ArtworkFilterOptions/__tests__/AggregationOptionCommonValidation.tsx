import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, Aggregations, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { CheckIcon } from "palette"
import React from "react"
import { act, ReactTestRenderer } from "react-test-renderer"
import { ReactElement } from "simple-markdown"
import { InnerOptionListItem, OptionListItem, SingleSelectOptionListItemRow } from "../SingleSelectOption"

type MockScreen = (props: { initialState?: ArtworkFiltersState }) => ReactElement

export interface ValidationParams {
  Screen: MockScreen
  aggregations: Aggregations
  filterKey: string
  paramName: FilterParamName
  name: string
}

export const sharedAggregateFilterValidation = (params: ValidationParams) => {
  let storeInstance: ReturnType<typeof ArtworksFiltersStore.useStore>

  const selectedFilterOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter((item) => item.findAllByType(CheckIcon).length > 0)[0]
    return selectedOption
  }

  const ArtworkFiltersStoreConsumer = () => {
    storeInstance = ArtworksFiltersStore.useStore()
    return null
  }

  describe(params.name + " filter option", () => {
    let initState: ArtworkFiltersState

    initState = {
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

    const MockScreenWrapper = () => (
      <ArtworkFiltersStoreProvider>
        <params.Screen />
        <ArtworkFiltersStoreConsumer />
      </ArtworkFiltersStoreProvider>
    )

    const aggregation = aggregationForFilter(params.filterKey, params.aggregations!)

    it("renders the correct number of " + params.name + " options", () => {
      const tree = renderWithWrappers(<MockScreenWrapper />)
      ;(storeInstance as any).getActions().__injectState?.(initState)
      // Counts returned + all option
      expect(tree.root.findAllByType(OptionListItem)).toHaveLength(aggregation!.counts.length + 1)
    })

    it("adds an all option", () => {
      const tree = renderWithWrappers(<MockScreenWrapper />)
      ;(storeInstance as any).getActions().__injectState?.(initState)
      const firstRow = tree.root.findAllByType(SingleSelectOptionListItemRow)[0]
      expect(extractText(firstRow)).toContain("All")
    })

    describe("selecting a " + params.name + " filter", () => {
      it("displays the default " + params.name + " if no selected filters", () => {
        const component = renderWithWrappers(<MockScreenWrapper />)
        ;(storeInstance as any).getActions().__injectState?.(initState)
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
        }

        const component = renderWithWrappers(<MockScreenWrapper />)
        ;(storeInstance as any).getActions().__injectState?.(injectedState)

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
          ;(storeInstance as any).getActions().__injectState?.(initState)

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
