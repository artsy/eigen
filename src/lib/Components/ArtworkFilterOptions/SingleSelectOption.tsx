import { ArrowLeftIcon, Box, CheckIcon, Flex, Sans, space } from "@artsy/palette"
import { MediumOption, PriceRangeOption, SortOption } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"
import { BackgroundFill, OptionListItem } from "../FilterModal"

type SingleSelectOptions = MediumOption | SortOption | PriceRangeOption

interface SingleSelectOptionScreenProps {
  navigator: NavigatorIOS
  filterText: "Sort" | "Medium" | "Price Range"
  onSelect: (any: any) => void
  selectedOption: string
  filterOptions: SingleSelectOptions[]
}

export const SingleSelectOptionScreen: React.SFC<SingleSelectOptionScreenProps> = ({
  filterText,
  selectedOption,
  onSelect,
  filterOptions,
  navigator,
}) => {
  const handleBackNavigation = () => {
    navigator.pop()
  }

  return (
    <Flex flexGrow={1}>
      <FilterHeader>
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <ArrowLeftIconContainer onPress={() => handleBackNavigation()}>
            <ArrowLeftIcon fill="black100" />
          </ArrowLeftIconContainer>
        </Flex>
        <Sans mt={2} weight="medium" size="4" color="black100">
          {filterText}
        </Sans>
        <Box></Box>
      </FilterHeader>
      <Flex mb={120}>
        <FlatList<SingleSelectOptions>
          initialNumToRender={12}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          renderItem={({ item }) => (
            <Box>
              {
                <SingleSelectOptionListItemRow onPress={() => onSelect(item)}>
                  <OptionListItem>
                    <InnerOptionListItem>
                      <Option color="black100" size="3t">
                        {item}
                      </Option>
                      {item === selectedOption && (
                        <Box mb={0.1}>
                          <CheckIcon fill="black100" />
                        </Box>
                      )}
                    </InnerOptionListItem>
                  </OptionListItem>
                </SingleSelectOptionListItemRow>
              }
            </Box>
          )}
        />
      </Flex>
      <BackgroundFill />
    </Flex>
  )
}

export const FilterHeader = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding-right: ${space(2)}px;
`

export const ArrowLeftIconContainer = styled(TouchableOpacity)`
  margin-top: ${space(2)}px;
  margin-left: ${space(2)}px;
`

export const InnerOptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-end;
  padding: ${space(2)}px;
`

export const SingleSelectOptionListItemRow = styled(TouchableOpacity)``
export const Option = styled(Sans)``
