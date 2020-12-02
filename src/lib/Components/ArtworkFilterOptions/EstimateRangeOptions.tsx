import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { AggregateOption, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Sans, Separator } from "palette"
import React, { useContext } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps {
  navigator: NavigatorIOS
}

const EstimateRanges = [
  { paramValue: "", paramDisplay: "All" },
  { paramValue: "*-100000", paramDisplay: "$0-1,000" },
  { paramValue: "100000-500000", paramDisplay: "$1000-5,000" },
  { paramValue: "500000-1000000", paramDisplay: "$5,000-10,000" },
  { paramValue: "1000000-5000000", paramDisplay: "$10,000-50,000" },
  { paramValue: "5000000-*", paramDisplay: "$50,000+" },
]

export const EstimateRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.estimateRange

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
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName,
      },
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
      navigator={navigator}
      onSelect={selectOption}
      selectedOption={selectedOption}
    />
  )
}
