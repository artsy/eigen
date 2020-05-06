import { OrderedWaysToBuyFilters, WaysToBuyOptions } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext } from "lib/utils/ArtworkFiltersStore"
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
    const isNotAlreadySelected = state.selectedFilters.filter(filter => filter.value === option).length === 0
    const isCurrentlyApplied = state.appliedFilters.filter(filter => filter.value === option).length > 0

    /**  We filter the state.selectedFilters to determine if this selection is already selected.
     * If it has not been selected we dispatch the 'selectFilters' action with this filter,
     * then add the filter to the "on" array, and remove it from the "off" array.
     */
    if (isNotAlreadySelected && !isCurrentlyApplied) {
      const off = without(state.filterToggleState.off, option)
      const on = union(state.filterToggleState.on, [option])
      dispatch({ type: "selectFilters", payload: { value: option, filterType } })
      dispatch({ type: "updateMultiSelectionToggle", payload: { on, off } })
    }

    /** Get array of currently selected filters, minus the de-selected option and
     * dispatch the 'selectFilters' action on the remaining filters. Then add the filter to the
     * "off" array and remove it from the "on" array.
     */
    if (!isNotAlreadySelected && !isCurrentlyApplied) {
      dispatch({ type: "resetFilters" })

      const off = union(state.filterToggleState.off, [option])
      const on = without(state.filterToggleState.on, option)

      dispatch({ type: "updateMultiSelectionToggle", payload: { on, off } })

      const selectedFilters = state.selectedFilters.filter(selectedFilter => selectedFilter.value !== option)

      selectedFilters.map(_selectedFilter => {
        dispatch({
          type: "selectFilters",
          payload: { value: _selectedFilter.value, filterType: _selectedFilter.filterType },
        })
      })
    }

    /**
     * Remove the filter from the "on" array and add it to the "off" array.
     * When user applies filter, dispatch upApplyFilters action to remove this filter   * from applied filters.
     */
    if (isNotAlreadySelected && isCurrentlyApplied) {
      const off = union(state.filterToggleState.off, [option])
      const on = without(state.filterToggleState.on, option)

      dispatch({ type: "updateMultiSelectionToggle", payload: { on, off } })

      // should only dispatch this when an applied filter is deselected and then the Apply button pressed
      dispatch({ type: "unApplyFilters", payload: { value: option, filterType: "waysToBuy" } })
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
