import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FancyModalHeader, FancyModalHeaderProps } from "lib/Components/FancyModal/FancyModalHeader"
import { SearchInput } from "lib/Components/SearchInput"
import { TouchableRow } from "lib/Components/TouchableRow"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Check, CHECK_SIZE, Flex, Text, useSpace } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"

const OPTIONS_MARGIN_LEFT = 0.5
const OPTION_PADDING = 15

interface MultiSelectOptionScreenProps extends FancyModalHeaderProps {
  navigation: StackNavigationProp<ParamListBase>
  filterHeaderText: string
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  filterOptions: FilterData[]
  isSelected?: (item: FilterData) => boolean
  isDisabled?: (item: FilterData) => boolean
  /** Utilize a search input to further filter results */
  searchable?: boolean
  noResultsLabel?: string
}

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
  const space = useSpace()
  const { width } = useScreenDimensions()
  const optionTextMaxWidth = width - OPTION_PADDING * 3 - space(OPTIONS_MARGIN_LEFT) - CHECK_SIZE

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

  const filteredOptions = filterOptions.filter((option) =>
    option.displayText.toLowerCase().includes(query.toLowerCase())
  )

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
              <Text variant="xs">{noResultsLabel}</Text>
            </Flex>
          )}
        </>
      )}

      <Flex flexGrow={1}>
        <FlatList<FilterData>
          style={{ flex: 1 }}
          keyExtractor={(_item, index) => String(index)}
          data={filteredOptions}
          renderItem={({ item }) => {
            const disabled = itemIsDisabled(item)
            const selected = itemIsSelected(item)

            return (
              <Box ml={OPTIONS_MARGIN_LEFT}>
                <TouchableRow
                  onPress={() => {
                    const currentParamValue = item.paramValue as boolean
                    onSelect(item, !currentParamValue)
                  }}
                  disabled={disabled}
                  testID="multi-select-option-button"
                  accessibilityState={{ checked: selected }}
                >
                  <OptionListItem>
                    <Box maxWidth={optionTextMaxWidth}>
                      <Text variant="xs" color="black100">
                        {item.displayText}
                      </Text>
                    </Box>

                    <Check selected={selected} disabled={disabled} />
                  </OptionListItem>
                </TouchableRow>
              </Box>
            )
          }}
        />
      </Flex>
    </Flex>
  )
}

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-start;
  padding: ${OPTION_PADDING}px;
`
