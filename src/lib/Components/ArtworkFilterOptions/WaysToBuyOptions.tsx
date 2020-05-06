import { OrderedWaysToBuyFilters, WaysToBuyOptions } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext } from "lib/utils/ArtworkFiltersStore"
import { isUndefined } from "lodash"
import { union, without } from "lodash"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps {
  navigator: NavigatorIOS
}

export const WaysToBuyOptionsScreen: React.SFC<WaysToBuyOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const filterType = "waysToBuy"

  const selectOption = (option: WaysToBuyOptions) => {
    const isOptionSelected = isUndefined(state.selectedFilters.find(filter => filter.value === option))
    // We filter the state.selectedFilters to determine if this selection is already selected.
    // If it has not been selected isOptionSelected returns undefined and we dispatch the 'selectFilters' action with this filter.
    // If it has been selected it should be removed from state.selectedFilters.

    // first handle by adding wtb filters to be applied to the on array and removing from the off array
    // then in the select action, check if already applied,
    // if applied then remove it from on array and add to off array
    // if not applied it should be handled here

    if (isOptionSelected) {
      dispatch({ type: "selectFilters", payload: { value: option, filterType } })
      const off = without(state.filterToggleState.off, option)
      const on = union(state.filterToggleState.on, [option])
      dispatch({ type: "updateMultiSelectionToggle", payload: { on, off } })
    } else {
      dispatch({ type: "resetFilters" })

      const off = union(state.filterToggleState.off, [option])
      const on = without(state.filterToggleState.on, option)
      dispatch({ type: "updateMultiSelectionToggle", payload: { on, off } })

      // Get array of currently selected filters, removing the de-selected option and dispatch the 'selectFilters' action on the remaining filters.
      const selectedFilters = state.selectedFilters.filter(selectedFilter => selectedFilter.value !== option)

      selectedFilters.map(_selectedFilter => {
        dispatch({
          type: "selectFilters",
          payload: { value: _selectedFilter.value, filterType: _selectedFilter.filterType },
        })
      })
    }
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterText="Ways to Buy"
      filterOptions={OrderedWaysToBuyFilters}
      navigator={navigator}
    />
  )
}
