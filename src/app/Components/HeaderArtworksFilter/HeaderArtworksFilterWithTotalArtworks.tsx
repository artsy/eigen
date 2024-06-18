import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { HeaderArtworksFilter } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilter"
import { Animated } from "react-native"

interface HeaderArtworksFilterWithTotalArtworksProps {
  animationValue?: Animated.Value
  onPress: () => void
  hideArtworksCount?: boolean
}

export const HeaderArtworksFilterWithTotalArtworks: React.FC<
  HeaderArtworksFilterWithTotalArtworksProps
> = (props) => {
  const artworksTotal = ArtworksFiltersStore.useStoreState((state) => state.counts.total) ?? 0

  return <HeaderArtworksFilter total={artworksTotal} {...props} />
}
