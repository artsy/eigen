import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { HeaderArtworksFilter } from "lib/Components/HeaderArtworksFilter"
import React from "react"

export const ShowArtworksFilter: React.FC<any> = (props) => {
  const artworksTotal = ArtworksFiltersStore.useStoreState((state) => state.counts.total) ?? 0

  return <HeaderArtworksFilter total={artworksTotal} {...props} />
}
