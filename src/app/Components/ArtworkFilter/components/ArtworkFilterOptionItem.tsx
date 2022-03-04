import { TouchableRow } from "app/Components/TouchableRow"
import { ArrowRightIcon, bullet, Flex, Text } from "palette"
import React from "react"
import { FilterDisplayConfig } from "../types"

export interface ArtworkFilterOptionItemProps {
  item: FilterDisplayConfig
  count?: number
  onPress: () => void
  RightAccessoryItem?: JSX.Element
}

export const ArtworkFilterOptionItem: React.FC<ArtworkFilterOptionItemProps> = (props) => {
  const { item, count, onPress, RightAccessoryItem } = props

  return (
    <TouchableRow onPress={onPress} testID="ArtworkFilterOptionItemRow">
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" p={2}>
        <Flex flex={1}>
          <Text variant="md">
            {item.displayText}
            {!!count && <Text variant="md" color="blue100">{` ${bullet} ${count}`}</Text>}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          {RightAccessoryItem || (
            <ArrowRightIcon fill="black100" ml={1} testID="ArtworkFilterOptionItemArrowIcon" />
          )}
        </Flex>
      </Flex>
    </TouchableRow>
  )
}
