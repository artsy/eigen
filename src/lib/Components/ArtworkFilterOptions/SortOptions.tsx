import { ArrowLeftIcon, Box, Flex, Sans, Serif, space } from "@artsy/palette"
import { BackgroundFill, OptionListItem } from "lib/Components/FilterModal"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
}

export class SortOptionsScreen extends React.Component<SortOptionsScreenProps> {
  handleBackNavigation() {
    this.props.navigator.pop()
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
                  <OptionListItem>
                    <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
                      <Serif size="3">{item}</Serif>
                    </Flex>
                  </OptionListItem>
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

const SortOptions = [
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
