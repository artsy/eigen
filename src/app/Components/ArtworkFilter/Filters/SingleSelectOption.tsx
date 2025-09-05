import { Flex, Text, RadioDot } from "@artsy/palette-mobile"
import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { NavigationHeaderProps } from "app/Components/NavigationHeader"
import { TouchableRow } from "app/Components/TouchableRow"
import React, { Fragment } from "react"
import { FlatList, ScrollView } from "react-native"
import styled from "styled-components/native"

interface SingleSelectOptionScreenProps extends NavigationHeaderProps {
  navigation: StackNavigationProp<ParamListBase>
  filterHeaderText: string
  selectedOption: FilterData
  filterOptions: Array<FilterData | React.JSX.Element>
  ListHeaderComponent?: React.JSX.Element
  withExtraPadding?: boolean
  useScrollView?: boolean
  rightButtonText?: string
  onSelect: (any: any) => void
  onRightButtonPress?: () => void
}

const isFilterData = (item: any): item is FilterData => {
  return "paramValue" in item
}

export const SingleSelectOptionScreen: React.FC<SingleSelectOptionScreenProps> = ({
  filterHeaderText,
  selectedOption,
  filterOptions,
  navigation,
  ListHeaderComponent,
  withExtraPadding = false,
  useScrollView = false,
  rightButtonText,
  onSelect,
  onRightButtonPress,
}) => {
  const handleBackNavigation = () => {
    navigation.goBack()
  }
  const keyExtractor = (_item: FilterData | React.JSX.Element, index: number) => String(index)
  const renderItem = (item: FilterData | React.JSX.Element) => {
    if (isFilterData(item)) {
      return (
        <ListItem
          item={item}
          selectedOption={selectedOption}
          onSelect={onSelect}
          withExtraPadding={withExtraPadding}
        />
      )
    }

    // Otherwise just return React.JSX.Element
    return item
  }

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterBackHeader
        title={filterHeaderText}
        onLeftButtonPress={handleBackNavigation}
        onRightButtonPress={onRightButtonPress}
        rightButtonText={rightButtonText}
      />

      <Flex flexGrow={1}>
        {useScrollView ? (
          <ScrollView style={{ flex: 1 }}>
            {ListHeaderComponent}
            {filterOptions.map((item, index) => {
              return <Fragment key={keyExtractor(item, index)}>{renderItem(item)}</Fragment>
            })}
          </ScrollView>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            initialNumToRender={100}
            ListHeaderComponent={ListHeaderComponent}
            keyExtractor={keyExtractor}
            data={filterOptions}
            ItemSeparatorComponent={null}
            renderItem={({ item }) => renderItem(item)}
          />
        )}
      </Flex>
    </Flex>
  )
}

export const ListItem = ({
  item,
  onSelect,
  selectedOption,
  withExtraPadding,
}: {
  item: FilterData
  onSelect: (any: any) => void
  selectedOption: FilterData
  withExtraPadding?: boolean
}) => {
  const selected = item.paramValue === selectedOption.paramValue

  return (
    <TouchableRow accessibilityState={{ selected }} onPress={() => onSelect(item)}>
      <OptionListItem>
        <InnerOptionListItem px={withExtraPadding && item.displayText !== "All" ? 4 : 2}>
          <Text color="mono100" variant="xs">
            {item.displayText}
            {!!item.count && (
              <Text color="mono60" variant="xs">
                {" "}
                ({item.count})
              </Text>
            )}
          </Text>
          <RadioDot selected={selected} />
        </InnerOptionListItem>
      </OptionListItem>
    </TouchableRow>
  )
}

export const InnerOptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
  height: 60px;
`

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
