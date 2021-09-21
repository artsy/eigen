import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import {
  AggregateOption,
  FilterData,
  FilterDisplayName,
  FilterParamName,
  ParamDefaultValues,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Input } from "lib/Components/Input/Input"
import { Flex, Spacer, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { IS_USA, LOCALIZED_UNIT, localizeDimension, parseRange, Range, toIn } from "./helpers"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface CustomSize {
  width: Range
  height: Range
}

interface CustomSizeInputProps {
  initialValue: CustomSize
  onChange(value: CustomSize): void
}

const PARAM_NAME = FilterParamName.size // dimensionRange
const CUSTOM_SIZE_OPTION_KEYS: Array<keyof CustomSize> = [FilterParamName.width, FilterParamName.height]

const CUSTOM_SIZE_OPTION = {
  displayText: "Custom Size",
  // Values need to be unique and we can't use "*-*" which is used by "All."
  // This essentially means the same thing.
  paramValue: "0-*",
  paramName: PARAM_NAME,
}
const DEFAULT_SIZE_OPTION = {
  displayText: "All",
  paramValue: "*-*",
  paramName: PARAM_NAME,
}

// Parameter values for dimensions are specified in inches
export const SIZE_OPTIONS: FilterData[] = IS_USA
  ? [
      DEFAULT_SIZE_OPTION,
      { displayText: `Small (under 16in)`, paramValue: "*-16.0", paramName: PARAM_NAME },
      { displayText: `Medium (16in – 40in)`, paramValue: "16.0-40.0", paramName: PARAM_NAME },
      { displayText: `Large (over 40in)`, paramValue: "40.0-*", paramName: PARAM_NAME },
      CUSTOM_SIZE_OPTION,
    ]
  : [
      DEFAULT_SIZE_OPTION,
      { displayText: `Small (under 40cm)`, paramValue: "*-16.0", paramName: PARAM_NAME },
      { displayText: `Medium (40cm – 100cm)`, paramValue: "16.0-40.0", paramName: PARAM_NAME },
      { displayText: `Large (over 100cm)`, paramValue: "40.0-*", paramName: PARAM_NAME },
      CUSTOM_SIZE_OPTION,
    ]

const DEFAULT_CUSTOM_SIZE: CustomSize = { width: { min: "*", max: "*" }, height: { min: "*", max: "*" } }

const CustomSizeInput: React.FC<CustomSizeInputProps> = ({ initialValue, onChange }) => {
  const [state, setState] = useState<CustomSize>(initialValue)

  const handleChange = (dimension: keyof CustomSize) => (attr: keyof Range) => (text: string) => {
    const parsed = parseFloat(text)
    const value = isNaN(parsed) ? "*" : parsed
    setState((prevState) => ({ ...prevState, [dimension]: { ...prevState[dimension], [attr]: value } }))
  }

  const isMounted = useRef(false)
  useEffect(() => {
    // Ignore initial mount
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    onChange(state)
  }, [state])

  return (
    <Flex mt={1} mx={2} mb={2}>
      <Text variant="mediumText" mb={1}>
        Width
      </Text>

      <Flex flexDirection="row" alignItems="center">
        <Input
          placeholder={`Minimum ${LOCALIZED_UNIT}`}
          defaultValue={state.width.min === "*" || state.width.min === 0 ? undefined : String(state.width.min)}
          keyboardType="number-pad"
          onChangeText={handleChange("width")("min")}
          accessibilityLabel="Minimum width input"
        />

        <Text mx={2}>to</Text>

        <Input
          placeholder={`Maximum ${LOCALIZED_UNIT}`}
          defaultValue={state.width.max === "*" ? undefined : String(state.width.max)}
          keyboardType="number-pad"
          onChangeText={handleChange("width")("max")}
          accessibilityLabel="Maximum width input"
        />
      </Flex>

      <Spacer mt={2} />

      <Text variant="mediumText" mb={1}>
        Height
      </Text>

      <Flex flexDirection="row" alignItems="center">
        <Input
          placeholder={`Minimum ${LOCALIZED_UNIT}`}
          defaultValue={state.height.min === "*" || state.height.min === 0 ? undefined : String(state.height.min)}
          keyboardType="number-pad"
          onChangeText={handleChange("height")("min")}
          accessibilityLabel="Minimum height input"
        />

        <Text mx={2}>to</Text>

        <Input
          placeholder={`Maximum ${LOCALIZED_UNIT}`}
          defaultValue={state.height.max === "*" ? undefined : String(state.height.max)}
          keyboardType="number-pad"
          onChangeText={handleChange("height")("max")}
          accessibilityLabel="Maximum height input"
        />
      </Flex>
    </Flex>
  )
}

interface SizeOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizeOptionsScreen"> {}

export const SizeOptionsScreen: React.FC<SizeOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === PARAM_NAME)!
  const appliedOption = appliedFilters.find((option) => option.paramName === PARAM_NAME)
  const defaultOption = appliedOption ?? DEFAULT_SIZE_OPTION
  const selectedCustomOptions = selectedOptions.filter((option) =>
    CUSTOM_SIZE_OPTION_KEYS.includes(option.paramName as keyof CustomSize)
  )
  const isCustomSize = selectedOption.displayText === CUSTOM_SIZE_OPTION.displayText
  const [shouldShowCustomSize, showCustomSize] = useState(isCustomSize)

  const customInitialValue = selectedCustomOptions.reduce((acc, option) => {
    const { min, max } = parseRange(String(option.paramValue))

    return {
      ...acc,
      [option.paramName]: {
        min: localizeDimension(min, "in").value,
        max: localizeDimension(max, "in").value,
      },
    }
  }, DEFAULT_CUSTOM_SIZE)

  const selectOption = (option: AggregateOption) => {
    if (option.displayText === CUSTOM_SIZE_OPTION.displayText) {
      showCustomSize(true)
      selectFiltersAction(defaultOption)
    } else {
      showCustomSize(false)
      resetCustomPrice()
      selectFiltersAction({
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName: PARAM_NAME,
      })
    }
  }

  const resetCustomPrice = () => {
    CUSTOM_SIZE_OPTION_KEYS.forEach((paramName) => {
      selectFiltersAction({
        displayText: "All",
        paramName: paramName as FilterParamName,
        paramValue: ParamDefaultValues[paramName],
      })
    })
  }

  const handleCustomPriceChange = (value: CustomSize) => {
    const isEmptyCustomValues = CUSTOM_SIZE_OPTION_KEYS.every((key) => {
      const paramValue = value[key]
      return paramValue.min === "*" && paramValue.max === "*"
    })

    // Populate the custom size filter only when we have at least one specified input
    if (isEmptyCustomValues) {
      selectFiltersAction(defaultOption)
    } else {
      selectFiltersAction(CUSTOM_SIZE_OPTION)
    }

    CUSTOM_SIZE_OPTION_KEYS.forEach((paramName) => {
      selectFiltersAction({
        displayText: `${value[paramName].min}-${value[paramName].max}`,
        paramName: paramName as FilterParamName,
        paramValue: `${toIn(value[paramName].min, LOCALIZED_UNIT)}-${toIn(value[paramName].max, LOCALIZED_UNIT)}`,
      })
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.size}
      selectedOption={shouldShowCustomSize ? CUSTOM_SIZE_OPTION : selectedOption}
      navigation={navigation}
      useScrollView={true}
      filterOptions={[
        ...SIZE_OPTIONS,
        ...(shouldShowCustomSize
          ? [<CustomSizeInput initialValue={customInitialValue} onChange={handleCustomPriceChange} />]
          : []),
      ]}
    />
  )
}
