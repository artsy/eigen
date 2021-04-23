import { StackScreenProps } from "@react-navigation/stack"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import React, { useState } from "react"
import { ArtworkFilterNavigationStack } from "../ArtworkFilter"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "WaysToBuyOptionsScreen"> {}

export const WaysToBuyOptionsScreen: React.FC<WaysToBuyOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const selectedOptions = useSelectedOptionsDisplay()

  const filterNames = [
    FilterParamName.waysToBuyBuy,
    FilterParamName.waysToBuyMakeOffer,
    FilterParamName.waysToBuyBid,
    FilterParamName.waysToBuyInquire,
  ]

  const options = selectedOptions.filter((value) => filterNames.includes(value.paramName))

  const sortedOptions = options.sort(({ paramName: left }: FilterData, { paramName: right }: FilterData): number => {
    if (filterNames.indexOf(left) < filterNames.indexOf(right)) {
      return -1
    } else {
      return 1
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
      filterOptions={sortedOptions}
      navigation={navigation}
      {...(selected.length > 0 ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
