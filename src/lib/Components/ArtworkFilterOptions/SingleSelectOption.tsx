import { Box, CheckIcon, color, Flex, Sans, space } from "@artsy/palette"
import { ArtworkFilterHeader } from "lib/Components/ArtworkFilterOptions/FilterHeader"
import { FilterDisplayName } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { FilterData } from "lib/utils/ArtworkFiltersStore"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { OptionListItem } from "../FilterModal"

interface SingleSelectOptionScreenProps {
  navigator: NavigatorIOS
  filterHeaderText: string
  onSelect: (any: any) => void
  selectedOption: FilterData
  filterOptions: FilterData[]
}

export const SingleSelectOptionScreen: React.SFC<SingleSelectOptionScreenProps> = ({
  filterHeaderText,
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
      <ArtworkFilterHeader filterName={filterHeaderText} handleBackNavigation={handleBackNavigation} />
      <Flex mb="125px">
        <FlatList<FilterData>
          initialNumToRender={50}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          renderItem={({ item }) => (
            <Box>
              {
                <SingleSelectOptionListItemRow onPress={() => onSelect(item)}>
                  <OptionListItem>
                    <InnerOptionListItem>
                      <Option color="black100" size="3t">
                        {item.displayText}
                      </Option>
                      {item.displayText === selectedOption.displayText && (
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
    </Flex>
  )
}

export const FilterHeader = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding-right: ${space(2)}px;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
`
export const NavigateBackIconContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
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
