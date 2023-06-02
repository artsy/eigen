import { Text, TextProps } from "@artsy/palette-mobile"
import { FC } from "react"

export const ArtworkListsBottomSheetSectionTitle: FC<TextProps> = ({ children, ...rest }) => {
  return (
    <Text variant="sm-display" textAlign="center" {...rest}>
      {children}
    </Text>
  )
}
