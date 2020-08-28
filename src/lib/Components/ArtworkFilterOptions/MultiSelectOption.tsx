import { FilterToggleButton } from "lib/Components/ArtworkFilterOptions/FilterToggleButton"
import { FilterData } from "lib/utils/ArtworkFiltersStore"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { FlatList, TouchableWithoutFeedback } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"

interface MultiSelectOptionScreenProps {
  navigator: NavigatorIOS
  filterHeaderText: string
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  filterOptions: FilterData[]
}

export const MultiSelectOptionScreen: React.SFC<MultiSelectOptionScreenProps> = ({
  filterHeaderText,
  onSelect,
  filterOptions,
  navigator,
}) => {
  const handleBackNavigation = () => {
    navigator.pop()
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onBackPress={handleBackNavigation}>{filterHeaderText}</FancyModalHeader>
      <Flex mb={120}>
        <FlatList<FilterData>
          initialNumToRender={4}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          renderItem={({ item }) => (
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
                      value={item.paramValue as boolean}
                    />
                  </TouchableWithoutFeedback>
                </OptionListItem>
              }
            </Box>
          )}
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
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
`
