import { Box, ChevronIcon, Flex, Text, Touchable, useColor } from "palette"
import React from "react"

interface SavedSearchListItemProps {
  title: string
  onPress?: () => void
}

export const SavedSearchListItem: React.FC<SavedSearchListItemProps> = (props) => {
  const { title, onPress } = props
  const color = useColor()

  return (
    <Touchable onPress={onPress} underlayColor={color("black5")}>
      <Box px={2} py={1.5}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flex={1} flexDirection="row" mr="2">
            <Text variant="text">{title}</Text>
          </Flex>
          <ChevronIcon direction="right" fill="black60" />
        </Flex>
      </Box>
    </Touchable>
  )
}
