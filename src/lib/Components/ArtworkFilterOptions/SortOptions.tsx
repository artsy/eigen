import { ArrowLeftIcon, Box, CheckIcon, Flex, Sans, Serif, space } from "@artsy/palette"
import React, { useContext, useState } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { ArtworkFilterContext } from "../../utils/ArtworkFiltersStore"
import { BackgroundFill, OptionListItem } from "../FilterModal"

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
  updateSortOption: (string: SortTypes) => void
}

export const SortOptionsScreen: React.SFC<SortOptionsScreenProps> = ({ navigator, updateSortOption }) => {
  const [currentSelection, setCurrentSelection] = useState("Default")
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const handleBackNavigation = () => {
    navigator.pop()
  }

  const selectSortOption = selectedOption => {
    setCurrentSelection(selectedOption)
    updateSortOption(selectedOption)
    dispatch({ type: "updateFilterCount", payload: state.filterCount === 0 ? 1 : state.filterCount })
  }

  return (
    <Flex flexGrow={1}>
      <SortHeader>
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <ArrowLeftIconContainer onPress={() => handleBackNavigation()}>
            <ArrowLeftIcon fill="black100" />
          </ArrowLeftIconContainer>
        </Flex>
        <Sans mt={2} weight="medium" size="4">
          Sort
        </Sans>
        <Box></Box>
      </SortHeader>
      <Flex>
        <FlatList<string>
          keyExtractor={(_item, index) => String(index)}
          data={SortOptions}
          renderItem={({ item }) => (
            <Box>
              {
                <SortOptionListItemRow onPress={() => selectSortOption(item)}>
                  <OptionListItem>
                    <InnerOptionListItem>
                      <SortSelection size="3">{item}</SortSelection>
                      {item === currentSelection && (
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

const SortOptions: SortTypes[] = [
  "Default",
  "Price (low to high)",
  "Price (high to low)",
  "Recently Updated",
  "Recently Added",
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

export type SortTypes =
  | "Default"
  | "Price (low to high)"
  | "Price (high to low)"
  | "Recently Updated"
  | "Recently Added"
  | "Artwork year (descending)"
  | "Artwork year (ascending)"

export const SortOptionListItemRow = styled(TouchableOpacity)``
export const SortSelection = styled(Serif)``
