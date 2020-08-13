import React, { SFC } from "react"
import { color } from "../../helpers"
import { styledWrapper } from "../../platform/primitives"
import { SansSize } from "../../Theme"
import { Flex, FlexProps } from "../Flex"
import { Sans } from "../Typography"

/**
 * Spec: zpl.io/2Zg4Rdq
 */

interface MessageProps extends FlexProps {
  children: React.ReactNode | null
  /**
   * Size of text to display in message window
   */
  textSize?: SansSize
}

const StyledFlex = styledWrapper(Flex)`
  background-color: ${color("black5")};
  border-radius: 2px;
`

/**
 * A generic message window for displaying ZerStates, notices, errors, etc.
 *
 * Spec: zpl.io/2Zg4Rdq
 */
export const Message: SFC<MessageProps> = ({
  children,
  textSize = "3t",
  ...others
}) => {
  return (
    <StyledFlex p={2} {...others}>
      <Sans size={textSize} color={color("black60")} weight="regular">
        {children}
      </Sans>
    </StyledFlex>
  )
}
