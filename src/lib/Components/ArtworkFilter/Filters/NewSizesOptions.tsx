import { StackScreenProps } from "@react-navigation/stack"
import { Box, Spacer } from "palette"
import React, { useState } from "react"
import { ArtworkFilterNavigationStack } from ".."
import { FilterData, FilterDisplayName, FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "../ArtworkFilterStore"
import { CustomSizeInputs } from "./CustomSizeInputs"
import { IS_USA, LOCALIZED_UNIT, localizeDimension, parseRange, Range, toIn } from "./helpers"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface NewSizesOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen"> {}

interface CustomSize {
  width: Range
  height: Range
}

const EUROPE_SIZE_OPTIONS: FilterData[] = [
  {
    displayText: "Small (under 40cm)",
    paramName: FilterParamName.sizes,
    paramValue: "SMALL",
  },
  {
    displayText: "Medium (40cm – 100cm)",
    paramName: FilterParamName.sizes,
    paramValue: "MEDIUM",
  },
  {
    displayText: "Large (over 100cm)",
    paramName: FilterParamName.sizes,
    paramValue: "LARGE",
  },
]

const USA_SIZE_OPTIONS: FilterData[] = [
  {
    displayText: "Small (under 16in)",
    paramName: FilterParamName.sizes,
    paramValue: "SMALL",
  },
  {
    displayText: "Medium (16in – 40in)",
    paramName: FilterParamName.sizes,
    paramValue: "MEDIUM",
  },
  {
    displayText: "Large (over 40in)",
    paramName: FilterParamName.sizes,
    paramValue: "LARGE",
  },
]

export const SIZES_OPTIONS = IS_USA ? USA_SIZE_OPTIONS : EUROPE_SIZE_OPTIONS

const DEFAULT_CUSTOM_SIZE: CustomSize = {
  width: {
    min: "*",
    max: "*",
  },
  height: {
    min: "*",
    max: "*",
  },
}

const CUSTOM_SIZE_OPTION_KEYS: Array<keyof CustomSize> = [FilterParamName.width, FilterParamName.height]

// Helpers
const getCustomValues = (options: FilterData[]) => {
  return options.reduce((acc, option) => {
    const { min, max } = parseRange(String(option.paramValue))

    return {
      ...acc,
      [option.paramName]: {
        min: localizeDimension(min, "in").value,
        max: localizeDimension(max, "in").value,
      },
    }
  }, DEFAULT_CUSTOM_SIZE)
}

export const NewSizesOptionsScreen: React.FC<NewSizesOptionsScreenProps> = ({ navigation }) => {
  const [key, setKey] = useState(0)
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)
  const { handleSelect, isSelected, handleClear } = useMultiSelect({
    options: SIZES_OPTIONS,
    paramName: FilterParamName.sizes,
  })
  const selectedOptions = useSelectedOptionsDisplay()
  const selectedCustomOptions = selectedOptions.filter((option) =>
    CUSTOM_SIZE_OPTION_KEYS.includes(option.paramName as keyof CustomSize)
  )
  const customValues = getCustomValues(selectedCustomOptions)
  const options = SIZES_OPTIONS.map((option) => ({
    ...option,
    paramValue: isSelected(option),
  }))

  const handleCustomInputChange = (paramName: FilterParamName) => (range: Range) => {
    handleClear()
    selectFiltersAction({
      displayText: `${range.min}-${range.max}`,
      paramName,
      paramValue: `${toIn(range.min, LOCALIZED_UNIT)}-${toIn(range.max, LOCALIZED_UNIT)}`,
    })
  }

  const clearCustomSizeValues = () => {
    CUSTOM_SIZE_OPTION_KEYS.forEach((option) => {
      selectFiltersAction({
        displayText: "",
        paramName: FilterParamName[option],
        paramValue: "*-*",
      })
    })
  }

  const handleSelectPredefinedOption = (option: FilterData, nextValue: boolean) => {
    clearCustomSizeValues()
    handleSelect(option, nextValue)
    setKey((n) => n + 1)
  }

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelectPredefinedOption}
      filterHeaderText={FilterDisplayName.sizes}
      filterOptions={options}
      navigation={navigation}
      useScrollView
      footerComponent={
        <Box mx={15} key={`footer-container-${key}`}>
          <Spacer mt={2} />
          <CustomSizeInputs
            label="Width"
            range={customValues.width}
            onChange={handleCustomInputChange(FilterParamName.width)}
          />
          <Spacer mt={2} />
          <CustomSizeInputs
            label="Height"
            range={customValues.height}
            onChange={handleCustomInputChange(FilterParamName.height)}
          />
          <Spacer mt={2} />
        </Box>
      }
    />
  )
}
