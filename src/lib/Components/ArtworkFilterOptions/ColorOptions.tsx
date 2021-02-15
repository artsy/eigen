import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtworkFilterContext,
  FilterData,
  ParamDefaultValues,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import {
  AggregateOption,
  aggregationForFilter,
  FilterDisplayName,
  FilterParamName,
} from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { isPad } from "lib/utils/hardware"
import { floor } from "lodash"
import { Flex } from "palette"
import React, { useContext, useState } from "react"
import { LayoutChangeEvent, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"
import { FilterModalNavigationStack } from "../FilterModal"
import { ColorSwatch } from "./ColorSwatch"

// Color types
enum ColorFilters {
  "Any" = "*",
  "orange" = "orange",
  "darkblue" = "darkblue",
  "gold" = "gold",
  "darkgreen" = "darkgreen",
  "lightblue" = "lightblue",
  "lightgreen" = "lightgreen",
  "yellow" = "yellow",
  "darkorange" = "darkorange",
  "red" = "red",
  "pink" = "pink",
  "darkviolet" = "darkviolet",
  "violet" = "violet",
  "black-and-white" = "black-and-white",
  "black-and-white-2" = "black-and-white",
}

export type ColorOption = keyof typeof ColorFilters

export const OrderedColorFilters: ColorOption[] = [
  "black-and-white-2",
  "black-and-white",
  "lightgreen",
  "darkgreen",
  "lightblue",
  "darkblue",
  "violet",
  "darkviolet",
  "yellow",
  "gold",
  "orange",
  "darkorange",
  "red",
  "pink",
]

interface ColorOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "ColorOptionsScreen"> {}

const colorSort = (left: FilterData, right: FilterData): number => {
  const leftParam = left.displayText as ColorOption
  const rightParam = right.displayText as ColorOption
  if (OrderedColorFilters.indexOf(leftParam) < OrderedColorFilters.indexOf(rightParam)) {
    return -1
  } else {
    return 1
  }
}

const INTER_ITEM_SPACE = isPad() ? 40 : 20
const SIDE_MARGIN = isPad() ? 32 : 16
const FLEX_MARGIN = SIDE_MARGIN - INTER_ITEM_SPACE / 2

export const ColorOptionsScreen: React.FC<ColorOptionsScreenProps> = ({ navigation }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const [itemSize, setItemSize] = useState(0)

  const paramName = FilterParamName.color
  const aggregation = aggregationForFilter(paramName, state.aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
    }
  })

  const allOption = { displayText: "All", paramName, paramValue: ParamDefaultValues.color }
  const blackWhiteOption = {
    displayText: "black-and-white-2",
    paramName,
    paramValue: "black-and-white",
  }
  const displayOptions = [blackWhiteOption].concat(options ?? [])
  const sortedDisplayOptions = displayOptions.sort(colorSort)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  const selectOption = (option: AggregateOption) => {
    if (option.displayText === selectedOption.displayText) {
      dispatch({ type: "selectFilters", payload: allOption })
    } else {
      dispatch({
        type: "selectFilters",
        payload: {
          displayText: option.displayText,
          paramValue: option.paramValue,
          paramName,
        },
      })
    }
  }

  const handleBackNavigation = () => {
    navigation.goBack()
  }

  // TODO: Fix layout for <14 colors (2 full rows)
  // believe behavior should be, space items as if there are 14 rows
  // 2 black and white options should be first in each row
  // how should handle case when only 1 row?
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    const itemsPerLine = 7
    const totalIterItemSpace = INTER_ITEM_SPACE * (itemsPerLine - 1)
    const sideMarginSpace = SIDE_MARGIN * 2
    const spaceForItems = width - (sideMarginSpace + totalIterItemSpace)
    const size = floor(spaceForItems / itemsPerLine)
    setItemSize(size)
  }

  return (
    <View onLayout={handleLayout}>
      <Flex flexGrow={1}>
        <FancyModalHeader onLeftButtonPress={handleBackNavigation}>{FilterDisplayName.color}</FancyModalHeader>
        <Flex ml={FLEX_MARGIN} mr={FLEX_MARGIN} flexWrap="wrap" flexDirection="row" justifyContent="flex-start">
          {sortedDisplayOptions.map((item, index) => {
            return (
              <ColorContainer onPress={() => selectOption(item)} key={index}>
                <ColorSwatch
                  size={itemSize}
                  selected={selectedOption.displayText === item.displayText}
                  colorOption={item.displayText as ColorOption}
                />
              </ColorContainer>
            )
          })}
        </Flex>
      </Flex>
    </View>
  )
}

export const ColorContainer = styled(TouchableOpacity)`
  margin: ${INTER_ITEM_SPACE}px ${INTER_ITEM_SPACE / 2}px 0px ${INTER_ITEM_SPACE / 2}px;
`
