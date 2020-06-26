import { Flex } from "@artsy/palette"
import {
  AggregateOption,
  ColorOption,
  FilterParamName,
  FilterType,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import { isPad } from "lib/utils/hardware"
import React, { useContext, useState } from "react"
import { LayoutChangeEvent, NavigatorIOS, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import { aggregationForFilterType } from "../FilterModal"
import { ColorSwatch } from "./ColorSwatch"
import { ArtworkFilterHeader } from "./FilterHeader"

interface ColorOptionsScreenProps {
  navigator: NavigatorIOS
}

const colorSort = (left: FilterData, right: FilterData): number => {
  const sortOrder = [
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
  const leftParam = left.displayText as string
  const rightParam = right.displayText as string
  if (sortOrder.indexOf(leftParam) < sortOrder.indexOf(rightParam)) {
    return -1
  } else {
    return 1
  }
}

const INTER_ITEM_SPACE = isPad() ? 40 : 20
const SIDE_MARGIN = isPad() ? 32 : 16
const FLEX_MARGIN = SIDE_MARGIN - INTER_ITEM_SPACE / 2

export const ColorOptionsScreen: React.SFC<ColorOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, aggregations } = useContext(ArtworkFilterContext)
  const [itemSize, setItemSize] = useState(0)

  const filterType = FilterType.color
  const aggregation = aggregationForFilterType(filterType, aggregations!)
  const options = aggregation.counts.map(aggCount => {
    return {
      displayText: aggCount.name,
      paramName: FilterParamName.color,
      paramValue: aggCount.value,
      filterType,
    }
  })

  const allOption = { displayText: "All", paramName: FilterParamName.color, paramValue: "All", filterType }
  const blackWhiteOption = {
    displayText: "black-and-white-2",
    paramName: FilterParamName.color,
    paramValue: "black-and-white",
    filterType,
  }
  const displayOptions = [blackWhiteOption].concat(options)
  const sortedDisplayOptions = displayOptions.sort(colorSort)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)!

  const selectOption = (option: AggregateOption) => {
    if (option.displayText === selectedOption.displayText) {
      dispatch({ type: "selectFilters", payload: allOption })
    } else {
      dispatch({
        type: "selectFilters",
        payload: {
          displayText: option.displayText,
          paramValue: option.paramValue,
          paramName: FilterParamName.color,
          filterType,
        },
      })
    }
  }

  const handleBackNavigation = () => {
    navigator.pop()
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
    const size = spaceForItems / itemsPerLine
    setItemSize(size)
  }

  return (
    <View onLayout={handleLayout}>
      <Flex flexGrow={1}>
        <ArtworkFilterHeader filterName={"Color"} handleBackNavigation={handleBackNavigation} />
        <Flex
          ml={`${FLEX_MARGIN}px`}
          mr={`${FLEX_MARGIN}px`}
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="flex-start"
        >
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
