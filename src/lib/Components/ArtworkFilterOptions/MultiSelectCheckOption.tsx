import { FilterData } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Box, CheckIcon, Flex, Sans, Separator } from "palette"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"

export interface FilterOptionsItem {
  readonly displayText: string
  readonly paramName: FilterParamName
  paramValue: string
  count: number | null
}

interface MultiSelectOptionScreenProps {
  navigator: NavigatorIOS
  filterHeaderText: string
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  filterOptions: FilterOptionsItem[]
  selectedOptions: string[] | undefined
}

export const MultiSelectCheckOptionScreen: React.FC<MultiSelectOptionScreenProps> = ({
  filterHeaderText,
  onSelect,
  filterOptions,
  navigator,
  selectedOptions,
}) => {
  const handleBackNavigation = () => {
    navigator.pop()
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={handleBackNavigation}>{filterHeaderText}</FancyModalHeader>
      <Flex mb={120}>
        <FlatList<FilterOptionsItem>
          initialNumToRender={4}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item }) => (
            <Box ml={0.5}>
              <CheckMarkOptionListItem
                item={item}
                onSelect={onSelect}
                selected={!!selectedOptions?.includes(item.paramValue)}
              />
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
  border-left-width: 0;
  border-top-width: 0;
`

export const CheckMarkOptionListItem = ({
  item,
  onSelect,
  selected,
}: {
  item: FilterOptionsItem
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  selected: boolean
}) => (
  <TouchableOpacity onPress={() => onSelect(item, !item.paramValue)}>
    <Flex flexGrow={1} justifyContent="space-between" flexDirection="row">
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        flexGrow={1}
        alignItems="center"
        px={item.paramValue === "all" ? 2 : 3}
        height={60}
      >
        <Sans color="black100" size="3t">
          {item.displayText}{" "}
          {!!item.count && (
            <Sans color="black60" size="3t">
              ({item.count})
            </Sans>
          )}
        </Sans>

        {!!selected && (
          <Box mb={0.1}>
            <CheckIcon fill="black100" />
          </Box>
        )}
      </Flex>
    </Flex>
  </TouchableOpacity>
)
