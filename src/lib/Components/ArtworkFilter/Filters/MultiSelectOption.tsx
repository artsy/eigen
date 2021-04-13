import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import { FilterToggleButton } from "lib/Components/ArtworkFilter/Filters/FilterToggleButton"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box, Check, Flex, Sans, Separator, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { TouchableRow } from "lib/Components/TouchableRow"

interface MultiSelectOptionScreenProps {
  navigation: StackNavigationProp<ParamListBase>
  filterHeaderText: string
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  filterOptions: FilterData[]
  isSelected?: (item: FilterData) => boolean
  isDisabled?: (item: FilterData) => boolean
}

export const MultiSelectOptionScreen: React.FC<MultiSelectOptionScreenProps> = ({
  filterHeaderText,
  onSelect,
  filterOptions,
  navigation,
  isSelected,
  isDisabled,
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

  const shouldUseImprovedArtworkFilters = useFeatureFlag("ARUseImprovedArtworkFilters")

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={handleBackNavigation}>{filterHeaderText}</FancyModalHeader>
      <Flex flexGrow={1}>
        <FlatList<FilterData>
          style={{ flex: 1 }}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          ItemSeparatorComponent={shouldUseImprovedArtworkFilters ? null : Separator}
          renderItem={({ item }) => {
            return (
              <Box ml={0.5}>
                {shouldUseImprovedArtworkFilters ? (
                  <TouchableRow
                    onPress={() => {
                      const currentParamValue = item.paramValue as boolean
                      onSelect(item, !currentParamValue)
                    }}
                  >
                    <OptionListItem>
                      <Text variant="caption" color="black100">
                        {item.displayText}
                      </Text>

                      <Check selected={itemIsSelected(item)} disabled={itemIsDisabled(item)} />
                    </OptionListItem>
                  </TouchableRow>
                ) : (
                  <OptionListItem>
                    <Flex mb={0.5}>
                      <Sans color="black100" size="3t">
                        {item.displayText}
                      </Sans>
                    </Flex>

                    <FilterToggleButton
                      onChange={() => {
                        const currentParamValue = item.paramValue as boolean
                        onSelect(item, !currentParamValue)
                      }}
                      value={itemIsSelected(item)}
                      disabled={itemIsDisabled(item)}
                    />
                  </OptionListItem>
                )}
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
  align-items: flex-end;
  padding: 15px;
`
