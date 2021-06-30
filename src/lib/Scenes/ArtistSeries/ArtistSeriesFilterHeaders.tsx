import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworksFilterHeader } from 'lib/Components/ArtworkGrids/FilterHeader'
import { Box, FilterIcon, Flex, Spacer, Text, TouchableHighlightColor } from "palette"
import React from "react"

interface ArtistSeriesFilterHeaderProps {
  onFilterArtworksPress: () => void
}

export const ArtistSeriesFilterHeader: React.FC<ArtistSeriesFilterHeaderProps> = (props) => {
  const { onFilterArtworksPress } = props
  const artworksTotal = ArtworksFiltersStore.useStoreState((state) => state.counts.total) ?? 0

  return (
    <Box backgroundColor="white100">
      <ArtworksFilterHeader count={artworksTotal} onFilterPress={onFilterArtworksPress} />
    </Box>
  )
}
