import { Checkbox } from "palette"
import {
  defaultCommonFilterOptions,
  FilterParamName,
  getUnitedSelectedAndAppliedFilters,
} from "../ArtworkFilterHelpers"
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

  const getChecked = () => {
    if (selectedFilters.length === 0 && previouslyAppliedFilters.length === 0) {
      return defaultCommonFilterOptions[item.filterType as FilterParamName]
    }

    return !!getUnitedSelectedAndAppliedFilters({
      filterType: storeFilterType,
      selectedFilters,
      previouslyAppliedFilters,
    }).find((f) => f.paramName === item.filterType)?.paramValue
  }
  const checked = getChecked()

  const setValueOnFilters = (value: boolean) => {
    selectFiltersAction({
      paramName: item.filterType as FilterParamName,
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
          checked={!!checked}
          onPress={onPress}
          testID="ArtworkFilterOptionCheckboxItemCheckbox"
        />
      }
    />
  )
}
