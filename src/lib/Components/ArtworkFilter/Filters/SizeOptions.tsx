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

const PARAM_NAME = FilterParamName.size // dimensionRange
const CUSTOM_SIZE_PARAMS = {
  width: FilterParamName.width,
  height: FilterParamName.height,
} as const

const CUSTOM_SIZE_OPTION = {
  displayText: "Custom size",
  // Values need to be unique and we can't use "*-*" which is used by "All."
  // This essentially means the same thing.
  paramValue: "0-*",
  paramName: PARAM_NAME,
}

// Parameter values for dimensions are specified in inches
const SIZE_OPTIONS: FilterData[] = IS_USA
  ? [
      { displayText: "All", paramValue: "*-*", paramName: PARAM_NAME },
      { displayText: `Small (under 16in)`, paramValue: "*-16.0", paramName: PARAM_NAME },
      { displayText: `Medium (under 16in – 40in)`, paramValue: "16.0-40.0", paramName: PARAM_NAME },
      { displayText: `Large (over 40in)`, paramValue: "40.0-*", paramName: PARAM_NAME },
      CUSTOM_SIZE_OPTION,
    ]
  : [
      { displayText: "All", paramValue: "*-*", paramName: PARAM_NAME },
      { displayText: `Small (under 40cm)`, paramValue: "*-16.0", paramName: PARAM_NAME },
      { displayText: `Medium (under 40cm – 100cm)`, paramValue: "16.0-40.0", paramName: PARAM_NAME },
      { displayText: `Large (over 100cm)`, paramValue: "40.0-*", paramName: PARAM_NAME },
      CUSTOM_SIZE_OPTION,
    ]

interface CustomSize {
  width: Range
  height: Range
}

const DEFAULT_CUSTOM_SIZE: CustomSize = { width: { min: "*", max: "*" }, height: { min: "*", max: "*" } }

interface CustomSizeInputProps {
  initialValue: CustomSize
  onChange(value: CustomSize): void
}

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
        />

        <Text mx={2}>to</Text>

        <Input
          placeholder={`Maximum ${LOCALIZED_UNIT}`}
          defaultValue={state.width.max === "*" ? undefined : String(state.width.max)}
          keyboardType="number-pad"
          onChangeText={handleChange("width")("max")}
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
        />

        <Text mx={2}>to</Text>

        <Input
          placeholder={`Maximum ${LOCALIZED_UNIT}`}
          defaultValue={state.height.max === "*" ? undefined : String(state.height.max)}
          keyboardType="number-pad"
          onChangeText={handleChange("height")("max")}
        />
      </Flex>
    </Flex>
  )
}

interface SizeOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizeOptionsScreen"> {}

export const SizeOptionsScreen: React.FC<SizeOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === PARAM_NAME)!
  const selectedCustomOptions = selectedOptions.filter(
    (option) => option.paramName === CUSTOM_SIZE_PARAMS.width || option.paramName === CUSTOM_SIZE_PARAMS.height
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
    } else {
      showCustomSize(false)
      resetCustomPrice()
    }

    selectFiltersAction({
      displayText: option.displayText,
      paramValue: option.paramValue,
      paramName: PARAM_NAME,
    })
  }

  const resetCustomPrice = () => {
    ;(Object.keys(CUSTOM_SIZE_PARAMS) as Array<keyof typeof CUSTOM_SIZE_PARAMS>).forEach((paramName) => {
      selectFiltersAction({
        displayText: "All",
        paramName: CUSTOM_SIZE_PARAMS[paramName],
        paramValue: ParamDefaultValues[paramName],
      })
    })
  }

  const handleCustomPriceChange = (value: CustomSize) => {
    ;(Object.keys(CUSTOM_SIZE_PARAMS) as Array<keyof typeof CUSTOM_SIZE_PARAMS>).forEach((paramName) => {
      selectFiltersAction({
        displayText: `${value[paramName].min}-${value[paramName].max}`,
        paramName: CUSTOM_SIZE_PARAMS[paramName],
        paramValue: `${toIn(value[paramName].min, LOCALIZED_UNIT)}-${toIn(value[paramName].max, LOCALIZED_UNIT)}`,
      })
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.size}
      selectedOption={selectedOption}
      navigation={navigation}
      filterOptions={[
        ...SIZE_OPTIONS,
        ...(shouldShowCustomSize
          ? [<CustomSizeInput initialValue={customInitialValue} onChange={handleCustomPriceChange} />]
          : []),
      ]}
    />
  )
}
