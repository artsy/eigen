import { Flex } from "@artsy/palette"
import {
  AggregateOption,
  ColorOption,
  FilterParamName,
  FilterType,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext, useState } from "react"
import { LayoutChangeEvent, NavigatorIOS, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import { aggregationFromFilterType } from "../FilterModal"
import { ColorSwatch } from "./ColorSwatch"
import { ArtworkFilterHeader } from "./FilterHeader"

interface ColorOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ColorOptionsScreen: React.SFC<ColorOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, aggregations } = useContext(ArtworkFilterContext)
  const [itemSize, setItemSize] = useState(0)

  const filterType = FilterType.color
  const aggregationName = aggregationFromFilterType(filterType)
  const aggregation = aggregations!.filter(value => value.slice === aggregationName)[0]
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
    const interItemSpace = 20 * (itemsPerLine - 1)
    const sideMarginSpace = 20 * 2
    const spaceForItems = width - (sideMarginSpace + interItemSpace)
    const size = spaceForItems / itemsPerLine
    setItemSize(size)
  }

  return (
    <View onLayout={handleLayout}>
      <Flex flexGrow={1} ml={"6px"} mr={"6px"}>
        <ArtworkFilterHeader filterName={"Color"} handleBackNavigation={handleBackNavigation} />
        <Flex flexWrap="wrap" flexDirection="row" justifyContent="space-between">
          {displayOptions.map((item, index) => {
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
  margin: 20px 10px 0px 10px;
`
