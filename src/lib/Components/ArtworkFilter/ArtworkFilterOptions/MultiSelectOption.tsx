import { FilterToggleButton } from "lib/Components/ArtworkFilter/ArtworkFilterOptions/FilterToggleButton"
import { FilterData } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { FlatList, TouchableWithoutFeedback } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { FancyModalHeader } from "../../FancyModal/FancyModalHeader"

interface MultiSelectOptionScreenProps {
  navigator: NavigatorIOS
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
  navigator,
  isSelected,
  isDisabled,
}) => {
  const handleBackNavigation = () => {
    navigator.pop()
  }

  const itemIsSelected = (item: FilterData): boolean => {
    console.log("am i selected?", item) // TODO: Delete
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
              <Box ml={0.5}>
                {
                  <OptionListItem>
                    <Flex mb={0.5}>
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
