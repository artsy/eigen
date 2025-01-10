import { Text, Separator } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import { AggregateOption, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

type PriceRangeOptionsScreenProps = StackScreenProps<
  ArtworkFilterNavigationStack,
  "EstimateRangeOptionsScreen"
>

const EstimateRanges = [
  { paramValue: "", paramDisplay: "All" },
  { paramValue: "*-1000", paramDisplay: "$0-1,000" },
  { paramValue: "1000-5000", paramDisplay: "$1000-5,000" },
  { paramValue: "5000-10000", paramDisplay: "$5,000-10,000" },
  { paramValue: "10000-50000", paramDisplay: "$10,000-50,000" },
  { paramValue: "50000-*", paramDisplay: "$50,000+" },
]

export const EstimateRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({
  navigation,
}) => {
  const paramName = FilterParamName.estimateRange
  const ranges = EstimateRanges

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const options = ranges.map((estimateRange) => {
    return {
      displayText: estimateRange.paramDisplay,
      paramName,
      paramValue: estimateRange.paramValue,
    }
  })

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  const selectOption = (option: AggregateOption) => {
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: option.paramValue,
      paramName,
    })
  }

  return (
    <SingleSelectOptionScreen
      filterHeaderText="Price range"
      filterOptions={options}
      ListHeaderComponent={
        <>
          <Text variant="sm" color="black60" textAlign="center" my="15px">
            Based on the estimate for the lot
          </Text>
          <Separator />
        </>
      }
      navigation={navigation}
      onSelect={selectOption}
      selectedOption={selectedOption}
    />
  )
}
