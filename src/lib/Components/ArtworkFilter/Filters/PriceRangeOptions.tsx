import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { useFeatureFlag } from "lib/store/GlobalStore"
import React from "react"
import { PriceRangeOptionsScreen as NewPriceRangeOptionsScreen } from "./PriceRangeOptionsNew"
import { PriceRangeOptionsScreen as OldPriceRangeOptionsScreen } from "./PriceRangeOptionsOld"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "PriceRangeOptionsScreen"> {}

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = (props) => {
  return useFeatureFlag("ARUseImprovedArtworkFilters") ? (
    <NewPriceRangeOptionsScreen {...props} />
  ) : (
    <OldPriceRangeOptionsScreen {...props} />
  )
}
