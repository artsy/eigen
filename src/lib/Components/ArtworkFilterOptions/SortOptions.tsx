import { ArrowLeftIcon, Box, Flex, Sans, Serif } from "@artsy/palette"
import { BackgroundFill, OptionListItem } from "lib/Components/FilterModal"
import React from "react"
import { FlatList } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
}

export class SortOptionsScreen extends React.Component<SortOptionsScreenProps> {
  handleBackNavigation() {
    this.props.navigator.pop()
  }

  renderSortOption = ({ item }) => {
    return (
      <OptionListItem>
        <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
          <Serif size="3">{item}</Serif>
        </Flex>
      </OptionListItem>
    )
  }

  render() {
    return (
      <Flex flexGrow={1}>
        <SortHeader>
          <Flex alignItems="flex-end" mt={0.5} mb={2}>
            <Box ml={2} mt={2} onTouchStart={() => this.handleBackNavigation()}>
              <ArrowLeftIcon fill="black100" />
            </Box>
          </Flex>
          <Sans mt={2} weight="medium" size="4">
            Sort
          </Sans>
          <Box></Box>
        </SortHeader>
        <Flex>
          <FlatList
            keyExtractor={(_item, index) => String(index)}
            data={SortOptions}
            renderItem={item => <Box>{this.renderSortOption(item)}</Box>}
          />
        </Flex>
        <BackgroundFill />
      </Flex>
    )
  }
}

const SortOptions = [
  "Default",
  "Price (low to high)",
  "Price (high to low)",
  "Recently Updated",
  "Recently Added",
  "Artwork year (descending)",
  "Artwork year (ascending)",
]

const SortHeader = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding-right: 20px;
`
