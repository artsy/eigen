import { useFeatureFlag } from "lib/store/GlobalStore"
import { Check, Checkbox } from "palette"
import React, { useEffect } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { FILTER_OPTION_ITEM_PRESSED_EVENT_KEY, filterOptionItemPressedEvent } from ".."
import { FilterParamName, getUnitedSelectedAndAppliedFilters } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "../ArtworkFilterStore"
import { ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

export const ShowOnlySubmittedArtworksRightAccessoryItem: React.FC<
  ArtworkFilterOptionItemProps
> = ({ item }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedFilters = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)

  const previouslyAppliedFilters = ArtworksFiltersStore.useStoreState(
    (state) => state.previouslyAppliedFilters
  )

  const storeFilterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  const checked = !!getUnitedSelectedAndAppliedFilters({
    filterType: storeFilterType,
    selectedFilters,
    previouslyAppliedFilters,
  }).find((f) => f.paramName === item.filterType)?.paramValue

  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  const setValueOnFilters = (showOnlySubmitted: boolean) => {
    selectFiltersAction({
      paramName: FilterParamName.showOnlySubmittedArtworks,
      paramValue: showOnlySubmitted,
      displayText: "Show Only Submitted Artworks",
    })
  }

  const onPress = () => {
    const nextValue = !checked
    setValueOnFilters(nextValue)
  }

  function consumePressEvent(displayText: string) {
    if (displayText === item.displayText) {
      onPress()
    }
  }

  useEffect(() => {
    filterOptionItemPressedEvent.addListener(
      FILTER_OPTION_ITEM_PRESSED_EVENT_KEY,
      consumePressEvent
    )
    return () => {
      filterOptionItemPressedEvent.removeListener(
        FILTER_OPTION_ITEM_PRESSED_EVENT_KEY,
        consumePressEvent
      )
    }
  }, [checked])

  if (isEnabledImprovedAlertsFlow) {
    return <Checkbox checked={checked} onPress={onPress} />
  }
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Check selected={checked} />
    </TouchableWithoutFeedback>
  )
}
