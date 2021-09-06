import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FancyModalHeader, FancyModalHeaderProps } from "lib/Components/FancyModal/FancyModalHeader"
import { SearchInput } from "lib/Components/SearchInput"
import { TouchableRow } from "lib/Components/TouchableRow"
import { Box, Check, Flex, Text } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"

interface MultiSelectOptionScreenProps extends FancyModalHeaderProps {
  navigation: StackNavigationProp<ParamListBase>
  filterHeaderText: string
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  filterOptions: Array<FilterData | JSX.Element>
  isSelected?: (item: FilterData) => boolean
  isDisabled?: (item: FilterData) => boolean
  /** Utilize a search input to further filter results */
  searchable?: boolean
  noResultsLabel?: string
}

const isFilterData = (item: FilterData | JSX.Element): item is FilterData => {
  return "paramValue" in item
}

// TODO: Add ability to render ScrollView instead of FlatList
export const MultiSelectOptionScreen: React.FC<MultiSelectOptionScreenProps> = ({
  filterHeaderText,
  onSelect,
  filterOptions,
  navigation,
  isSelected,
  isDisabled,
  children,
  searchable,
  noResultsLabel = "No results",
  ...rest
}) => {
  const handleBackNavigation = () => {
    navigation.goBack()
  }

  const itemIsSelected = (item: FilterData): boolean => {
    if (isSelected) {
      return isSelected(item)
    } else {
      return !!item.paramValue
    }
  }

  const itemIsDisabled = (item: FilterData): boolean => {
    if (isDisabled) {
      return isDisabled(item)
    } else {
      return false
    }
  }

  const [query, setQuery] = useState("")

  const filteredOptions = filterOptions.filter((option) => {
    if (isFilterData(option)) {
      return option.displayText.toLowerCase().includes(query.toLowerCase())
    }

    return !searchable
  })

  const renderItem = (item: FilterData | JSX.Element) => {
    if (isFilterData(item)) {
      const disabled = itemIsDisabled(item)

      return (
        <Box ml={0.5}>
          <TouchableRow
            onPress={() => {
              const currentParamValue = item.paramValue as boolean
              onSelect(item, !currentParamValue)
            }}
            disabled={disabled}
            testID="multi-select-option-button"
          >
            <OptionListItem>
              <Text variant="caption" color="black100">
                {item.displayText}
              </Text>

              <Check selected={itemIsSelected(item)} disabled={disabled} />
            </OptionListItem>
          </TouchableRow>
        </Box>
      )
    }

    // Otherwise just return JSX.Element
    return item
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={handleBackNavigation} {...rest}>
        {filterHeaderText}
      </FancyModalHeader>

      {!!searchable && (
        <>
          <Flex m={2}>
            <SearchInput onChangeText={setQuery} testID="multi-select-search-input" placeholder="Filter results" />
          </Flex>

          {filteredOptions.length === 0 && (
            <Flex my={1.5} mx={2} alignItems="center">
              <Text variant="caption">{noResultsLabel}</Text>
            </Flex>
          )}
        </>
      )}

      <Flex flexGrow={1}>
        <FlatList<FilterData>
          style={{ flex: 1 }}
          keyExtractor={(_item, index) => String(index)}
          data={filteredOptions}
          renderItem={({ item }) => renderItem(item)}
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
`
