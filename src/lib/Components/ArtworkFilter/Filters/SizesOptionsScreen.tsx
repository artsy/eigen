import { StackScreenProps } from "@react-navigation/stack"
import React from "react"
import { ArtworkFilterNavigationStack } from ".."
import { ArtworksFiltersStore } from "../ArtworkFilterStore"
import { NewSizesOptionsScreen } from "./NewSizesOptions"
import { SizesOptionsScreen as OldSizesOptionsScreen } from "./SizesOptions"

interface SizesOptionsScreen extends StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen"> {}

export const SizesOptionsScreen: React.FC<SizesOptionsScreen> = (props) => {
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  if (filterType === "auctionResult") {
    return <OldSizesOptionsScreen {...props} />
  }

  return <NewSizesOptionsScreen {...props} />
}
