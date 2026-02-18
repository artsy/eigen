import { Flex, Histogram, HistogramBarEntity, Input, Spacer } from "@artsy/palette-mobile"
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
import React, { useEffect, useState } from "react"

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
  onMultiSliderValuesChangeStart?: () => void
  onMultiSliderValuesChangeFinish?: () => void
}

export const PriceRangeContainer: React.FC<PriceRangeContainerProps> = ({
  filterPriceRange,
  histogramBars,
  header,
  onPriceRangeUpdate,
  onRecentPriceRangeSelected,
  onMultiSliderValuesChangeStart,
  onMultiSliderValuesChangeFinish,
}) => {
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

  const handleRecentPriceRangeSelected = (priceRange: RecentPriceRangeEntity) => {
    const { value, isCollectorProfileSources } = priceRange
    const selectedRange = parsePriceRange(value)

    updateRange(selectedRange)
    onRecentPriceRangeSelected?.(isCollectorProfileSources)
  }

  return (
    <Flex>
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
          onMultiSliderValuesChangeStart={() => {
            onMultiSliderValuesChangeStart?.()
          }}
          onMultiSliderValuesChangeFinish={() => {
            onMultiSliderValuesChangeFinish?.()
          }}
        />
      </Flex>

      <Spacer y={2} />

      <Flex flexDirection="row" mx={2} justifyContent="space-around">
        <Flex flex={1} pr={1}>
          <Input
            title="Min"
            fixedRightPlaceholder="$USD"
            enableClearButton
            keyboardType="number-pad"
            value={getInputValue(minValue)}
            onChangeText={handleTextChange(0)}
            testID="price-min-input"
            accessibilityLabel="Minimum Price Range Input"
          />
        </Flex>
        <Flex flex={1} pl={1}>
          <Input
            title="Max"
            fixedRightPlaceholder="$USD"
            enableClearButton
            keyboardType="number-pad"
            value={getInputValue(maxValue)}
            onChangeText={handleTextChange(1)}
            testID="price-max-input"
            accessibilityLabel="Maximum Price Range Input"
          />
        </Flex>
      </Flex>
      <Spacer y={2} />

      <RecentPriceRanges selectedRange={range} onSelected={handleRecentPriceRangeSelected} />
    </Flex>
  )
}
