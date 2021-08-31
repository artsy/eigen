import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { MultiSelectCheckOptionScreen } from "./MultiSelectCheckOption"
import { useMultiSelect } from "./useMultiSelect"

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
  const { handleSelect, isSelected } = useMultiSelect({
    options: AUCTION_HOUSE_OPTIONS,
    paramName: FilterParamName.organizations,
  })

  const filterOptions = AUCTION_HOUSE_OPTIONS.map((option) => ({ ...option, paramValue: isSelected(option) }))

  return (
    <MultiSelectCheckOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.organizations}
      filterOptions={filterOptions}
      navigation={navigation}
    />
  )
}
