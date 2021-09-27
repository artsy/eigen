import { bullet, FilterIcon, Flex, Text, TouchableHighlightColor } from "palette"
import React from "react"

interface FilterHeaderProps {
  children?: React.ReactNode
  onFilterPress: () => void
  selectedFiltersCount: number
}

export const ArtworksFilterHeader: React.FC<FilterHeaderProps> = ({
  children,
  onFilterPress,
  selectedFiltersCount,
}) => {
  return (
    <Flex flexDirection="row" height={28} my={1} px={2} justifyContent="space-between" alignItems="center">
      <TouchableHighlightColor
        haptic
        onPress={onFilterPress}
        render={({ color }) => (
          <Flex flex={1} flexDirection="row" alignItems="center">
            <FilterIcon fill={color} width="20px" height="20px" />
            <Text variant="xs" numberOfLines={1} color={color} ml={0.5}>
              Sort & Filter
            </Text>
            {selectedFiltersCount > 0 && (
              <Text variant="xs" color="blue100">
                {` ${bullet} ${selectedFiltersCount}`}
              </Text>
            )}
          </Flex>
        )}
      />
      {children}
    </Flex>
  )
}
