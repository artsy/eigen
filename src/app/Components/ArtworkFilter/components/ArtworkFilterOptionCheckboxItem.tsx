import { Checkbox } from "palette"
import React from "react"
import { FilterParamName, getUnitedSelectedAndAppliedFilters } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "../ArtworkFilterStore"
import { ArtworkFilterOptionItem, ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

export interface ArtworkFilterOptionCheckboxItemProps
  extends Omit<ArtworkFilterOptionItemProps, "onPress" | "count"> {}

export const ArtworkFilterOptionCheckboxItem: React.FC<ArtworkFilterOptionCheckboxItemProps> = ({
  item,
}) => {
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

  const setValueOnFilters = (value: boolean) => {
    selectFiltersAction({
      paramName: FilterParamName.showOnlySubmittedArtworks,
      paramValue: value,
      displayText: item.displayText,
    })
  }

  const onPress = () => {
    const nextValue = !checked
    setValueOnFilters(nextValue)
  }

  return (
    <ArtworkFilterOptionItem
      item={item}
      onPress={onPress}
      RightAccessoryItem={
        <Checkbox
          checked={checked}
          onPress={onPress}
          testID="ArtworkFilterOptionCheckboxItemCheckbox"
        />
      }
    />
  )
}
