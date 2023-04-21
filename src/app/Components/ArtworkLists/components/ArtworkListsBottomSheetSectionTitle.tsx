import { Text } from "@artsy/palette-mobile"
import { FC } from "react"

export const ArtworkListsBottomSheetSectionTitle: FC = ({ children }) => {
  return (
    <Text variant="sm-display" textAlign="center" my={1}>
      {children}
    </Text>
  )
}
