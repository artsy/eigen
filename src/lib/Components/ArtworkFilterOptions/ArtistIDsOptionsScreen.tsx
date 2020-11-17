import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { useContext } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { ArtistIDsArtworksOptionsScreen } from "./ArtistIDsArtworksOptions"
import { ArtistIDsSaleArtworksOptionsScreen } from "./ArtistIDsSaleArtworksOptionsScreen"

export const ArtistIDsOptionsScreen = ({ navigator }: { navigator: NavigatorIOS }) => {
  const { state } = useContext(ArtworkFilterContext)
  if (state.filterType === "saleArtwork") {
    return <ArtistIDsSaleArtworksOptionsScreen navigator={navigator} />
  }
  return <ArtistIDsArtworksOptionsScreen navigator={navigator} />
}
