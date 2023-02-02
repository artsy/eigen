import { Spacer, Flex, Box } from "@artsy/palette-mobile"
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
import { Metric } from "app/Scenes/Search/UserPrefsModel"
import { RadioButton, Text } from "palette"
import React, { useEffect, useState } from "react"
import { CustomSizeInputs } from "./CustomSizeInputs"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { localizeDimension, parseRange, Range, toIn } from "./helpers"
import { useMultiSelect } from "./useMultiSelect"
import { ArtworkFilterNavigationStack } from ".."

export interface CustomSize {
  width: Range
  height: Range
}

type SizesOptionsScreenProps = StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen">
interface CustomSizeInputsContainerProps {
  values: CustomSize
  active?: boolean
  onChange: (values: CustomSize) => void
  handleMetricChange: (metric: Metric) => void
  metric: Metric
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

export const getSizeOptions = (unit: Metric) => {
  return unit === "in" ? USA_SIZE_OPTIONS : EUROPE_SIZE_OPTIONS
}

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
export const getCustomValues = (options: FilterData[], unit: Metric) => {
  return options.reduce((acc, option) => {
    const { min, max } = parseRange(String(option.paramValue))

    return {
      ...acc,
      [option.paramName]: {
        min: localizeDimension(min, unit),
        max: localizeDimension(max, unit),
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

const metrics: Metric[] = ["cm", "in"]

const CustomSizeInputsContainer: React.FC<CustomSizeInputsContainerProps> = ({
  values,
  active,
  onChange,
  handleMetricChange,
  metric,
}) => {
  const handleChange = (paramName: FilterParamName) => (range: Range) => {
    onChange({ ...values, [paramName]: range })
  }

  return (
    <Box mx="15px" my={2}>
      <Flex flexDirection="row">
        {metrics.map((currentMetric) => {
          const isSelected = metric === currentMetric
          return (
            <React.Fragment key={currentMetric}>
              <RadioButton
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={currentMetric}
                selected={isSelected}
                onPress={() => handleMetricChange(currentMetric)}
              />
              <Text marginRight="4">{currentMetric}</Text>
            </React.Fragment>
          )
        })}
      </Flex>
      <Spacer y={2} />
      <CustomSizeInputs
        label="Width"
        range={values.width}
        active={active}
        onChange={handleChange(FilterParamName.width)}
        selectedMetric={metric}
      />
      <Spacer y={2} />
      <CustomSizeInputs
        label="Height"
        range={values.height}
        active={active}
        onChange={handleChange(FilterParamName.height)}
        selectedMetric={metric}
      />
    </Box>
  )
}

export const SizesOptionsScreen: React.FC<SizesOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const setSelectedMetric = ArtworksFiltersStore.useStoreActions((state) => state.setSizeMetric)
  const selectedMetric = ArtworksFiltersStore.useStoreState((state) => state.sizeMetric)

  const sizesOptions = getSizeOptions(selectedMetric)

  const {
    handleSelect,
    isSelected,
    handleClear: clearPredefinedValues,
    isActive: isActivePredefinedValues,
  } = useMultiSelect({
    options: getSizeOptions(selectedMetric),
    paramName: FilterParamName.sizes,
  })
  const selectedOptions = useSelectedOptionsDisplay()
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const selectedCustomOptions = selectedOptions.filter((option) =>
    CUSTOM_SIZE_OPTION_KEYS.includes(option.paramName as keyof CustomSize)
  )
  const [customValues, setCustomValues] = useState(
    getCustomValues(selectedCustomOptions, selectedMetric)
  )
  const [customSizeSelected, setCustomSizeSelected] = useState(
    !checkIsEmptyCustomValues(customValues)
  )
  const [key, setKey] = useState(0)
  const shouldShowCustomInputs = filterType !== "auctionResult"
  const isActive = isActivePredefinedValues || !checkIsEmptyCustomValues(customValues)

  const handleMetricChange = (newMetric: Metric) => {
    setSelectedMetric(newMetric)
  }

  // Options
  let options: FilterData[] = sizesOptions.map((option) => ({
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

  useEffect(() => {
    if (customSizeSelected) {
      handleCustomInputsChange(customValues)
    }
  }, [selectedMetric])

  const selectCustomFiltersAction = (values: CustomSize) => {
    CUSTOM_SIZE_OPTION_KEYS.forEach((paramName) => {
      const value = values[paramName]
      const localizedMinValue = toIn(value.min, selectedMetric)
      const localizedMaxValue = toIn(value.max, selectedMetric)

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
            handleMetricChange={handleMetricChange}
            metric={selectedMetric}
          />
        ) : null
      }
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
