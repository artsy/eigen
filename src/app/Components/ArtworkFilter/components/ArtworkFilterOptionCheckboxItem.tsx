import { useFeatureFlag } from "app/store/GlobalStore"
import { Check, Checkbox } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { FilterParamName, getUnitedSelectedAndAppliedFilters } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "../ArtworkFilterStore"
import { ArtworkFilterOptionItem, ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

export interface ArtworkFilterOptionCheckboxItemProps
  extends Omit<ArtworkFilterOptionItemProps, "onPress"> {}

export const ArtworkFilterOptionCheckboxItem: React.FC<ArtworkFilterOptionCheckboxItemProps> = ({
  item,
  count,
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
      count={count}
      RightAccessoryItem={<CheckboxItem onPress={onPress} checked={checked} />}
    />
  )
}

const CheckboxItem = ({ checked, onPress }: { checked: boolean; onPress: () => void }) => {
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
  if (isEnabledImprovedAlertsFlow) {
    return (
      <Checkbox
        checked={checked}
        onPress={onPress}
        testID="ArtworkFilterOptionCheckboxItemCheckbox"
      />
    )
  }
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Check selected={checked} />
    </TouchableWithoutFeedback>
  )
}
