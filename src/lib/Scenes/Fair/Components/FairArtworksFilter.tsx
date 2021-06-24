import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { HeaderArtworksFilter } from "lib/Components/HeaderArtworksFilter"
import React from "react"
import { Animated } from "react-native"

interface FairArtworksFilterProps {
  animationValue: Animated.Value
  onPress: () => void
}

export const FairArtworksFilter: React.FC<FairArtworksFilterProps> = (props) => {
  const artworksTotal = ArtworksFiltersStore.useStoreState((state) => state.counts.total) ?? 0

  return <HeaderArtworksFilter total={artworksTotal} {...props} />
}
