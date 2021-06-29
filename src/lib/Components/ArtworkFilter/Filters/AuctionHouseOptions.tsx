import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { xor } from "lodash"
import React, { useState } from "react"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"

export const AUCTION_HOUSE_OPTIONS: FilterData[] = [
  {
    displayText: "Sotheby's",
    paramName: FilterParamName.organizations,
    paramValue: "Sotheby's",
  },
  {
    displayText: "Christie's",
    paramName: FilterParamName.organizations,
    paramValue: "Christie's",
  },
  {
    displayText: "Phillips",
    paramName: FilterParamName.organizations,
    paramValue: "Phillips",
  },
]

interface AuctionHouseOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "AuctionHouseOptionsScreen"> {}

export const AuctionHouseOptionsScreen: React.FC<AuctionHouseOptionsScreenProps> = ({ navigation }) => {
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const selectedFilters = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const oldAppliedFilterAuctionHouses = appliedFilters.find(
    (filter) => filter.paramName === FilterParamName.organizations
  )?.paramValue as string[] | undefined

  const oldSelectedFilterAuctionHouses = selectedFilters.find(
    (filter) => filter.paramName === FilterParamName.organizations
  )?.paramValue as string[] | undefined

  const initialState = xor(oldAppliedFilterAuctionHouses, oldSelectedFilterAuctionHouses)

  const [selectedOptions, setSelectedOptions] = useState(initialState)

  const toggleOption = (option: FilterData) => {
    let updatedParamValue: string[]

    // The user is trying to uncheck the auction house
    if (typeof option.paramValue === "string" && selectedOptions?.includes(option.paramValue)) {
      updatedParamValue = selectedOptions.filter((paramValue) => paramValue !== option.paramValue)
    } else {
      // The user is trying to check the auction house
      updatedParamValue = [...(selectedOptions || []), option.paramValue as string]
    }

    setSelectedOptions(updatedParamValue)
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: updatedParamValue,
      paramName: FilterParamName.organizations,
    })
  }

  return (
    <MultiSelectCheckOptionScreen
      onSelect={toggleOption}
      filterHeaderText={FilterDisplayName.organizations}
      filterOptions={AUCTION_HOUSE_OPTIONS}
      selectedOptions={selectedOptions}
      navigation={navigation}
    />
  )
}
