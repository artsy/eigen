import { SavedSearchListItem_item } from "__generated__/SavedSearchListItem_item.graphql"
import { Box, ChevronIcon, Flex, Pill, Text, Touchable, useColor } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface SavedSearchListItemProps {
  item: SavedSearchListItem_item
  onPress?: () => void
}

const FALLBACK_TITLE = "Untitled Alert"

export const SavedSearchListItem: React.FC<SavedSearchListItemProps> = (props) => {
  const { item, onPress } = props
  const color = useColor()

  return (
    <Touchable onPress={onPress} underlayColor={color("black5")}>
      <Box px={2} py={1.5}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flex={1} flexDirection="row" mr="2">
            <Text variant="sm">{item.userAlertSettings.name ?? FALLBACK_TITLE}</Text>
          </Flex>
          <ChevronIcon direction="right" fill="black60" />
        </Flex>
        <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
          {item.labels.map((entity) => (
            <Pill m={0.5} key={entity.value}>
              {entity.value}
            </Pill>
          ))}
        </Flex>
      </Box>
    </Touchable>
  )
}

export const SavedSearchListItemFragmentContainer = createFragmentContainer(SavedSearchListItem, {
  item: graphql`
    fragment SavedSearchListItem_item on SearchCriteria {
      labels {
        value
      }
      userAlertSettings {
        name
      }
    }
  `,
})
