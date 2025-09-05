import { Flex, Text } from "@artsy/palette-mobile"
import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { SearchInput } from "app/Components/SearchInput"
import React, { isValidElement, useCallback, useState } from "react"
import { FlatList, ScrollView } from "react-native"
import { MULTI_SELECT_OPTION_ITEM_HEIGHT, MultiSelectOptionItem } from "./MultiSelectOptionItem"

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

  const handleItemPress = useCallback(
    (item: FilterData) => {
      const currentParamValue = item.paramValue as boolean
      onSelect(item, !currentParamValue)
    },
    [onSelect]
  )

  const renderItem = ({ item, index }: RenderItemProps) => {
    const disabled = itemIsDisabled(item)
    const selected = itemIsSelected(item)
    const key = `multie-select-option-item-${index}`

    return (
      <MultiSelectOptionItem
        key={key}
        item={item}
        selected={selected}
        disabled={disabled}
        onPress={handleItemPress}
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
            <Flex my={2} mx={2} alignItems="center">
              <Text variant="xs">{noResultsLabel}</Text>
            </Flex>
          )}
        </>
      )}

      <Flex flexGrow={1}>
        {useScrollView ? (
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {filteredOptions.map((option, index) => renderItem({ item: option, index }))}
            {isValidElement(footerComponent) && footerComponent}
          </ScrollView>
        ) : (
          <FlatList<FilterData>
            style={{ flex: 1 }}
            data={filteredOptions}
            ListFooterComponent={footerComponent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderItem={renderItem}
            windowSize={11}
            getItemLayout={(_, index) => ({
              length: MULTI_SELECT_OPTION_ITEM_HEIGHT,
              offset: index * MULTI_SELECT_OPTION_ITEM_HEIGHT,
              index,
            })}
          />
        )}
      </Flex>
    </Flex>
  )
}
