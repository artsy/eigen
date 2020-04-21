import { ArrowLeftIcon, Box, CheckIcon, Flex, Sans, Serif, space } from "@artsy/palette"
import {
  filterTypeToOrderedOptionsList,
  MediumOption,
  SortOption,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React, { useContext } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "../../utils/ArtworkFiltersStore"
import { BackgroundFill, OptionListItem } from "../FilterModal"

interface SingleSelectOptionScreenProps {
  navigator: NavigatorIOS
  filterType: "sort" | "medium"
  filterText: "Sort" | "Medium"
}

type SingleSelectOptions = MediumOption | SortOption

export const SingleSelectOptionScreen: React.SFC<SingleSelectOptionScreenProps> = ({
  filterText,
  filterType,
  navigator,
}) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const handleBackNavigation = () => {
    navigator.pop()
  }

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value

  const selectOption = (option: MediumOption) => {
    dispatch({ type: "selectFilters", payload: { value: option, filterType } })
  }

  const filterData = filterTypeToOrderedOptionsList[filterType] as SingleSelectOptions[]

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
          data={filterData}
          renderItem={({ item }) => (
            <Box>
              {
                <SingleSelectOptionListItemRow onPress={() => selectOption(item)}>
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
  padding-right: ${space(2)};
`

export const ArrowLeftIconContainer = styled(TouchableOpacity)`
  margin-top: ${space(2)};
  margin-left: ${space(2)};
`

export const InnerOptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-end;
  padding: ${space(2)}px;
`

export const SingleSelectOptionListItemRow = styled(TouchableOpacity)``
export const Option = styled(Serif)``
