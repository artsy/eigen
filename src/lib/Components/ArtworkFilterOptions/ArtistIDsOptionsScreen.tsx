import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { FilterModalNavigationStack } from "../ArtworkFilter"
import { ArtistIDsArtworksOptionsScreen } from "./ArtistIDsArtworksOptions"
import { ArtistIDsSaleArtworksOptionsScreen } from "./ArtistIDsSaleArtworksOptionsScreen"

export const ArtistIDsOptionsScreen = (
  props: StackScreenProps<FilterModalNavigationStack, "ArtistIDsOptionsScreen">
) => {
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  if (filterType === "saleArtwork") {
    return <ArtistIDsSaleArtworksOptionsScreen {...props} />
  }
  return <ArtistIDsArtworksOptionsScreen {...props} />
}
