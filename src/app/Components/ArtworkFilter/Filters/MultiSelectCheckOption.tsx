import { CheckIcon, Flex, Box, Text, Separator } from "@artsy/palette-mobile"
import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { FlatList, TouchableOpacity } from "react-native"

interface MultiSelectOptionScreenProps {
  filterHeaderText: string
  filterOptions: FilterData[]
  ListHeaderComponent?: React.ReactElement
  navigation: StackNavigationProp<ParamListBase>
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  selectedOptions?: string[]
  shouldAddIndent?: (filterData: FilterData) => boolean
}

export const MultiSelectCheckOptionScreen: React.FC<MultiSelectOptionScreenProps> = ({
  filterHeaderText,
  filterOptions,
  ListHeaderComponent,
  navigation,
  onSelect,
  selectedOptions,
  shouldAddIndent,
}) => {
  const handleBackNavigation = () => {
    navigation.goBack()
  }

  const isSelected = (item: FilterData) => {
    if (typeof item?.paramValue === "string") {
      return selectedOptions?.includes(item.paramValue)
    }

    if (typeof item.paramValue === "boolean") {
      return item.paramValue
    }

    return false
  }

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterBackHeader title={filterHeaderText} onLeftButtonPress={handleBackNavigation} />
      <Flex mb={12}>
        <FlatList
          initialNumToRender={10}
          ListHeaderComponent={ListHeaderComponent}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item }) => {
            const selected = isSelected(item) as boolean

            return (
              <Box ml={0.5} accessibilityState={{ checked: selected }}>
                <CheckMarkOptionListItem
                  hasExtraLeftPadding={shouldAddIndent?.(item)}
                  item={item}
                  onSelect={onSelect}
                  selected={selected}
                />
              </Box>
            )
          }}
        />
      </Flex>
    </Flex>
  )
}

export const CheckMarkOptionListItem = ({
  item,
  onSelect,
  selected,
  hasExtraLeftPadding,
}: {
  item: FilterData
  onSelect: (filterData: FilterData, updatedValue: boolean) => void
  selected: boolean
  hasExtraLeftPadding?: boolean
}) => (
  <TouchableOpacity
    onPress={() => onSelect(item, !item.paramValue)}
    testID="multi-select-option-button"
  >
    <Flex flexGrow={1} justifyContent="space-between" flexDirection="row">
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        flexGrow={1}
        alignItems="center"
        pl={hasExtraLeftPadding ? 4 : 2}
        pr={2}
        height={60}
      >
        <Text color="mono100" variant="xs">
          {item.displayText}
          {!!item.count && (
            <Text color="mono60" variant="xs">
              {" "}
              ({item.count})
            </Text>
          )}
        </Text>

        {!!selected && (
          <Box testID={`selected-checkmark-${item.displayText}`}>
            <CheckIcon fill="mono100" />
          </Box>
        )}
      </Flex>
    </Flex>
  </TouchableOpacity>
)
