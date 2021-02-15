import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterToggleButton } from "lib/Components/ArtworkFilterOptions/FilterToggleButton"
import { FilterData } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Box, Flex, Sans, Separator } from "palette"
import React from "react"
import { FlatList, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"

interface MultiSelectOptionScreenProps {
  navigation: StackNavigationProp<ParamListBase>
  filterHeaderText: string
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  filterOptions: FilterData[]
  isSelected?: (item: FilterData) => boolean
  isDisabled?: (item: FilterData) => boolean
}

export const MultiSelectOptionScreen: React.FC<MultiSelectOptionScreenProps> = ({
  filterHeaderText,
  onSelect,
  filterOptions,
  navigation,
  isSelected,
  isDisabled,
}) => {
  const handleBackNavigation = () => {
    navigation.goBack()
  }

  const itemIsSelected = (item: FilterData): boolean => {
    if (isSelected) {
      return isSelected(item)
    } else {
      return !!item.paramValue
    }
  }

  const itemIsDisabled = (item: FilterData): boolean => {
    if (isDisabled) {
      return isDisabled(item)
    } else {
      return false
    }
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={handleBackNavigation}>{filterHeaderText}</FancyModalHeader>
      <Flex flexGrow={1}>
        <FlatList<FilterData>
          initialNumToRender={4}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => {
            return (
              <Box ml="0.5">
                {
                  <OptionListItem>
                    <Flex mb="0.5">
                      <Sans color="black100" size="3t">
                        {item.displayText}
                      </Sans>
                    </Flex>
                    <TouchableWithoutFeedback>
                      <FilterToggleButton
                        onChange={() => {
                          const currentParamValue = item.paramValue as boolean
                          onSelect(item, !currentParamValue)
                        }}
                        value={itemIsSelected(item)}
                        disabled={itemIsDisabled(item)}
                      />
                    </TouchableWithoutFeedback>
                  </OptionListItem>
                }
              </Box>
            )
          }}
        />
      </Flex>
    </Flex>
  )
}

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-end;
  padding: 15px;
`
