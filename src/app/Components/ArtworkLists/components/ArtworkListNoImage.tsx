import { NoArtIcon } from "@artsy/icons/native"
import { Flex, FlexProps } from "@artsy/palette-mobile"
import { FC } from "react"

const NO_ICON_SIZE = 18

export const ArtworkListNoImage: FC<FlexProps> = (props) => {
  return (
    <Flex justifyContent="center" alignItems="center" {...props}>
      <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
    </Flex>
  )
}
