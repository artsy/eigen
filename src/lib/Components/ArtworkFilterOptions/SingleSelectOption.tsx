import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { FilterData } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Box, CheckIcon, Flex, RadioDot, Separator, Text } from "palette"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"

interface SingleSelectOptionScreenProps {
  navigation: StackNavigationProp<ParamListBase>
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
  navigation,
  ListHeaderComponent,
  withExtraPadding = false,
}) => {
  const handleBackNavigation = () => {
    navigation.goBack()
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
}) => {
  const useImprovedArtworkFilters = useFeatureFlag("ARUseImprovedArtworkFilters")
  const selected = item.displayText === selectedOption.displayText

  return (
    <SingleSelectOptionListItemRow onPress={() => onSelect(item)}>
      <OptionListItem>
        <InnerOptionListItem px={withExtraPadding && item.displayText !== "All" ? 3 : 2}>
          <Text color="black100" variant="caption">
            {item.displayText}
            {!!item.count && (
              <Text color="black60" variant="caption">
                {" "}
                ({item.count})
              </Text>
            )}
          </Text>
          {useImprovedArtworkFilters ? (
            <RadioDot selected={selected} />
          ) : (
            !!selected && (
              <Box mb={0.1}>
                <CheckIcon fill="black100" />
              </Box>
            )
          )}
        </InnerOptionListItem>
      </OptionListItem>
    </SingleSelectOptionListItemRow>
  )
}

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
