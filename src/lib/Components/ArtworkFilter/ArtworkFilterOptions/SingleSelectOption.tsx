import { FilterData } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { Box, CheckIcon, color, Flex, Sans, space } from "palette"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { FancyModalHeader } from "../../FancyModal/FancyModalHeader"
import { OptionListItem } from "../FilterModal"

interface SingleSelectOptionScreenProps {
  navigator: NavigatorIOS
  filterHeaderText: string
  onSelect: (any: any) => void
  selectedOption: FilterData
  filterOptions: FilterData[]
  ListHeaderComponent?: JSX.Element
  withExtraPadding?: boolean
}

export const SingleSelectOptionScreen: React.FC<SingleSelectOptionScreenProps> = ({
  filterHeaderText,
  selectedOption,
  onSelect,
  filterOptions,
  navigator,
  ListHeaderComponent,
  withExtraPadding = false,
}) => {
  const handleBackNavigation = () => {
    navigator.pop()
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={handleBackNavigation}>{filterHeaderText}</FancyModalHeader>
      <Flex flexGrow={1}>
        <FlatList
          style={{ flex: 1 }}
          initialNumToRender={100}
          ListHeaderComponent={ListHeaderComponent}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              selectedOption={selectedOption}
              onSelect={onSelect}
              withExtraPadding={withExtraPadding}
            />
          )}
        />
      </Flex>
    </Flex>
  )
}

const ListItem = ({
  item,
  onSelect,
  selectedOption,
  withExtraPadding,
}: {
  item: FilterData
  onSelect: (any: any) => void
  selectedOption: FilterData
  withExtraPadding: boolean
}) => (
  <SingleSelectOptionListItemRow onPress={() => onSelect(item)}>
    <OptionListItem>
      <InnerOptionListItem px={withExtraPadding && item.displayText !== "All" ? 3 : 2}>
        <Sans color="black100" size="3t">
          {item.displayText}
          {!!item.count && (
            <Sans color="black60" size="3t">
              {" "}
              ({item.count})
            </Sans>
          )}
        </Sans>
        {item.displayText === selectedOption.displayText && (
          <Box mb={0.1}>
            <CheckIcon fill="black100" />
          </Box>
        )}
      </InnerOptionListItem>
    </OptionListItem>
  </SingleSelectOptionListItemRow>
)

export const InnerOptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
  height: 60px;
`

export const SingleSelectOptionListItemRow = styled(TouchableOpacity)``

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
