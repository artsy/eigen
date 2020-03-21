import { ArrowLeftIcon, Box, CheckIcon, Flex, Sans, Serif, space } from "@artsy/palette"
import React, { useContext } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { ArtworkFilterContext, selectedOptionsDisplay, SortOption } from "../../utils/ArtworkFiltersStore"
import { BackgroundFill, OptionListItem } from "../FilterModal"

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
}

export const SortOptionsScreen: React.SFC<SortOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const handleBackNavigation = () => {
    navigator.pop()
  }

  const selectedOptions = selectedOptionsDisplay()
  const selectedSortOption = selectedOptions.find(option => option.filterType === "sort")?.value

  const selectSortOption = (selectedOption: SortOption) => {
    dispatch({ type: "selectFilters", payload: { value: selectedOption, filterType: "sort" } })
  }

  return (
    <Flex flexGrow={1}>
      <SortHeader>
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <ArrowLeftIconContainer onPress={() => handleBackNavigation()}>
            <ArrowLeftIcon fill="black100" />
          </ArrowLeftIconContainer>
        </Flex>
        <Sans mt={2} weight="medium" size="4" color="black100">
          Sort
        </Sans>
        <Box></Box>
      </SortHeader>
      <Flex>
        <FlatList<SortOption>
          keyExtractor={(_item, index) => String(index)}
          data={options}
          renderItem={({ item }) => (
            <Box>
              {
                <SortOptionListItemRow onPress={() => selectSortOption(item)}>
                  <OptionListItem>
                    <InnerOptionListItem>
                      <SortSelection color="black100" size="3t">
                        {item}
                      </SortSelection>
                      {item === selectedSortOption && (
                        <Box mb={0.1}>
                          <CheckIcon fill="black100" />
                        </Box>
                      )}
                    </InnerOptionListItem>
                  </OptionListItem>
                </SortOptionListItemRow>
              }
            </Box>
          )}
        />
      </Flex>
      <BackgroundFill />
    </Flex>
  )
}

const options: SortOption[] = [
  "Default",
  "Price (low to high)",
  "Price (high to low)",
  "Recently updated",
  "Recently added",
  "Artwork year (descending)",
  "Artwork year (ascending)",
]

export const SortHeader = styled(Flex)`
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

export const SortOptionListItemRow = styled(TouchableOpacity)``
export const SortSelection = styled(Serif)``
