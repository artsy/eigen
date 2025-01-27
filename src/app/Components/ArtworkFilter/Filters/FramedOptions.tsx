import { StackScreenProps } from "@react-navigation/stack"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter/ArtworkFilterNavigator"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import React, { useState } from "react"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

type FramedOptionsScreenProps = StackScreenProps<
  ArtworkFilterNavigationStack,
  "FramedOptionsScreen"
>

export const OPTIONS: FilterData[] = [
  {
    displayText: "Show only framed works",
    paramName: FilterParamName.framed,
  },
]

export const FramedOptionsScreen: React.FC<FramedOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()
  const options = OPTIONS.map((option) => {
    const selectedOptionByParamName = selectedOptions.find(
      (selectedOption) => selectedOption.paramName === option.paramName
    )

    return {
      ...option,
      paramValue: selectedOptionByParamName?.paramValue || undefined,
    }
  })

  const [key, setKey] = useState(0)

  const handleSelect = (option: FilterData, updatedValue: boolean) => {
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: updatedValue || undefined,
      paramName: option.paramName,
    })
  }

  const handleClear = () => {
    options.map((option) => {
      selectFiltersAction({ ...option, paramValue: undefined })
    })

    // Force re-render
    setKey((n) => n + 1)
  }

  const selected = options.filter((option) => option.paramValue)

  return (
    <MultiSelectOptionScreen
      key={key}
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.framed}
      filterOptions={options}
      navigation={navigation}
      {...(selected.length > 0
        ? { rightButtonText: "Clear", onRightButtonPress: handleClear }
        : {})}
    />
  )
}
