import { BellIcon, Box, Flex, Text, TouchableHighlightColor } from "palette"
import React from "react"

export interface SavedSearchButtonV2Props {
  onPress: () => void
}

export const SavedSearchButtonV2: React.FC<SavedSearchButtonV2Props> = (props) => {
  const { onPress } = props

  return (
    <Box>
      <TouchableHighlightColor
        haptic
        onPress={onPress}
        render={({ color }) => (
          <Flex flexDirection="row" alignItems="center">
            <Box backgroundColor="white">
              <BellIcon fill={color} width="16px" height="16px" />
            </Box>
            <Text variant="xs" color={color} ml={0.5} numberOfLines={1} lineHeight={16}>
              Create Alert
            </Text>
          </Flex>
        )}
      />
    </Box>
  )
}
