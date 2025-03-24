import { Text, TextProps } from "@artsy/palette-mobile"
import { FC } from "react"

export const ArtworkListsBottomSheetSectionTitle: FC<TextProps> = ({ children, ...rest }) => {
  return (
    <Text variant="lg-display" {...rest}>
      {children}
    </Text>
  )
}
