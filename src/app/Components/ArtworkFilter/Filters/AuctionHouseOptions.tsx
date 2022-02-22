import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
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

export const AuctionHouseOptionsScreen: React.FC<AuctionHouseOptionsScreenProps> = ({
  navigation,
}) => {
  const { handleSelect, isSelected, handleClear, isActive } = useMultiSelect({
    options: AUCTION_HOUSE_OPTIONS,
    paramName: FilterParamName.organizations,
  })

  const filterOptions = AUCTION_HOUSE_OPTIONS.map((option) => ({
    ...option,
    paramValue: isSelected(option),
  }))

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.organizations}
      filterOptions={filterOptions}
      navigation={navigation}
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
