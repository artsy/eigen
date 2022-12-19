import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { SearchInput } from "app/Components/SearchInput"
import { TouchableRow } from "app/Components/TouchableRow"
import { Box, Check, CHECK_SIZE, Flex, Text, useSpace } from "palette"
import React, { useState } from "react"
import { FlatList, ScrollView } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import styled from "styled-components/native"

const OPTIONS_MARGIN_LEFT = 0.5
const OPTION_PADDING = 15
const OPTION_HEIGHT = 50

interface MultiSelectOptionScreenProps {
  navigation: StackNavigationProp<ParamListBase>
  filterHeaderText: string
  filterOptions: FilterData[]
  /** Utilize a search input to further filter results */
  searchable?: boolean
  noResultsLabel?: string
  footerComponent?: React.ComponentType<any> | React.ReactElement | null
  useScrollView?: boolean
  rightButtonText?: string
  isSelected?: (item: FilterData) => boolean
  isDisabled?: (item: FilterData) => boolean
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  onRightButtonPress?: () => void
}

interface RenderItemProps {
  item: FilterData
  index: number
}

export const MultiSelectOptionScreen: React.FC<MultiSelectOptionScreenProps> = ({
  filterHeaderText,
  onSelect,
  filterOptions,
  navigation,
  isSelected,
  isDisabled,
  searchable,
  noResultsLabel = "No results",
  footerComponent,
  useScrollView = false,
  onRightButtonPress,
  rightButtonText,
}) => {
  const [query, setQuery] = useState("")

  const filteredOptions = filterOptions.filter((option) =>
    option.displayText.toLowerCase().includes(query.toLowerCase())
  )

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

  const renderItem = ({ item, index }: RenderItemProps) => {
    const disabled = itemIsDisabled(item)
    const selected = itemIsSelected(item)
    const key = `multie-select-option-item-${index}`

    const handlePress = () => {
      const currentParamValue = item.paramValue as boolean
      onSelect(item, !currentParamValue)
    }

    return (
      <MultiSelectOptionItem
        key={key}
        item={item}
        selected={selected}
        disabled={disabled}
        onPress={handlePress}
      />
    )
  }

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterBackHeader
        title={filterHeaderText}
        onLeftButtonPress={handleBackNavigation}
        onRightButtonPress={onRightButtonPress}
        rightButtonText={rightButtonText}
      />

      {!!searchable && (
        <>
          <Flex m={2}>
            <SearchInput
              onChangeText={setQuery}
              testID="multi-select-search-input"
              placeholder="Filter results"
            />
          </Flex>

          {filteredOptions.length === 0 && (
            <Flex my={1.5} mx={2} alignItems="center">
              <Text variant="xs">{noResultsLabel}</Text>
            </Flex>
          )}
        </>
      )}

      <Flex flexGrow={1}>
        {useScrollView ? (
          <ScrollView style={{ flex: 1 }}>
            {filteredOptions.map((option, index) => renderItem({ item: option, index }))}
            {footerComponent}
          </ScrollView>
        ) : (
          <FlatList<FilterData>
            style={{ flex: 1 }}
            data={filteredOptions}
            ListFooterComponent={footerComponent}
            renderItem={renderItem}
            windowSize={11}
            getItemLayout={(_, index) => ({
              length: OPTION_HEIGHT,
              offset: index * OPTION_HEIGHT,
              index,
            })}
          />
        )}
      </Flex>
    </Flex>
  )
}

interface MultiSelectOptionItemProps {
  item: FilterData
  selected: boolean
  disabled: boolean
  onPress: () => void
}

const MultiSelectOptionItem: React.FC<MultiSelectOptionItemProps> = ({
  item,
  disabled,
  selected,
  onPress,
}) => {
  const space = useSpace()
  const { width } = useScreenDimensions()
  const optionTextMaxWidth = width - OPTION_PADDING * 3 - space(OPTIONS_MARGIN_LEFT) - CHECK_SIZE

  return (
    <Box ml={OPTIONS_MARGIN_LEFT} height={OPTION_HEIGHT}>
      <TouchableRow
        onPress={onPress}
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
}

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-start;
  padding: ${OPTION_PADDING}px;
`
