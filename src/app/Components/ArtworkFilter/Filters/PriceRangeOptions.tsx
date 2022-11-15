import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  Aggregations,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { useRecentPriceRanges } from "app/store/RecentPriceRangesModel"
import { useExperimentFlag } from "app/utils/experiments/hooks"
import { debounce, sortBy } from "lodash"
import {
  Flex,
  Histogram,
  HistogramBarEntity,
  Input,
  Join,
  Pill,
  Spacer,
  Text,
  useColor,
  useSpace,
} from "palette"
import React, { useMemo, useState } from "react"
import { ScrollView, TouchableOpacity, useWindowDimensions } from "react-native"
import { ArtworkFilterBackHeader } from "../components/ArtworkFilterBackHeader"
import { Numeric, parsePriceRangeLabel } from "./helpers"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "PriceRangeOptionsScreen"> {}

const PARAM_NAME = FilterParamName.priceRange

const DEFAULT_PRICE_OPTION = {
  displayText: "Choose Your Price",
  paramValue: "*-*",
  paramName: PARAM_NAME,
}

export const getBarsFromAggregations = (aggregations?: Aggregations) => {
  const histogramAggregation = aggregations?.find(
    (aggregation) => aggregation.slice === "SIMPLE_PRICE_HISTOGRAM"
  )
  const counts = histogramAggregation?.counts ?? []
  const bars: HistogramBarEntity[] = counts.map((entity) => ({
    count: entity.count,
    value: Number(entity.value),
  }))
  const sortedBars = sortBy(bars, "value")

  return sortedBars
}

const NUMBERS_REGEX = /^(|\d)+$/
const DEBOUNCE_DELAY = 200
const DEFAULT_PRICE_RANGE = DEFAULT_PRICE_OPTION.paramValue
const DEFAULT_RANGE = [0, 50000]
const RANGE_DOT_SIZE = 32
const SLIDER_STEP_VALUE = 100

type CustomRange = Numeric[]

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

const convertToFilterFormatRange = (range: number[]): CustomRange => {
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
  const recentPriceRanges = useRecentPriceRanges()
  const enableRecentPriceRanges = useFeatureFlag("ARRecentPriceRanges")
  const color = useColor()
  const space = useSpace()

  const enableHistogram = useExperimentFlag("eigen-enable-price-histogram")

  const [defaultMinValue, defaultMaxValue] = DEFAULT_RANGE

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()

  const selectedFilterOption = selectedOptions.find((option) => option.paramName === PARAM_NAME)!

  const [range, setRange] = useState(parseRange(selectedFilterOption.paramValue as string))
  const [minValue, maxValue] = range
  const sliderRange = parseSliderRange(range)
  const filterHeaderText = FilterDisplayName.priceRange
  const selectFiltersActionDebounced = useMemo(
    () => debounce(selectFiltersAction, DEBOUNCE_DELAY),
    []
  )

  const handleClear = () => {
    const defaultRangeValue = parseRange(DEFAULT_PRICE_RANGE)

    updateRange(defaultRangeValue)
  }

  const isActive = selectedFilterOption.paramValue !== DEFAULT_PRICE_OPTION.paramValue

  const handleTextChange = (changedIndex: number) => (value: string) => {
    // Early exit the input update if the value is not a number
    // This was added for the android number-pad keyboard that
    // includes some special characters
    if (!NUMBERS_REGEX.test(value)) {
      return
    }

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
    const convertedRange = convertToFilterFormatRange(value)

    updateRange(convertedRange)
  }

  const updateRange = (updatedRange: CustomRange) => {
    const [min, max] = updatedRange

    setRange(updatedRange)
    selectFiltersActionDebounced({
      displayText: parsePriceRangeLabel(min, max),
      paramValue: updatedRange.join("-"),
      paramName: PARAM_NAME,
    })
  }

  const handlePrevPriceRangePress = (price: string) => {
    const selectedRange = parseRange(price)
    updateRange(selectedRange)
  }

  const isSelectedPriceRange = (price: string) => {
    const [min, max] = parseRange(price)

    return min === minValue && max === maxValue
  }

  const handleClearRecentPriceRanges = () => {
    GlobalStore.actions.recentPriceRanges.clearAllPriceRanges()
  }

  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const histogramBars = getBarsFromAggregations(aggregations)
  const shouldDisplayHistogram = enableHistogram && histogramBars.length > 0

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterBackHeader
        title={filterHeaderText}
        onLeftButtonPress={navigation.goBack}
        {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
      />
      <Flex flexGrow={1}>
        <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled">
          <Flex m={2}>
            <Text variant="sm-display">Choose Your Price Range</Text>
          </Flex>
          <Flex flexDirection="row" mx={2}>
            <Input
              containerStyle={{ flex: 1 }}
              description="Min"
              fixedRightPlaceholder="$USD"
              enableClearButton
              keyboardType="number-pad"
              value={getInputValue(minValue)}
              onChangeText={handleTextChange(0)}
              testID="price-min-input"
              descriptionColor="black100"
            />
            <Spacer mx={2} />
            <Input
              containerStyle={{ flex: 1 }}
              description="Max"
              fixedRightPlaceholder="$USD"
              enableClearButton
              keyboardType="number-pad"
              value={getInputValue(maxValue)}
              onChangeText={handleTextChange(1)}
              testID="price-max-input"
              descriptionColor="black100"
            />
          </Flex>
          <Spacer m={2} />
          <Flex mx={`${20 + RANGE_DOT_SIZE / 2}px`}>
            {!!shouldDisplayHistogram && (
              <Flex mb={2}>
                <Histogram bars={histogramBars} selectedRange={[sliderRange[0], sliderRange[1]]} />
              </Flex>
            )}
            <Flex alignItems="center" testID="slider">
              <MultiSlider
                min={defaultMinValue}
                max={defaultMaxValue}
                step={SLIDER_STEP_VALUE}
                snapped
                // 40 here is the horizontal padding of the slider container
                sliderLength={width - 40 - RANGE_DOT_SIZE}
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
                  height: RANGE_DOT_SIZE,
                  width: RANGE_DOT_SIZE,
                  borderRadius: RANGE_DOT_SIZE / 2,
                  backgroundColor: color("white100"),
                  borderColor: color("black10"),
                  borderWidth: 1,
                  shadowRadius: 2,
                  elevation: 5,
                }}
                pressedMarkerStyle={{
                  height: RANGE_DOT_SIZE,
                  width: RANGE_DOT_SIZE,
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

          <Spacer mt={4} />

          {!!enableRecentPriceRanges && recentPriceRanges.length > 0 && (
            <>
              <Flex mx={2} flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text variant="sm">Apply a recent Price Range</Text>
                <TouchableOpacity
                  onPress={handleClearRecentPriceRanges}
                  hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
                >
                  <Text variant="sm" style={{ textDecorationLine: "underline" }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </Flex>
              <Spacer mt={1} />
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: space("2") }}
                showsHorizontalScrollIndicator={false}
              >
                <Flex flexDirection="row">
                  <Join separator={<Spacer ml={1} />}>
                    {recentPriceRanges.map((recentPrice) => {
                      const [min, max] = parseRange(recentPrice)
                      const label = parsePriceRangeLabel(min, max)

                      return (
                        <Pill
                          key={recentPrice}
                          rounded
                          selected={isSelectedPriceRange(recentPrice)}
                          onPress={() => handlePrevPriceRangePress(recentPrice)}
                        >
                          {label}
                        </Pill>
                      )
                    })}
                  </Join>
                </Flex>
              </ScrollView>
            </>
          )}
        </ScrollView>
      </Flex>
    </Flex>
  )
}
