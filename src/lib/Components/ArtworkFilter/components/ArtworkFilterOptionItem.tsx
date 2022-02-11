import { TouchableRow } from "lib/Components/TouchableRow"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { ArrowRightIcon, bullet, Flex, Text } from "palette"
import React from "react"
import { FilterDisplayConfig } from "../types"

export interface ArtworkFilterOptionItemProps {
  item: FilterDisplayConfig
  count?: number
  onPress: () => void
}

export const ArtworkFilterOptionItem: React.FC<ArtworkFilterOptionItemProps> = (props) => {
  const { item, count, onPress } = props
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  if (isEnabledImprovedAlertsFlow) {
    return (
      <TouchableRow onPress={onPress}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" p={2}>
          <Flex flex={1}>
            <Text variant="md">
              {item.displayText}
              {!!count && <Text variant="md" color="blue100">{` ${bullet} ${count}`}</Text>}
            </Text>
          </Flex>
          <Flex alignItems="center" justifyContent="flex-end">
            {item.RightAccessoryItem ? (
              item.RightAccessoryItem(props)
            ) : (
              <ArrowRightIcon fill="black100" ml={1} />
            )}
          </Flex>
        </Flex>
      </TouchableRow>
    )
  }

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

        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
          {item.RightAccessoryItem ? (
            item.RightAccessoryItem(props)
          ) : (
            <ArrowRightIcon fill="black30" ml={1} />
          )}
        </Flex>
      </Flex>
    </TouchableRow>
  )
}
