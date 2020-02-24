import { ArrowLeftIcon, Box, CheckIcon, Flex, Sans, Serif, space } from "@artsy/palette"
import { BackgroundFill, OptionListItem } from "lib/Components/FilterModal"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
  updatedSortOption: (string: SortTypes) => void
}

interface SortOptionsScreenState {
  currentSelection: SortTypes
}

export class SortOptionsScreen extends React.Component<SortOptionsScreenProps, SortOptionsScreenState> {
  state: SortOptionsScreenState = {
    currentSelection: "Default",
  }

  handleBackNavigation() {
    this.props.navigator.pop()
  }

  getCheckboxSelection(selectedOption) {
    return (
      selectedOption === this.state.currentSelection && (
        <Box mb={0.1}>
          <CheckIcon fill="black100" />
        </Box>
      )
    )
  }

  selectSortOption(selectedOption) {
    this.setState({ currentSelection: selectedOption })
    this.props.updatedSortOption(selectedOption) // callback to set the current sort option on the Filter home screen
  }

  render() {
    return (
      <Flex flexGrow={1}>
        <SortHeader>
          <Flex alignItems="flex-end" mt={0.5} mb={2}>
            <ArrowLeftIconContainer onPress={() => this.handleBackNavigation()}>
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
                  <TouchableOpacity onPress={() => this.selectSortOption(item)}>
                    <OptionListItem>
                      <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1} alignItems="flex-end">
                        <Serif size="3">{item}</Serif>
                        {this.getCheckboxSelection(item)}
                      </Flex>
                    </OptionListItem>
                  </TouchableOpacity>
                }
              </Box>
            )}
          />
        </Flex>
        <BackgroundFill />
      </Flex>
    )
  }
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

export type SortTypes =
  | "Default"
  | "Price (low to high)"
  | "Price (high to low)"
  | "Recently Updated"
  | "Recently Added"
  | "Artwork year (descending)"
  | "Artwork year (ascending)"
