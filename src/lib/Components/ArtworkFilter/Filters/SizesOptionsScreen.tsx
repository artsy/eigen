import { StackScreenProps } from "@react-navigation/stack"
import React from "react"
import { ArtworkFilterNavigationStack } from ".."
import { NewSizesOptionsScreen } from "./NewSizesOptions"

interface SizesOptionsScreen extends StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen"> {}

export const SizesOptionsScreen: React.FC<SizesOptionsScreen> = (props) => {
  return <NewSizesOptionsScreen {...props} />
}
