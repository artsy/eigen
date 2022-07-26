import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtistIDsArtworksOptionsScreen } from "./ArtistIDsArtworksOptions"
import { ArtistIDsSaleArtworksOptionsScreen } from "./ArtistIDsSaleArtworksOptionsScreen"

export const ArtistIDsOptionsScreen = (
  props: StackScreenProps<ArtworkFilterNavigationStack, "ArtistIDsOptionsScreen">
) => {
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  // TODO: Replace newSaleArtwork when AREnableArtworksConnectionForAuction is released
  if (filterType === "saleArtwork" || filterType === "newSaleArtwork") {
    return <ArtistIDsSaleArtworksOptionsScreen {...props} />
  }
  return <ArtistIDsArtworksOptionsScreen {...props} />
}
