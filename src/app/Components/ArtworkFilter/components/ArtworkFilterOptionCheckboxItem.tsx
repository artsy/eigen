import { Checkbox } from "@artsy/palette-mobile"
import {
  aggregationForFilter,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useMemo } from "react"
import { ArtworkFilterOptionItem, ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

export type ArtworkFilterOptionCheckboxItemProps = Omit<
  ArtworkFilterOptionItemProps,
  "onPress" | "count"
>

export const ArtworkFilterOptionCheckboxItem: React.FC<ArtworkFilterOptionCheckboxItemProps> = ({
  item,
}) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)

  const selectedOptions = useSelectedOptionsDisplay()

  const selectedOption = selectedOptions.find((option) => option.paramName === item.filterType)
    ?.paramValue

  const setValueOnFilters = (value: boolean | string) => {
    selectFiltersAction({
      paramName: item.filterType as FilterParamName,
      paramValue: value,
      displayText: item.displayText,
    })
  }

  const onPress = () => {
    if (item.filterType === "state") {
      setValueOnFilters(selectedOption === "ALL" ? "PAST" : "ALL")
      return
    }

    const nextValue = !selectedOption
    setValueOnFilters(nextValue)
  }

  const isChecked = useMemo(() => {
    if (item.filterType === "state") {
      return selectedOption === "PAST"
    }
    return !!selectedOption
  }, [selectedOption])

  const aggregation = aggregationForFilter(FilterParamName.state, aggregations)

  const hasAggregation = aggregation !== undefined

  if (hasAggregation && !aggregation.counts[0].value && item.filterType === "state") {
    return null
  }

  return (
    <ArtworkFilterOptionItem
      item={item}
      onPress={onPress}
      RightAccessoryItem={
        <Checkbox
          checked={isChecked}
          onPress={onPress}
          testID="ArtworkFilterOptionCheckboxItemCheckbox"
        />
      }
    />
  )
}
