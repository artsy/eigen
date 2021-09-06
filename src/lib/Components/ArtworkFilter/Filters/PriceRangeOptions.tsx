import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Input } from "lib/Components/Input/Input"
import { isUndefined } from "lodash"
import { Flex, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { parsePriceRangeLabel, parseRange, Range } from "./helpers"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "PriceRangeOptionsScreen"> {}

const PARAM_NAME = FilterParamName.priceRange

export const CUSTOM_PRICE_OPTION = {
  displayText: "Custom Price",
  // Values need to be unique and we can't use "*-*" which is used by "All."
  // This essentially means the same thing.
  paramValue: "0-*",
  paramName: PARAM_NAME,
}

const PRICE_RANGE_OPTIONS: FilterData[] = [
  { displayText: "$50,000+", paramValue: "50000-*", paramName: PARAM_NAME },
  { displayText: "$10,000–50,000", paramValue: "10000-50000", paramName: PARAM_NAME },
  { displayText: "$5,000–10,000", paramValue: "5000-10000", paramName: PARAM_NAME },
  { displayText: "$1,000–5,000", paramValue: "1000-5000", paramName: PARAM_NAME },
  { displayText: "$0–1,000", paramValue: "*-1000", paramName: PARAM_NAME },
  CUSTOM_PRICE_OPTION,
]

const isCustomOption = (option: FilterData) => {
  return option.displayText === CUSTOM_PRICE_OPTION.displayText
}

const shouldShowCustomPrice = (option: FilterData) => {
  if (option.displayText !== "All") {
    const defaultPriceRange = PRICE_RANGE_OPTIONS.find(
      (priceOption) => priceOption.paramValue === (option.paramValue as string[])[0]
    )

    return isCustomOption(option) || isUndefined(defaultPriceRange)
  }

  return false
}

interface CustomPriceInputProps {
  initialValue: Range
  onChange(value: Range): void
}

export const CustomPriceInput: React.FC<CustomPriceInputProps> = ({
  initialValue = { min: "*", max: "*" },
  onChange,
}) => {
  const isMounted = useRef(false)
  const [state, setState] = useState<Range>(initialValue)

  const handleChange = (key: "min" | "max") => (text: string) => {
    const parsed = parseInt(text, 10)
    const value = isNaN(parsed) ? "*" : parsed
    setState((prevState) => ({ ...prevState, [key]: value }))
  }

  useEffect(() => {
    // Ignore initial mount
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    onChange(state)
  }, [state])

  return (
    <Flex flexDirection="row" alignItems="center" mt={1} mx={2} mb={2}>
      <Input
        placeholder="$ USD minimum"
        defaultValue={state.min === "*" || state.min === 0 ? undefined : String(state.min)}
        keyboardType="number-pad"
        onChangeText={handleChange("min")}
        autoFocus
      />

      <Text mx={2}>to</Text>

      <Input
        placeholder="$ USD maximum"
        defaultValue={state.max === "*" ? undefined : String(state.max)}
        keyboardType="number-pad"
        onChangeText={handleChange("max")}
      />
    </Flex>
  )
}

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const selectedOptions = useSelectedOptionsDisplay()
  const { handleSelect, isSelected } = useMultiSelect({
    options: PRICE_RANGE_OPTIONS,
    paramName: PARAM_NAME,
  })
  const selectedOption = selectedOptions.find((option) => option.paramName === PARAM_NAME)!
  const showCustomPrice = shouldShowCustomPrice(selectedOption)

  const handleCustomPriceChange = (value: Range) => {
    selectFiltersAction({
      displayText: parsePriceRangeLabel(value.min, value.max),
      paramValue: [`${value.min}-${value.max}`],
      paramName: PARAM_NAME,
    })
  }

  const selectOption = (option: FilterData, updatedValue: boolean) => {
    const isCustomPriceOption = isCustomOption(option)

    handleSelect(option, updatedValue, isCustomPriceOption || showCustomPrice)
  }

  const options = PRICE_RANGE_OPTIONS.map((option) => {
    if (isCustomOption(option)) {
      return {
        ...option,
        paramValue: showCustomPrice,
      }
    }

    return {
      ...option,
      paramValue: !showCustomPrice && isSelected(option),
    }
  })

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.priceRange}
      filterOptions={[
        ...options,
        ...(showCustomPrice
          ? [
              <CustomPriceInput
                initialValue={parseRange((selectedOption.paramValue as string[])[0])}
                onChange={handleCustomPriceChange}
              />,
            ]
          : []),
      ]}
      navigation={navigation}
    />
  )
}
