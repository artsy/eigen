import { Flex, FlexProps, NoImageIcon } from "@artsy/palette-mobile"
import { FC } from "react"

const NO_ICON_SIZE = 18

export const ArtworkListNoImage: FC<FlexProps> = (props) => {
  return (
    <Flex
      bg="black5"
      justifyContent="center"
      alignItems="center"
      borderWidth={1}
      borderColor="black15"
      {...props}
    >
      <NoImageIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="black60" />
    </Flex>
  )
}
