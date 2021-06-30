import { FilterIcon, Flex, Text, TouchableHighlightColor } from 'palette';
import React from "react";

interface ArtworksFilterHeaderProps {
  count: number
  onFilterPress: () => void
}

export const ArtworksFilterHeader: React.FC<ArtworksFilterHeaderProps> = (props) => {
  const { count, onFilterPress } = props

  return (
    <Flex flexDirection="row" my={2} px={2} justifyContent="space-between" alignItems="center">
      <Text variant="subtitle" color="black60">
        Showing {count} works
      </Text>
      <TouchableHighlightColor
        haptic
        onPress={onFilterPress}
        render={({ color }) => (
          <Flex flexDirection="row" alignItems="center">
            <FilterIcon fill={color} width="20px" height="20px" />
            <Text variant="subtitle" color={color}>
              Sort & Filter
            </Text>
          </Flex>
        )}
      />
    </Flex>
  )
}
