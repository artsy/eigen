import { Flex, Text, useColor } from "@artsy/palette-mobile"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { DEFAULT_RANGE, RANGE_DOT_SIZE } from "app/Components/PriceRange/constants"
import { useWindowDimensions } from "react-native"

const SLIDER_STEP_VALUE = 100

interface PriceRangeSliderProps {
  sliderRange: number[]
  onSliderValueChange: (values: number[]) => void
  onMultiSliderValuesChangeStart: () => void
  onMultiSliderValuesChangeFinish: () => void
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  sliderRange,
  onSliderValueChange,
  onMultiSliderValuesChangeStart,
  onMultiSliderValuesChangeFinish,
}) => {
  const { width } = useWindowDimensions()
  const color = useColor()
  const [defaultMinValue, defaultMaxValue] = DEFAULT_RANGE

  return (
    <>
      <Flex alignItems="center" testID="slider">
        <MultiSlider
          min={defaultMinValue}
          max={defaultMaxValue}
          step={SLIDER_STEP_VALUE}
          snapped
          // 40 here is the horizontal padding of the slider container
          sliderLength={width - 40 - RANGE_DOT_SIZE}
          onValuesChange={onSliderValueChange}
          onValuesChangeStart={onMultiSliderValuesChangeStart}
          onValuesChangeFinish={onMultiSliderValuesChangeFinish}
          allowOverlap={false}
          values={sliderRange}
          trackStyle={{
            backgroundColor: color("mono30"),
          }}
          selectedStyle={{
            backgroundColor: color("blue100"),
          }}
          markerStyle={{
            height: RANGE_DOT_SIZE,
            width: RANGE_DOT_SIZE,
            borderRadius: RANGE_DOT_SIZE / 2,
            backgroundColor: color("mono0"),
            borderColor: color("mono10"),
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
        <Text variant="xs" color="mono60">
          ${defaultMinValue}
        </Text>
        <Text variant="xs" color="mono60">
          ${defaultMaxValue}+
        </Text>
      </Flex>
    </>
  )
}
