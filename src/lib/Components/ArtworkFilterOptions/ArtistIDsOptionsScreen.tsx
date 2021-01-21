import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { useContext } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { ArtistIDsArtworksOptionsScreen } from "./ArtistIDsArtworksOptions"
import { ArtistIDsSaleArtworksOptionsScreen } from "./ArtistIDsSaleArtworksOptionsScreen"

export const ArtistIDsOptionsScreen = (
  props: StackScreenProps<FilterModalNavigationStack, "ArtistIDsOptionsScreen">
) => {
  const { state } = useContext(ArtworkFilterContext)
  if (state.filterType === "saleArtwork") {
    return <ArtistIDsSaleArtworksOptionsScreen {...props} />
  }
  return <ArtistIDsArtworksOptionsScreen {...props} />
}
