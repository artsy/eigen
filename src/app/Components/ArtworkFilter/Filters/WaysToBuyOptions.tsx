import { StackScreenProps } from "@react-navigation/stack"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import React, { useState } from "react"
import { ArtworkFilterNavigationStack } from "../ArtworkFilterNavigator"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "WaysToBuyOptionsScreen"> {}

export const WAYS_TO_BUY_OPTIONS: FilterData[] = [
  {
    displayText: "Buy Now",
    paramName: FilterParamName.waysToBuyBuy,
  },
  {
    displayText: "Make Offer",
    paramName: FilterParamName.waysToBuyMakeOffer,
  },
  {
    displayText: "Bid",
    paramName: FilterParamName.waysToBuyBid,
  },
  {
    displayText: "Inquire",
    paramName: FilterParamName.waysToBuyInquire,
  },
]

export const WAYS_TO_BUY_PARAM_NAMES = WAYS_TO_BUY_OPTIONS.map((option) => option.paramName)

export const WaysToBuyOptionsScreen: React.FC<WaysToBuyOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()
  const options = WAYS_TO_BUY_OPTIONS.map((option) => {
    const selectedOptionByParamName = selectedOptions.find(
      (selectedOption) => selectedOption.paramName === option.paramName
    )

    return {
      ...option,
      paramValue: selectedOptionByParamName?.paramValue ?? false,
    }
  })

  const [key, setKey] = useState(0)

  const handleSelect = (option: FilterData, updatedValue: boolean) => {
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: updatedValue,
      paramName: option.paramName,
    })
  }

  const handleClear = () => {
    options.map((option) => {
      selectFiltersAction({ ...option, paramValue: false })
    })

    // Force re-render
    setKey((n) => n + 1)
  }

  const selected = options.filter((option) => option.paramValue)

  return (
    <MultiSelectOptionScreen
      key={key}
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.waysToBuy}
      filterOptions={options}
      navigation={navigation}
      {...(selected.length > 0
        ? { rightButtonText: "Clear", onRightButtonPress: handleClear }
        : {})}
    />
  )
}
