import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Box, FilterIcon, Flex, Spacer, Text, TouchableHighlightColor } from "palette"
import React from "react"

interface ArtistSeriesFilterHeaderProps {
  onFilterArtworksPress: () => void
}

export const ArtistSeriesFilterHeader: React.FC<ArtistSeriesFilterHeaderProps> = (props) => {
  const { onFilterArtworksPress } = props
  const artworksTotal = ArtworksFiltersStore.useStoreState((state) => state.counts.total) ?? 0

  return (
    <Box backgroundColor="white100" py={1}>
      <Flex flexDirection="row" px={2} justifyContent="space-between" alignItems="center">
        <Text variant="subtitle" color="black60">
          Showing {artworksTotal} works
        </Text>
        <TouchableHighlightColor
          haptic
          onPress={onFilterArtworksPress}
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
      <Spacer mb={1} />
    </Box>
  )
}
