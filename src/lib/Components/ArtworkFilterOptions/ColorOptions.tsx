import { Flex } from "@artsy/palette"
import { AggregateOption, FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import { isPad } from "lib/utils/hardware"
import React, { useContext, useState } from "react"
import { LayoutChangeEvent, NavigatorIOS, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import { aggregationForFilterType } from "../FilterModal"
import { ColorSwatch } from "./ColorSwatch"
import { ArtworkFilterHeader } from "./FilterHeader"

// Sorting types
enum ArtworkSorts {
  "Default" = "-decayed_merch",
  "Price (high to low)" = "sold,-has_price,-prices",
  "Price (low to high)" = "sold,-has_price,prices",
  "Recently updated" = "-partner_updated_at",
  "Recently added" = "-published_at",
  "Artwork year (descending)" = "-year",
  "Artwork year (ascending)" = "year",
}

export type SortOption = keyof typeof ArtworkSorts

export const OrderedArtworkSorts: FilterData[] = [
  {
    displayText: "Default",
    paramName: FilterParamName.sort,
    paramValue: "-decayed_merch",
    filterType: FilterType.sort,
  },
  {
    displayText: "Price (high to low)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,-prices",
    filterType: FilterType.sort,
  },
  {
    displayText: "Price (low to high)",
    paramName: FilterParamName.sort,
    paramValue: "sold,-has_price,prices",
    filterType: FilterType.sort,
  },
  {
    displayText: "Recently updated",
    paramName: FilterParamName.sort,
    paramValue: "-partner_updated_at",
    filterType: FilterType.sort,
  },
  {
    displayText: "Recently added",
    paramName: FilterParamName.sort,
    paramValue: "-published_at",
    filterType: FilterType.sort,
  },
  {
    displayText: "Artwork year (descending)",
    paramName: FilterParamName.sort,
    paramValue: "-year",
    filterType: FilterType.sort,
  },
  {
    displayText: "Artwork year (ascending)",
    paramName: FilterParamName.sort,
    paramValue: "year",
    filterType: FilterType.sort,
  },
]

// Medium filter types
enum MediumFilters {
  "All" = "*",
  "Painting" = "painting",
  "Photography" = "photography",
  "Sculpture" = "sculpture",
  "Prints & multiples" = "prints",
  "Works on paper" = "work-on-paper",
  "Film & video" = "film-slash-video",
  "Design" = "design",
  "Jewelry" = "jewelry",
  "Drawing" = "drawing",
  "Installation" = "installation",
  "Performance art" = "performance-art",
}

export const OrderedMediumFilters: MediumOption[] = [
  "All",
  "Painting",
  "Photography",
  "Sculpture",
  "Prints & multiples",
  "Works on paper",
  "Design",
  "Drawing",
  "Installation",
  "Film & video",
  "Jewelry",
  "Performance art",
]

export type MediumOption = keyof typeof MediumFilters

// Price Range types
enum PriceRangeFilters {
  "All" = "",
  "$0-5,000" = "*-5000",
  "$5,000-10,000" = "5000-10000",
  "$10,000-20,000" = "10000-20000",
  "$20,000-40,000" = "20000-40000",
  "$50,000+" = "50000-*",
}

export type PriceRangeOption = keyof typeof PriceRangeFilters

// Size Types
enum SizeFilters {
  "All" = "*-*",
  'Small (0"-40")' = "*-40",
  'Medium (40"-70")' = "40-70",
  'Large (70"+")' = "70-*",
}

export type SizeOption = keyof typeof SizeFilters

export const OrderedSizeFilters: SizeOption[] = ["All", 'Small (0"-40")', 'Medium (40"-70")', 'Large (70"+")']

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

interface ColorOptionsScreenProps {
  navigator: NavigatorIOS
}

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
