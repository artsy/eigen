import { SavedSearchListItem_item } from "__generated__/SavedSearchListItem_item.graphql"
import { Box, ChevronIcon, Flex, Pill, Text, Touchable, useColor } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface SavedSearchListItemProps {
  item: SavedSearchListItem_item
  onPress?: () => void
}

const FALLBACK_TITLE = "Untitled Alert"
const DISPLAY_PILLS_COUNT = 8

export const SavedSearchListItem: React.FC<SavedSearchListItemProps> = (props) => {
  const { item, onPress } = props
  const [displayAllFilters, setDisplayAllFilters] = useState(false)
  const color = useColor()
  const slicedLabels = item.labels.slice(0, DISPLAY_PILLS_COUNT)
  const labels = displayAllFilters ? item.labels : slicedLabels

  const toggleDisplayAllFiltersState = () => {
    setDisplayAllFilters(!displayAllFilters)
  }

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
          {labels.map((entity) => (
            <Pill m={0.5} key={entity.value}>
              {entity.value}
            </Pill>
          ))}

          {item.labels.length > DISPLAY_PILLS_COUNT && (
            <Touchable onPress={toggleDisplayAllFiltersState}>
              <Flex
                flexDirection="row"
                m={0.5}
                height={30}
                alignItems="center"
                justifyContent="center"
                px={1}
              >
                <Text variant="xs" underline>
                  {displayAllFilters ? "Close all filters" : "Show all filters"}
                </Text>
                <ChevronIcon
                  direction={displayAllFilters ? "up" : "down"}
                  height={15}
                  mt="2px"
                  ml={0.5}
                />
              </Flex>
            </Touchable>
          )}
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
