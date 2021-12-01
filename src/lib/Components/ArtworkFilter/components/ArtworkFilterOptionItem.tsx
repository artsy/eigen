import { TouchableRow } from "lib/Components/TouchableRow"
import { ArrowRightIcon, bullet, Flex, Text } from "palette"
import React from "react"
import { FilterDisplayConfig } from "../types"

interface ArtworkFilterOptionItemProps {
  item: FilterDisplayConfig
  count?: number
  onPress: () => void
}

export const ArtworkFilterOptionItem: React.FC<ArtworkFilterOptionItemProps> = (props) => {
  const { item, count, onPress } = props

  return (
    <TouchableRow onPress={onPress}>
      <Flex flexDirection="row" justifyContent="space-between" p={2} pr={1.5}>
        <Flex minWidth="45%">
          <Text variant="xs">
            {item.displayText}
            {!!count && (
              <Text variant="xs" color="blue100" ml={4}>
                {` ${bullet} ${count}`}
              </Text>
            )}
          </Text>
        </Flex>

        <Flex flex={1} flexDirection="row" alignItems="center" justifyContent="flex-end">
          <ArrowRightIcon fill="black30" ml={1} />
        </Flex>
      </Flex>
    </TouchableRow>
  )
}
