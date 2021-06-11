import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import {
  AggregateOption,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Input } from "lib/Components/Input/Input"
import { Flex, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { parseRange, Range } from "./helpers"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "PriceRangeOptionsScreen"> {}

const PARAM_NAME = FilterParamName.priceRange

export const CUSTOM_PRICE_OPTION = {
  displayText: "Custom price",
  // Values need to be unique and we can't use "*-*" which is used by "All."
  // This essentially means the same thing.
  paramValue: "0-*",
  paramName: PARAM_NAME,
}

const PRICE_RANGE_OPTIONS: FilterData[] = [
  { displayText: "All", paramValue: "*-*", paramName: PARAM_NAME },
  { displayText: "$50,000+", paramValue: "50000-*", paramName: PARAM_NAME },
  { displayText: "$10,000–50,000", paramValue: "10000-50000", paramName: PARAM_NAME },
  { displayText: "$5,000–10,000", paramValue: "5000-10000", paramName: PARAM_NAME },
  { displayText: "$1,000–5,000", paramValue: "1000-5000", paramName: PARAM_NAME },
  { displayText: "$0–1,000", paramValue: "*-1000", paramName: PARAM_NAME },
  CUSTOM_PRICE_OPTION,
]

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
  const selectedOption = selectedOptions.find((option) => option.paramName === PARAM_NAME)!

  const isCustomPrice =
    // Is the placeholder custom price option
    selectedOption.displayText === CUSTOM_PRICE_OPTION.displayText ||
    // Isn't a pre-defined price range option
    PRICE_RANGE_OPTIONS.find((option) => option.paramValue === selectedOption.paramValue) === undefined

  const [shouldShowCustomPrice, showCustomPrice] = useState(isCustomPrice)

  const selectOption = (option: AggregateOption) => {
    showCustomPrice(option.displayText === CUSTOM_PRICE_OPTION.displayText)

    selectFiltersAction({
      displayText: option.displayText,
      paramValue: option.paramValue,
      paramName: PARAM_NAME,
    })
  }

  const handleCustomPriceChange = (value: Range) => {
    const min = value.min === "*" ? "0" : `$${value.min.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
    const max = value.max === "*" ? "+" : `–${value.max.toLocaleString("en-US", { maximumFractionDigits: 2 })}`

    selectFiltersAction({
      displayText: [min, max].join(""),
      paramValue: `${value.min}-${value.max}`,
      paramName: PARAM_NAME,
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.priceRange}
      filterOptions={[
        ...PRICE_RANGE_OPTIONS,
        ...(shouldShowCustomPrice
          ? [
              <CustomPriceInput
                initialValue={parseRange(selectedOption.paramValue as string)}
                onChange={handleCustomPriceChange}
              />,
            ]
          : []),
      ]}
      selectedOption={isCustomPrice ? CUSTOM_PRICE_OPTION : selectedOption}
      navigation={navigation}
    />
  )
}
