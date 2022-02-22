import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import {
  AggregateOption,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Flex, Input, Spacer } from "palette"
import React, { useState } from "react"
import { parsePriceRangeLabel, parseRange, Range } from "./helpers"
import { ListItem, SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "PriceRangeOptionsScreen"> {}

const PARAM_NAME = FilterParamName.priceRange

const DEFAULT_PRICE_OPTION = {
  displayText: "Choose Your Price",
  paramValue: "*-*",
  paramName: PARAM_NAME,
}

const PRICE_RANGE_OPTIONS: FilterData[] = [
  { displayText: "$50,000+", paramValue: "50000-*", paramName: PARAM_NAME },
  { displayText: "$10,000–50,000", paramValue: "10000-50000", paramName: PARAM_NAME },
  { displayText: "$5,000–10,000", paramValue: "5000-10000", paramName: PARAM_NAME },
  { displayText: "$1,000–5,000", paramValue: "1000-5000", paramName: PARAM_NAME },
  { displayText: "$0–1,000", paramValue: "*-1000", paramName: PARAM_NAME },
]

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedFilterOption = selectedOptions.find((option) => option.paramName === PARAM_NAME)!
  const isCustomOption = PRICE_RANGE_OPTIONS.every(
    (option) => option.paramValue !== selectedFilterOption.paramValue
  )
  const [customPriceValue, setCustomPriceValue] = useState(
    parseRange(
      isCustomOption ? (selectedFilterOption.paramValue as string) : DEFAULT_PRICE_OPTION.paramValue
    )
  )
  const [customSelected, setCustomSelected] = useState(isCustomOption)
  const selectedOption = customSelected ? DEFAULT_PRICE_OPTION : selectedFilterOption
  const isActive = selectedFilterOption.paramValue !== DEFAULT_PRICE_OPTION.paramValue

  const handleChange = (key: "min" | "max") => (text: string) => {
    const parsed = parseInt(text, 10)
    const parsedValue = isNaN(parsed) ? "*" : parsed
    handleCustomPriceChange({ ...customPriceValue, [key]: parsedValue })
  }

  const selectOption = (option: AggregateOption) => {
    setCustomSelected(false)
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: option.paramValue,
      paramName: PARAM_NAME,
    })
  }

  const handleSelectCustomOption = () => {
    handleCustomPriceChange(customPriceValue)
  }

  const handleCustomPriceChange = (value: Range) => {
    setCustomPriceValue(value)
    setCustomSelected(true)
    selectFiltersAction({
      displayText: parsePriceRangeLabel(value.min, value.max),
      paramValue: `${value.min}-${value.max}`,
      paramName: PARAM_NAME,
    })
  }

  const handleClear = () => {
    const defaultRangeValue = parseRange(DEFAULT_PRICE_OPTION.paramValue)
    handleCustomPriceChange(defaultRangeValue)
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.priceRange}
      useScrollView
      filterOptions={[
        <ListItem
          key="default-price"
          item={DEFAULT_PRICE_OPTION}
          selectedOption={selectedOption}
          onSelect={handleSelectCustomOption}
        />,
        <Flex key="custom-price-holder" flexDirection="row" alignItems="center" mb={1} mx={2}>
          <Input
            description="Min"
            placeholder="$USD"
            enableClearButton
            keyboardType="number-pad"
            value={customPriceValue.min === "*" ? undefined : String(customPriceValue.min)}
            onChangeText={handleChange("min")}
            onFocus={handleSelectCustomOption}
            testID="price-min-input"
          />
          <Spacer mx={2} />
          <Input
            description="Max"
            placeholder="$USD"
            enableClearButton
            keyboardType="number-pad"
            value={customPriceValue.max === "*" ? undefined : String(customPriceValue.max)}
            onChangeText={handleChange("max")}
            onFocus={handleSelectCustomOption}
            testID="price-max-input"
          />
        </Flex>,
        ...PRICE_RANGE_OPTIONS,
      ]}
      selectedOption={selectedOption}
      navigation={navigation}
      {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
    />
  )
}
