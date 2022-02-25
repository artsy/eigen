import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Flex, Input, Spacer, Text, useColor } from "palette"
import React, { useState } from "react"
import { ScrollView, useWindowDimensions } from "react-native"
import { ArtworkFilterBackHeader } from "../components/ArtworkFilterBackHeader"
import { parsePriceRangeLabel } from "./helpers"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "PriceRangeOptionsScreen"> {}

const PARAM_NAME = FilterParamName.priceRange

const DEFAULT_PRICE_OPTION = {
  displayText: "Choose Your Price",
  paramValue: "*-*",
  paramName: PARAM_NAME,
}
const DEFAULT_PRICE_RANGE = "*-*"
const DEFAULT_RANGE = [0, 50000]

type CustomRange = Array<number | "*">

const parseRange = (range: string = DEFAULT_PRICE_RANGE): CustomRange => {
  return range.split("-").map((s) => {
    if (s === "*") {
      return s
    }
    return parseInt(s, 10)
  })
}

const parseSliderRange = (range: CustomRange): number[] => {
  return range.map((value, index) => {
    if (value === "*") {
      return DEFAULT_RANGE[index]
    }

    return value as number
  })
}

const convertToArtworkFilterFormatRange = (range: number[]): CustomRange => {
  return range.map((value, index) => {
    if (value === DEFAULT_RANGE[index]) {
      return "*"
    }

    return value
  })
}

const getInputValue = (value: CustomRange[number]) => {
  return value === "*" || value === 0 ? "" : value.toString()
}

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions()
  const color = useColor()
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
  const [defaultMinValue, defaultMaxValue] = DEFAULT_RANGE

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()

  const selectedFilterOption = selectedOptions.find((option) => option.paramName === PARAM_NAME)!
  const isCustomOption = DEFAULT_PRICE_OPTION.paramValue !== selectedFilterOption.paramValue

  const [range, setRange] = useState(
    isCustomOption
      ? parseRange(selectedFilterOption.paramValue as string)
      : parseRange(DEFAULT_PRICE_OPTION.paramValue)
  )
  const [minValue, maxValue] = range
  const sliderRange = parseSliderRange(range)
  const filterHeaderText = FilterDisplayName.priceRange

  const handleClear = () => {
    const defaultRangeValue = parseRange(DEFAULT_PRICE_OPTION.paramValue)
    setRange(parseRange(DEFAULT_PRICE_OPTION.paramValue))
    handleCustomPriceChange(defaultRangeValue)
  }

  const isActive = selectedFilterOption.paramValue !== DEFAULT_PRICE_OPTION.paramValue

  const handleTextChange = (changedIndex: number) => (value: string) => {
    const updatedRange = range.map((rangeValue, index) => {
      if (index === changedIndex) {
        if (value === "" || value === "0") {
          return "*"
        }

        return parseInt(value, 10)
      }

      return rangeValue
    })

    updateRange(updatedRange)
  }

  const handleSliderValueChange = (value: number[]) => {
    const convertedRange = convertToArtworkFilterFormatRange(value)

    updateRange(convertedRange)
  }

  const updateRange = (updatedRange: CustomRange) => {
    setRange(updatedRange)
    handleCustomPriceChange(updatedRange)
  }

  const handleCustomPriceChange = (value: CustomRange) => {
    selectFiltersAction({
      displayText: parsePriceRangeLabel(value[0], value[1]),
      paramValue: `${value[0]}-${value[1]}`,
      paramName: PARAM_NAME,
    })
  }

  return (
    <Flex flexGrow={1}>
      {isEnabledImprovedAlertsFlow ? (
        <ArtworkFilterBackHeader
          title={filterHeaderText}
          onLeftButtonPress={navigation.goBack}
          {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
        />
      ) : (
        <FancyModalHeader onLeftButtonPress={navigation.goBack}>
          {filterHeaderText}
        </FancyModalHeader>
      )}
      <Flex flexGrow={1}>
        <ScrollView style={{ flex: 1 }}>
          <Flex m={2}>
            <Text variant="md">Choose Your Price Range</Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center" mb={1} mx={2}>
            <Input
              description="Min"
              placeholder="$USD"
              enableClearButton
              keyboardType="number-pad"
              value={getInputValue(minValue)}
              onChangeText={handleTextChange(0)}
              testID="price-min-input"
              descriptionColor="black100"
            />
            <Spacer mx={2} />
            <Input
              description="Max"
              placeholder="$USD"
              enableClearButton
              keyboardType="number-pad"
              value={getInputValue(maxValue)}
              onChangeText={handleTextChange(1)}
              testID="price-max-input"
              descriptionColor="black100"
            />
          </Flex>
          <Spacer mx={2} my={2} />
          <Flex mx={2}>
            <Flex alignItems="center" testID="slider">
              <MultiSlider
                min={defaultMinValue}
                max={defaultMaxValue}
                step={5}
                snapped
                // 40 here is the horizontal padding of the slider container
                sliderLength={width - 40}
                onValuesChange={handleSliderValueChange}
                allowOverlap={false}
                values={sliderRange}
                trackStyle={{
                  backgroundColor: color("black30"),
                }}
                selectedStyle={{
                  backgroundColor: color("blue100"),
                }}
                markerStyle={{
                  height: 32,
                  width: 32,
                  borderRadius: 16,
                  backgroundColor: color("white100"),
                  borderColor: color("black10"),
                  borderWidth: 1,
                  shadowRadius: 2,
                  elevation: 5,
                }}
                pressedMarkerStyle={{
                  height: 32,
                  width: 32,
                  borderRadius: 16,
                }}
              />
            </Flex>
            <Flex flexDirection="row" justifyContent="space-between">
              <Text variant="xs" color="black60">
                ${defaultMinValue}
              </Text>
              <Text variant="xs" color="black60">
                ${defaultMaxValue}+
              </Text>
            </Flex>
          </Flex>
        </ScrollView>
      </Flex>
    </Flex>
  )
}
