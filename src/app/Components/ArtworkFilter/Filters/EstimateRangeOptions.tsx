import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import { AggregateOption, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { Sans, Separator } from "palette"
import React from "react"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "EstimateRangeOptionsScreen"> {}

const EstimateRanges = [
  { paramValue: "", paramDisplay: "All" },
  { paramValue: "*-100000", paramDisplay: "$0-1,000" },
  { paramValue: "100000-500000", paramDisplay: "$1000-5,000" },
  { paramValue: "500000-1000000", paramDisplay: "$5,000-10,000" },
  { paramValue: "1000000-5000000", paramDisplay: "$10,000-50,000" },
  { paramValue: "5000000-*", paramDisplay: "$50,000+" },
]

export const EstimateRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({
  navigation,
}) => {
  const paramName = FilterParamName.estimateRange

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const options = EstimateRanges.map((estimateRange) => {
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
          <Sans size="3" color="black60" textAlign="center" my={15}>
            Based on the estimate for the lot
          </Sans>
          <Separator />
        </>
      }
      navigation={navigation}
      onSelect={selectOption}
      selectedOption={selectedOption}
    />
  )
}
