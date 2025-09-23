import { ChevronRightIcon } from "@artsy/icons/native"
import { bullet, Flex, Text } from "@artsy/palette-mobile"
import { FilterDisplayConfig } from "app/Components/ArtworkFilter/types"
import { TouchableRow } from "app/Components/TouchableRow"

export interface ArtworkFilterOptionItemProps {
  item: FilterDisplayConfig
  count?: number
  onPress: () => void
  RightAccessoryItem?: React.JSX.Element
}

export const ArtworkFilterOptionItem: React.FC<ArtworkFilterOptionItemProps> = (props) => {
  const { item, count, onPress, RightAccessoryItem } = props

  return (
    <TouchableRow onPress={onPress} testID="ArtworkFilterOptionItemRow">
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" p={2}>
        <Flex flex={1}>
          <Text variant="sm-display">
            {item.displayText}
            {!!count && <Text variant="sm-display" color="blue100">{` ${bullet} ${count}`}</Text>}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          {RightAccessoryItem || (
            <ChevronRightIcon fill="mono100" ml={1} testID="ArtworkFilterOptionItemArrowIcon" />
          )}
        </Flex>
      </Flex>
    </TouchableRow>
  )
}
