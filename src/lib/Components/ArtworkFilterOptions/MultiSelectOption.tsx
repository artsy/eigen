import { Box, color, Flex, Sans } from "@artsy/palette"
import { ArtworkFilterHeader } from "lib/Components/ArtworkFilterOptions/FilterHeader"
import { ToggleButton } from "lib/Components/ToggleButton"
import { WaysToBuyOptions } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React from "react"
import { FlatList, TouchableWithoutFeedback } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"

type MultiSelectOptions = WaysToBuyOptions

interface MultiSelectOptionScreenProps {
  navigator: NavigatorIOS
  filterText: "Ways to Buy"
  onSelect: (any: any) => void
  filterOptions: MultiSelectOptions[]
}

export const MultiSelectOptionScreen: React.SFC<MultiSelectOptionScreenProps> = ({
  filterText,
  onSelect,
  filterOptions,
  navigator,
}) => {
  const handleBackNavigation = () => {
    navigator.pop()
  }

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterHeader filterName={filterText} handleBackNavigation={handleBackNavigation} />
      <Flex mb={120}>
        <FlatList<MultiSelectOptions>
          initialNumToRender={4}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          renderItem={({ item }) => (
            <Box ml={0.5}>
              {item !== "All" && (
                <OptionListItem>
                  <Flex mb={0.5}>
                    <Sans color="black100" size="3t">
                      {item}
                    </Sans>
                  </Flex>
                  <TouchableWithoutFeedback onPress={() => onSelect(item)}>
                    <ToggleButton />
                  </TouchableWithoutFeedback>
                </OptionListItem>
              )}
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
