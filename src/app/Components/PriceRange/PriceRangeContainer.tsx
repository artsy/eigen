import { Flex, Histogram, HistogramBarEntity, Input2, Spacer } from "@artsy/palette-mobile"
import { parsePriceRange } from "app/Components/ArtworkFilter/Filters/helpers"
import { RecentPriceRanges } from "app/Components/ArtworkFilter/RecentPriceRanges"
import { PriceRangeSlider } from "app/Components/PriceRange/PriceRangeSlider"
import { RANGE_DOT_SIZE } from "app/Components/PriceRange/constants"
import { PriceRange } from "app/Components/PriceRange/types"
import {
  convertToFilterFormatRange,
  getInputValue,
  parseSliderRange,
} from "app/Components/PriceRange/utils"
import React, { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"

const NUMBERS_REGEX = /^(|\d)+$/

interface RecentPriceRangeEntity {
  value: string
  isCollectorProfileSources: boolean
}

interface PriceRangeContainerProps {
  filterPriceRange: string // *-*
  histogramBars: HistogramBarEntity[]
  header?: React.ReactNode
  onPriceRangeUpdate: (range: PriceRange) => void
  onRecentPriceRangeSelected?: (isCollectorProfileSources: boolean) => void
}

export const PriceRangeContainer: React.FC<PriceRangeContainerProps> = ({
  filterPriceRange,
  histogramBars,
  header,
  onPriceRangeUpdate,
  onRecentPriceRangeSelected,
}) => {
  const screenScrollViewRef = useRef<ScrollView>(null)
  const [range, setRange] = useState(parsePriceRange(filterPriceRange))

  useEffect(() => {
    setRange(parsePriceRange(filterPriceRange))
  }, [filterPriceRange])

  const sliderRange = parseSliderRange(range)
  const [minValue, maxValue] = range

  const shouldDisplayHistogram = histogramBars.length > 0

  const updateRange = (updatedRange: PriceRange) => {
    setRange(updatedRange)
    onPriceRangeUpdate(updatedRange)
  }

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

  const handleMultiSliderValuesChangeStart = () => {
    if (screenScrollViewRef.current) {
      screenScrollViewRef.current.setNativeProps({ scrollEnabled: false })
    }
  }

  const handleMultiSliderValuesChangeFinish = () => {
    if (screenScrollViewRef.current) {
      screenScrollViewRef.current.setNativeProps({ scrollEnabled: true })
    }
  }

  const handleRecentPriceRangeSelected = (priceRange: RecentPriceRangeEntity) => {
    const { value, isCollectorProfileSources } = priceRange
    const selectedRange = parsePriceRange(value)

    updateRange(selectedRange)
    onRecentPriceRangeSelected?.(isCollectorProfileSources)
  }

  return (
    <ScrollView ref={screenScrollViewRef} keyboardShouldPersistTaps="handled">
      {!!header && <Flex m={2}>{header}</Flex>}

      <Flex mx={`${20 + RANGE_DOT_SIZE / 2}px`}>
        {!!shouldDisplayHistogram && (
          <Flex mb={2}>
            <Histogram bars={histogramBars} selectedRange={[sliderRange[0], sliderRange[1]]} />
          </Flex>
        )}

        <PriceRangeSlider
          sliderRange={sliderRange}
          onSliderValueChange={handleSliderValueChange}
          onMultiSliderValuesChangeStart={handleMultiSliderValuesChangeStart}
          onMultiSliderValuesChangeFinish={handleMultiSliderValuesChangeFinish}
        />
      </Flex>

      <Spacer y={2} />

      <Flex flexDirection="row" mx={2} justifyContent="space-around">
        <Flex flex={1} pr={1}>
          <Input2
            title="Min"
            fixedRightPlaceholder="$USD"
            enableClearButton
            keyboardType="number-pad"
            value={getInputValue(minValue)}
            onChangeText={handleTextChange(0)}
            disableOnChangeOptimisation
            testID="price-min-input"
            accessibilityLabel="Minimum Price Range Input"
          />
        </Flex>
        <Flex flex={1} pl={1}>
          <Input2
            title="Max"
            fixedRightPlaceholder="$USD"
            enableClearButton
            keyboardType="number-pad"
            value={getInputValue(maxValue)}
            onChangeText={handleTextChange(1)}
            disableOnChangeOptimisation
            testID="price-max-input"
            accessibilityLabel="Maximum Price Range Input"
          />
        </Flex>
      </Flex>
      <Spacer y={2} />

      <RecentPriceRanges selectedRange={range} onSelected={handleRecentPriceRangeSelected} />
    </ScrollView>
  )
}
