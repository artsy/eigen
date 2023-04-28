import { FlexProps, NoImageIcon } from "@artsy/palette-mobile"
import { ArtworkListImageBorder } from "app/Scenes/ArtworkLists/components/ArtworkListImageBorder"
import { FC } from "react"

const NO_ICON_SIZE = 18

export const ArtworkListNoImage: FC<FlexProps> = (props) => {
  return (
    <ArtworkListImageBorder {...props} borderWidth={1}>
      <NoImageIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="black60" />
    </ArtworkListImageBorder>
  )
}
