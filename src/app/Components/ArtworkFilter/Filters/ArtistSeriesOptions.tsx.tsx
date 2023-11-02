import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { useArtworkFiltersAggregation } from "app/Components/ArtworkFilter/useArtworkFilters"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

type ArtistSeriesOptionsScreenProps = StackScreenProps<
  ArtworkFilterNavigationStack,
  "ArtistSeriesOptionsScreen"
>

export const ArtistSeriesOptionsScreen: React.FC<ArtistSeriesOptionsScreenProps> = ({
  navigation,
}) => {
  const { aggregation } = useArtworkFiltersAggregation({
    paramName: FilterParamName.artistSeriesIDs,
  })

  const options: FilterData[] = (aggregation?.counts ?? []).map(({ value: paramValue, name }) => {
    return { displayText: name, paramName: FilterParamName.artistSeriesIDs, paramValue }
  })

  const { handleSelect, isSelected, handleClear, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.artistSeriesIDs,
  })

  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.artistSeriesIDs}
      filterOptions={filterOptions}
      navigation={navigation}
      searchable
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
