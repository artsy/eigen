import { StackScreenProps } from "@react-navigation/stack"
import { Box, Flex, Input, Join, Spacer, Text } from "palette"
import React from "react"
import { ArtworkFilterNavigationStack } from ".."
import { FilterData, FilterDisplayName, FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "../ArtworkFilterStore"
import { IS_USA, LOCALIZED_UNIT, localizeDimension, Numeric, parseRange, Range, toIn } from "./helpers"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface NewSizesOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen"> {}

interface CustomInputsProps {
  label: string
  range: Range
  onChange: (range: Range) => void
}

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
const getValue = (value: Numeric) => {
  if (value === "*" || value === 0) {
    return
  }

  return value.toString()
}

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

const CustomInputs: React.FC<CustomInputsProps> = ({ label, range, onChange }) => {
  const handleInputChange = (field: string) => (text: string) => {
    const parsed = parseFloat(text)
    const value = isNaN(parsed) ? "*" : parsed

    onChange({ ...range, [field]: value })
  }

  return (
    <Box>
      <Text variant="xs" caps mb={0.5}>
        {label}
      </Text>
      <Flex flexDirection="row">
        <Join separator={<Spacer ml={2} />}>
          <Flex flex={1}>
            <Text variant="xs" mb={0.5}>
              Min
            </Text>
            <Input
              keyboardType="number-pad"
              onChangeText={handleInputChange("min")}
              accessibilityLabel={`Minimum ${label} Input`}
              value={getValue(range.min)}
            />
          </Flex>
          <Flex flex={1}>
            <Text variant="xs" mb={0.5}>
              Max
            </Text>
            <Input
              keyboardType="number-pad"
              onChangeText={handleInputChange("max")}
              accessibilityLabel={`Maximum ${label} Input`}
              value={getValue(range.max)}
            />
          </Flex>
        </Join>
      </Flex>
    </Box>
  )
}

export const NewSizesOptionsScreen: React.FC<NewSizesOptionsScreenProps> = ({ navigation }) => {
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

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.sizes}
      filterOptions={options}
      navigation={navigation}
      useScrollView
      footerComponent={
        <Box mx={15}>
          <Spacer mt={2} />
          <CustomInputs
            label="Width"
            range={customValues.width}
            onChange={handleCustomInputChange(FilterParamName.width)}
          />
          <Spacer mt={2} />
          <CustomInputs
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
