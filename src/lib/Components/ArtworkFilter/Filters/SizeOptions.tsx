import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import React from "react"
import { SizeOptionsScreen as NewSizeOptionsScreen } from "./SizeOptionsNew"

interface SizeOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "SizeOptionsScreen"> {}

export const SizeOptionsScreen: React.FC<SizeOptionsScreenProps> = (props) => {
  return <NewSizeOptionsScreen {...props} />
}
