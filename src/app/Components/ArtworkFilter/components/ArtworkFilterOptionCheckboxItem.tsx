import { Checkbox } from "palette"
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

  const selectedOption = !!selectedOptions.find((option) => option.paramName === item.filterType)
    ?.paramValue

  const setValueOnFilters = (value: boolean) => {
    selectFiltersAction({
      paramName: item.filterType as FilterParamName,
      paramValue: value,
      displayText: item.displayText,
    })
  }

  const onPress = () => {
    const nextValue = !selectedOption

    setValueOnFilters(nextValue)
  }

  return (
    <ArtworkFilterOptionItem
      item={item}
      onPress={onPress}
      RightAccessoryItem={
        <Checkbox
          checked={!!selectedOption}
          onPress={onPress}
          testID="ArtworkFilterOptionCheckboxItemCheckbox"
        />
      }
    />
  )
}
