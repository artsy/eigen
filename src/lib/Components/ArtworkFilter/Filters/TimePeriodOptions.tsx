import { toTitleCase } from "@artsy/to-title-case"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
  getDisplayNameForTimePeriod,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { useArtworkFiltersAggregation } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { Flex, Input, Spacer, Text } from "palette"
import React, { useState } from "react"
import { ArtworkFilterBackHeader } from "../components/ArtworkFilterBackHeader"
import { MultiSelectOptionScreen } from "./MultiSelectOption"
import { useMultiSelect } from "./useMultiSelect"

interface TimePeriodOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "TimePeriodOptionsScreen"> {}

export const TimePeriodOptionsScreen: React.FC<TimePeriodOptionsScreenProps> = ({ navigation }) => {
  const { aggregation } = useArtworkFiltersAggregation({ paramName: FilterParamName.timePeriod })

  const options: FilterData[] = (aggregation?.counts ?? []).map(({ value: paramValue, name }) => {
    const label = getDisplayNameForTimePeriod(name)
    const displayText = toTitleCase(label)

    return { displayText, paramName: FilterParamName.timePeriod, paramValue }
  })

  const { handleSelect, handleClear, isSelected, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.timePeriod,
  })

  // Convert options to boolean options for checkboxes
  const filterOptions = options.map((option) => ({ ...option, paramValue: isSelected(option) }))
  const [multiSliderValue, setMultiSliderValue] = useState([1964, 2022])
  const [minYear, _setMinYear] = useState(1964)
  const [maxYear, _setMaxYear] = useState(2022)
  const multiSliderValuesChange = (values: number[]) => setMultiSliderValue(values)
  const handleChangeText = (text: string, index: number) => {
    if (index === 0) {
      setMultiSliderValue([Number(text), multiSliderValue[1]])
    }
    if (index === 1) {
      setMultiSliderValue([multiSliderValue[0], Number(text)])
    }
  }

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterBackHeader
        title="filterHeaderText"
        onLeftButtonPress={() => null}
        onRightButtonPress={() => null}
      />
      <Flex flexGrow={1}>
        <Flex flex={1} mx={5}>
          <Text>{multiSliderValue[0]}</Text>
          <Text>{multiSliderValue[1]}</Text>
          <Flex key="custom-price-holder" flexDirection="row" alignItems="center">
            <Input
              keyboardType="number-pad"
              value={multiSliderValue[0].toString()}
              onChangeText={(text) => handleChangeText(text, 0)}
            />
            <Spacer mx={2} />
            <Input
              keyboardType="number-pad"
              value={multiSliderValue[1].toString()}
              onChangeText={(text) => handleChangeText(text, 1)}
            />
          </Flex>
          <MultiSlider
            min={1964}
            max={2022}
            step={1}
            snapped
            onValuesChange={multiSliderValuesChange}
            allowOverlap={false}
            values={[multiSliderValue[0], multiSliderValue[1]]}
          />
          <Flex flexDirection="row" justifyContent="space-between">
            <Text>{minYear}</Text>
            <Text>{maxYear}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
