import { Flex, FlexProps } from "@artsy/palette-mobile"
import { FC } from "react"

export const ArtworkListImageBorder: FC<FlexProps> = (props) => {
  return (
    <Flex bg="black5" justifyContent="center" alignItems="center" borderColor="black15" {...props}>
      {props.children}
    </Flex>
  )
}
