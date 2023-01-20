import { Checkbox } from "palette"
import { useMemo } from "react"
import { FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "../ArtworkFilterStore"
import { ArtworkFilterOptionItem, ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

export interface ArtworkFilterOptionCheckboxItemProps
  extends Omit<ArtworkFilterOptionItemProps, "onPress" | "count"> {}

export const ArtworkFilterOptionCheckboxItem: React.FC<ArtworkFilterOptionCheckboxItemProps> = ({
  item,
}) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()

  const selectedOption = selectedOptions.find(
    (option) => option.paramName === item.filterType
  )?.paramValue

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
