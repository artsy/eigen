import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { useFeatureFlag } from "lib/store/GlobalStore"
import React from "react"
import { SizeOptionsScreen as NewSizeOptionsScreen } from "./SizeOptionsNew"
import { SizeOptionsScreen as OldSizeOptionsScreen } from "./SizeOptionsOld"

interface SizeOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizeOptionsScreen"> {}

export const SizeOptionsScreen: React.FC<SizeOptionsScreenProps> = (props) => {
  return useFeatureFlag("ARUseImprovedArtworkFilters") ? (
    <NewSizeOptionsScreen {...props} />
  ) : (
    <OldSizeOptionsScreen {...props} />
  )
}
