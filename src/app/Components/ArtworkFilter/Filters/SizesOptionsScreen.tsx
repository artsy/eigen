import { StackScreenProps } from "@react-navigation/stack"
import { Box, Spacer } from "palette"
import { useState } from "react"
import { ArtworkFilterNavigationStack } from ".."
import { FilterData, FilterDisplayName, FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "../ArtworkFilterStore"
import { CustomSizeInputs } from "./CustomSizeInputs"
import { IS_USA, LOCALIZED_UNIT, localizeDimension, parseRange, Range, toIn } from "./helpers"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

export interface CustomSize {
  width: Range
  height: Range
}

interface SizesOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen"> {}
interface CustomSizeInputsContainerProps {
  values: CustomSize
  active?: boolean
  onChange: (values: CustomSize) => void
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

const CUSTOM_SIZE_OPTION_KEYS: Array<keyof CustomSize> = [
  FilterParamName.width,
  FilterParamName.height,
]

// Helpers
export const getCustomValues = (options: FilterData[]) => {
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

export const checkIsEmptyCustomValues = (values: CustomSize) => {
  return CUSTOM_SIZE_OPTION_KEYS.every((key) => {
    const paramValue = values[key]
    return paramValue.min === "*" && paramValue.max === "*"
  })
}

const CustomSizeInputsContainer: React.FC<CustomSizeInputsContainerProps> = ({
  values,
  active,
  onChange,
}) => {
  const handleChange = (paramName: FilterParamName) => (range: Range) => {
    onChange({ ...values, [paramName]: range })
  }

  return (
    <Box mx={15} my={2}>
      <CustomSizeInputs
        label="Width"
        range={values.width}
        active={active}
        onChange={handleChange(FilterParamName.width)}
      />
      <Spacer mt={2} />
      <CustomSizeInputs
        label="Height"
        range={values.height}
        active={active}
        onChange={handleChange(FilterParamName.height)}
      />
    </Box>
  )
}

export const SizesOptionsScreen: React.FC<SizesOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )
  const {
    handleSelect,
    isSelected,
    handleClear: clearPredefinedValues,
    isActive: isActivePredefinedValues,
  } = useMultiSelect({
    options: SIZES_OPTIONS,
    paramName: FilterParamName.sizes,
  })
  const selectedOptions = useSelectedOptionsDisplay()
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const selectedCustomOptions = selectedOptions.filter((option) =>
    CUSTOM_SIZE_OPTION_KEYS.includes(option.paramName as keyof CustomSize)
  )
  const [customValues, setCustomValues] = useState(getCustomValues(selectedCustomOptions))
  const [customSizeSelected, setCustomSizeSelected] = useState(
    !checkIsEmptyCustomValues(customValues)
  )
  const [key, setKey] = useState(0)
  const shouldShowCustomInputs = filterType !== "auctionResult"
  const isActive = isActivePredefinedValues || !checkIsEmptyCustomValues(customValues)

  // Options
  let options: FilterData[] = SIZES_OPTIONS.map((option) => ({
    ...option,
    paramValue: isSelected(option),
  }))

  if (shouldShowCustomInputs) {
    options = [
      ...options,
      {
        displayText: "Custom Size",
        paramValue: customSizeSelected,
        paramName: FilterParamName.sizes,
      },
    ]
  }

  const selectCustomFiltersAction = (values: CustomSize) => {
    CUSTOM_SIZE_OPTION_KEYS.forEach((paramName) => {
      const value = values[paramName]
      const localizedMinValue = toIn(value.min, LOCALIZED_UNIT)
      const localizedMaxValue = toIn(value.max, LOCALIZED_UNIT)

      selectFiltersAction({
        displayText: `${value.min}-${value.max}`,
        paramName: paramName as FilterParamName,
        paramValue: `${localizedMinValue}-${localizedMaxValue}`,
      })
    })
  }

  const handleCustomInputsChange = (values: CustomSize) => {
    const isEmptyCustomValues = checkIsEmptyCustomValues(values)

    setCustomValues(values)
    setCustomSizeSelected(!isEmptyCustomValues)
    selectCustomFiltersAction(values)
    clearPredefinedValues()
  }

  const clearCustomSizeValues = () => {
    setCustomSizeSelected(false)

    CUSTOM_SIZE_OPTION_KEYS.forEach((option) => {
      selectFiltersAction({
        displayText: "",
        paramName: FilterParamName[option],
        paramValue: "*-*",
      })
    })
  }

  const handleSelectOption = (option: FilterData, nextValue: boolean) => {
    if (option.displayText === "Custom Size") {
      clearPredefinedValues()

      if (nextValue) {
        setCustomSizeSelected(true)
        selectCustomFiltersAction(customValues)
      } else {
        clearCustomSizeValues()
      }

      return
    }

    clearCustomSizeValues()
    handleSelect(option, nextValue)
  }

  const handleClear = () => {
    clearPredefinedValues()
    clearCustomSizeValues()
    setCustomValues(DEFAULT_CUSTOM_SIZE)
    setKey((n) => n + 1)
  }

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelectOption}
      filterHeaderText={FilterDisplayName.sizes}
      filterOptions={options}
      navigation={navigation}
      useScrollView
      footerComponent={
        shouldShowCustomInputs ? (
          <CustomSizeInputsContainer
            key={`footer-container-${key}`}
            values={customValues}
            active={customSizeSelected}
            onChange={handleCustomInputsChange}
          />
        ) : null
      }
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
