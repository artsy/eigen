import { Flex } from "@artsy/palette"
import { ColorOption, OrderedColorFilters } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import { ceil } from "lodash"
import React, { useContext, useState } from "react"
import { LayoutChangeEvent, NavigatorIOS, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import { ColorSwatch } from "./ColorSwatch"
import { ArtworkFilterHeader } from "./FilterHeader"

interface ColorOptionsScreenProps {
  navigator: NavigatorIOS
}

export const ColorOptionsScreen: React.SFC<ColorOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)
  const [itemSize, setItemSize] = useState(0)

  const filterType = "color"

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value! as ColorOption

  const selectOption = (option: ColorOption) => {
    if (option === selectedOption) {
      dispatch({ type: "selectFilters", payload: { value: "Any", filterType } })
    } else {
      dispatch({ type: "selectFilters", payload: { value: option, filterType } })
    }
  }

  const handleBackNavigation = () => {
    navigator.pop()
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    const itemsPerLine = ceil(OrderedColorFilters.length / 2)
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
          {OrderedColorFilters.map((item, index) => {
            return (
              <ColorContainer onPress={() => selectOption(item)} key={index}>
                <ColorSwatch size={itemSize} selected={selectedOption === item} colorOption={item} />
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
