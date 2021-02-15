import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Box, CheckIcon, Flex, Sans, Separator } from "palette"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"

interface MultiSelectOptionScreenProps {
  filterHeaderText: string
  filterOptions: FilterData[]
  ListHeaderComponent?: React.ReactElement
  navigation: StackNavigationProp<ParamListBase>
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  selectedOptions: string[] | undefined
  withIndent?: boolean
}

export const MultiSelectCheckOptionScreen: React.FC<MultiSelectOptionScreenProps> = ({
  filterHeaderText,
  filterOptions,
  ListHeaderComponent,
  navigation,
  onSelect,
  selectedOptions,
  withIndent = false,
}) => {
  const handleBackNavigation = () => {
    navigation.goBack()
  }

  const isSelected = (item: FilterData) => {
    if (typeof item?.paramValue === "string") {
      return selectedOptions?.includes(item.paramValue)
    }
    return false
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={handleBackNavigation}>{filterHeaderText}</FancyModalHeader>
      <Flex mb={120}>
        <FlatList
          initialNumToRender={10}
          ListHeaderComponent={ListHeaderComponent}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item }) => (
            <Box ml="0.5">
              <CheckMarkOptionListItem
                hasExtraLeftPadding={
                  withIndent && item.paramName !== FilterParamName.artistsIFollow && item.paramValue !== "all"
                }
                item={item}
                onSelect={onSelect}
                selected={isSelected(item) as boolean}
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
  hasExtraLeftPadding,
}: {
  item: FilterData
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  selected: boolean
  hasExtraLeftPadding: boolean
}) => (
  <TouchableOpacity onPress={() => onSelect(item, !item.paramValue)}>
    <Flex flexGrow={1} justifyContent="space-between" flexDirection="row">
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        flexGrow={1}
        alignItems="center"
        pl={hasExtraLeftPadding ? "3" : "2"}
        pr="2"
        height={60}
      >
        <Sans color="black100" size="3t">
          {item.displayText}
          {!!item.count && (
            <Sans color="black60" size="3t">
              {" "}
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
